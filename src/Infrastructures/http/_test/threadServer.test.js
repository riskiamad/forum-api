const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const {nanoid} = require("nanoid");

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should response 201 and persisted thread', async () => {
      // Arrange
      const requestPayload = {
        title: 'Judul Thread',
        body: 'Body Thread',
      };
      const server = await createServer(container);
      const accessToken = await ServerTestHelper.generateToken();

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {'Authorization': `Bearer ${accessToken}`},
      });

      // Assert
      const responseJSON = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJSON.status).toEqual('success');
      expect(responseJSON.data.addedThread).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      const server = await createServer(container);
      const accessToken = await ServerTestHelper.generateToken();

      // Arrange
      const requestPayload = {
        title: 'Judul Thread',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {'Authorization': `Bearer ${accessToken}`},
      });

      // Assert
      const responseJSON = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJSON.status).toEqual('fail');
      expect(responseJSON.message).toEqual('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data specification', async () => {
      const server = await createServer(container);
      const accessToken = await ServerTestHelper.generateToken();

      // Arrange
      const requestPayload = {
        title: 'Judul Thread',
        body: 123,
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {'Authorization': `Bearer ${accessToken}`},
      });

      // Assert
      const responseJSON = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJSON.status).toEqual('fail');
      expect(responseJSON.message).toEqual('tidak dapat membuat thread baru karena tipe data tidak sesuai');
    });
  });

  describe('when GET /threads/{threadId}', () => {
    it('should response 200 and return thread', async () => {
      // Arrange
      const randomId = nanoid(16);
      await UsersTableTestHelper.addUser({ id: `user-${randomId}`, username: `riskiamad${randomId}`});
      await ThreadsTableTestHelper.addThread( { id: `thread-${randomId}`, owner: `user-${randomId}`});
      await ThreadCommentsTableTestHelper.addComment( { id: `comment-${randomId}`, threadId: `thread-${randomId}`, owner: `user-${randomId}`})
      const threadId = `thread-${randomId}`;
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      // Assert
      const responseJSON = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJSON.status).toEqual('success');
      expect(responseJSON.data.thread).toBeDefined();
    });

    it('should response 404 and return not found error', async () => {
      // Arrange
      const threadId = `xxx`;
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      // Assert
      const responseJSON = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJSON.status).toEqual('fail');
      expect(responseJSON.message).toEqual('thread tidak ditemukan');
    });
  });
})
