const pool = require('../../database/postgres/pool');
const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads/{threadId}/comments endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadCommentsTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and persisted comment', async () => {
      const server = await createServer(container);
      const accessToken = await ServerTestHelper.generateToken();

      // Add thread
      const requestThreadPayload = {
        title: 'Judul Thread',
        body: 'Body Thread',
      };
      const responseThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestThreadPayload,
        headers: {'Authorization': `Bearer ${accessToken}`},
      });
      const responseThreadJson = JSON.parse(responseThread.payload);
      const threadId = responseThreadJson.data.addedThread.id;

      // Arrange
      const requestPayload = {
        content: 'content comment',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {'Authorization': `Bearer ${accessToken}`},
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
    });

    it('should response 404 because thread not found', async () => {
      const server = await createServer(container);
      const accessToken = await ServerTestHelper.generateToken();

      // Arrange
      const requestPayload = {
        content: 'content comment',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/xxx/comments`,
        payload: requestPayload,
        headers: {'Authorization': `Bearer ${accessToken}`},
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });

    it('should response 400 when request payload not contain needed property', async () => {
      const server = await createServer(container);
      const accessToken = await ServerTestHelper.generateToken();

      // Add thread
      const requestThreadPayload = {
        title: 'Judul Thread',
        body: 'Body Thread',
      };
      const responseThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestThreadPayload,
        headers: {'Authorization': `Bearer ${accessToken}`},
      });
      const responseThreadJson = JSON.parse(responseThread.payload);
      const threadId = responseThreadJson.data.addedThread.id;

      // Arrange
      const requestPayload = {};

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {'Authorization': `Bearer ${accessToken}`},
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat menambahkan comment baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data specification', async () => {
      const server = await createServer(container);
      const accessToken = await ServerTestHelper.generateToken();

      // Add thread
      const requestThreadPayload = {
        title: 'Judul Thread',
        body: 'Body Thread',
      };
      const responseThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestThreadPayload,
        headers: {'Authorization': `Bearer ${accessToken}`},
      });
      const responseThreadJson = JSON.parse(responseThread.payload);
      const threadId = responseThreadJson.data.addedThread.id;

      // Arrange
      const requestPayload = {
        content: 123,
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {'Authorization': `Bearer ${accessToken}`},
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat menambahkan comment baru karena tipe data tidak sesuai');
    })
  });

  describe('when DELETE /thread/{threadId}/comments/{commentId}', () => {
    it('should response 200 and success', async () => {
      const server = await createServer(container);
      const accessToken = await ServerTestHelper.generateToken();

      // Add thread
      const requestThreadPayload = {
        title: 'Judul Thread',
        body: 'Body Thread',
      };

      const responseThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestThreadPayload,
        headers: {'Authorization': `Bearer ${accessToken}`},
      });
      const responseThreadJson = JSON.parse(responseThread.payload);
      const threadId = responseThreadJson.data.addedThread.id;

      // Add Comment
      const requestCommentPayload = {
        content: 'content comment',
      };

      const responseComment = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestCommentPayload,
        headers: {'Authorization': `Bearer ${accessToken}`},
      });
      const responseCommentJson = JSON.parse(responseComment.payload);
      const commentId = responseCommentJson.data.addedComment.id;

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {'Authorization': `Bearer ${accessToken}`},
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 403 and unauthorized', async () => {
      const server = await createServer(container);
      const accessToken = await ServerTestHelper.generateToken();

      // Add thread
      const requestThreadPayload = {
        title: 'Judul Thread',
        body: 'Body Thread',
      };

      const responseThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestThreadPayload,
        headers: {'Authorization': `Bearer ${accessToken}`},
      });
      const responseThreadJson = JSON.parse(responseThread.payload);
      const threadId = responseThreadJson.data.addedThread.id;

      // Add Comment
      const requestCommentPayload = {
        content: 'content comment',
      };

      // Arrange
      const responseComment = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestCommentPayload,
        headers: {'Authorization': `Bearer ${accessToken}`},
      });
      const responseCommentJson = JSON.parse(responseComment.payload);
      const commentId = responseCommentJson.data.addedComment.id;
      const newAccessToken = await ServerTestHelper.generateToken();

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {'Authorization': `Bearer ${newAccessToken}`},
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat menghapus comment yang bukan milik anda');
    });

    it('should response 404 and return not found error', async () => {
      const server = await createServer(container);
      const accessToken = await ServerTestHelper.generateToken();

      // Add thread
      const requestThreadPayload = {
        title: 'Judul Thread',
        body: 'Body Thread',
      };

      const responseThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestThreadPayload,
        headers: {'Authorization': `Bearer ${accessToken}`},
      });
      const responseThreadJson = JSON.parse(responseThread.payload);
      const threadId = responseThreadJson.data.addedThread.id;

      const commentId = 'xxx';

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {'Authorization': `Bearer ${accessToken}`},
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('comment tidak ditemukan');
    });
  });
});
