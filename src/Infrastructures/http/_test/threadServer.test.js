const pool = require('../../database/postgres/pool');
const container = require('../../container');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
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
      const server = await createServer(container);
      const accessToken = await ServerTestHelper.generateToken();

      // Add Thread
      const requestThreadPayload = {
        title: 'Judul Thread',
        body: 'Body Thread',
      };

      const addThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestThreadPayload,
        headers: {'Authorization': `Bearer ${accessToken}`},
      });
      const responseThreadJson = JSON.parse(addThread.payload);
      const threadId = responseThreadJson.data.addedThread.id;

      // Add Comment
      const requestCommentPayload = {
        content: 'comment content',
      };

      const addComment = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestCommentPayload,
        headers: {'Authorization': `Bearer ${accessToken}`},
      });
      const responseCommentJson = JSON.parse(addComment.payload);
      const commentId = responseCommentJson.data.addedComment.id;

      // Add Reply
      const requestReplyPayload = {
        content: 'comment reply',
      };

      await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestReplyPayload,
        headers: {'Authorization': `Bearer ${accessToken}`},
      });

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
      expect(responseJSON.data.thread.comments).toBeDefined();
      expect(responseJSON.data.thread.comments[0].replies).toBeDefined();
    });

    it('should response 200 and return thread with deleted comment', async () => {
      // Arrange
      const server = await createServer(container);
      const accessToken = await ServerTestHelper.generateToken();

      // Add Thread
      const requestThreadPayload = {
        title: 'Judul Thread',
        body: 'Body Thread',
      };

      const addThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestThreadPayload,
        headers: {'Authorization': `Bearer ${accessToken}`},
      });
      const responseThreadJson = JSON.parse(addThread.payload);
      const threadId = responseThreadJson.data.addedThread.id;

      // Add Comment
      const requestCommentPayload = {
        content: 'comment content',
      };

      const addComment = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestCommentPayload,
        headers: {'Authorization': `Bearer ${accessToken}`},
      });
      const responseCommentJson = JSON.parse(addComment.payload);
      const commentId = responseCommentJson.data.addedComment.id;

      // Delete Comment
      await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {'Authorization': `Bearer ${accessToken}`},
      });

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
      expect(responseJSON.data.thread.comments).toBeDefined();
      expect(responseJSON.data.thread.comments[0].content).toEqual('**komentar telah dihapus**');
    });

    it('should response 200 and return thread with deleted reply', async () => {
      // Arrange
      const server = await createServer(container);
      const accessToken = await ServerTestHelper.generateToken();

      // Add Thread
      const requestThreadPayload = {
        title: 'Judul Thread',
        body: 'Body Thread',
      };

      const addThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestThreadPayload,
        headers: {'Authorization': `Bearer ${accessToken}`},
      });
      const responseThreadJson = JSON.parse(addThread.payload);
      const threadId = responseThreadJson.data.addedThread.id;

      // Add Comment
      const requestCommentPayload = {
        content: 'comment content',
      };

      const addComment = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestCommentPayload,
        headers: {'Authorization': `Bearer ${accessToken}`},
      });
      const responseCommentJson = JSON.parse(addComment.payload);
      const commentId = responseCommentJson.data.addedComment.id;

      // Add Reply
      const requestReplyPayload = {
        content: 'comment reply',
      };

      const addReply = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestReplyPayload,
        headers: {'Authorization': `Bearer ${accessToken}`},
      });
      const responseReplyJson = JSON.parse(addReply.payload);
      const replyId = responseReplyJson.data.addedReply.id;

      // Delete Reply
      await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {'Authorization': `Bearer ${accessToken}`},
      });

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
      expect(responseJSON.data.thread.comments).toBeDefined();
      expect(responseJSON.data.thread.comments[0].replies).toBeDefined();
      expect(responseJSON.data.thread.comments[0].replies[0].content).toEqual('**balasan telah dihapus**');
    });

    it('should response 200 and return thread without comment', async () => {
      // Arrange
      const server = await createServer(container);
      const accessToken = await ServerTestHelper.generateToken();

      // Add Thread
      const requestThreadPayload = {
        title: 'Judul Thread',
        body: 'Body Thread',
      };

      const addThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestThreadPayload,
        headers: {'Authorization': `Bearer ${accessToken}`},
      });
      const responseThreadJson = JSON.parse(addThread.payload);
      const threadId = responseThreadJson.data.addedThread.id;

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
      expect(responseJSON.data.thread.comments).not.toBeDefined();
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
