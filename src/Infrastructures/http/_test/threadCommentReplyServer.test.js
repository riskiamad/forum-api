const pool = require('../../database/postgres/pool');
const ThreadCommentRepliesTablesTestHelper = require('../../../../tests/ThreadCommentRepliesTableTestHelper');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads/{threadId}/comments/{commentId}/replies', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadCommentRepliesTablesTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 201 and persisted reply', async () => {
      const server = await createServer(container);
      const accessToken = await ServerTestHelper.generateToken();

      // Add Thread
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
        content: 'content comment'
      };
      const responseComment = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestCommentPayload,
        headers: {'Authorization': `Bearer ${accessToken}`},
      });
      const responseCommentJson = JSON.parse(responseComment.payload);
      const commentId = responseCommentJson.data.addedComment.id;

      // Arrange
      const requestPayload = {
        content: 'content reply',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {'Authorization': `Bearer ${accessToken}`},
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedReply).toBeDefined();
    });

    it('should response 404 because thread not found', async () => {
      const server = await createServer(container);
      const accessToken = await ServerTestHelper.generateToken();

      // Add Thread
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
        content: 'content comment'
      };
      const responseComment = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestCommentPayload,
        headers: {'Authorization': `Bearer ${accessToken}`},
      });
      const responseCommentJson = JSON.parse(responseComment.payload);
      const commentId = responseCommentJson.data.addedComment.id;

      // Arrange
      const requestPayload = {
        content: 'content reply',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/xxx/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {'Authorization': `Bearer ${accessToken}`},
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });

    it('should response 404 because thread not found', async () => {
      const server = await createServer(container);
      const accessToken = await ServerTestHelper.generateToken();

      // Add Thread
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
        content: 'content comment'
      };
      const responseComment = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestCommentPayload,
        headers: {'Authorization': `Bearer ${accessToken}`},
      });
      const responseCommentJson = JSON.parse(responseComment.payload);
      const commentId = responseCommentJson.data.addedComment.id;

      // Arrange
      const requestPayload = {
        content: 'content reply',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/xxx/replies`,
        payload: requestPayload,
        headers: {'Authorization': `Bearer ${accessToken}`},
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('comment tidak ditemukan');
    });

    it('should response 400 when request payload not contain needed property', async () => {
      const server = await createServer(container);
      const accessToken = await ServerTestHelper.generateToken();

      // Add Thread
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
        content: 'content comment'
      };
      const responseComment = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestCommentPayload,
        headers: {'Authorization': `Bearer ${accessToken}`},
      });
      const responseCommentJson = JSON.parse(responseComment.payload);
      const commentId = responseCommentJson.data.addedComment.id;

      // Arrange
      const requestPayload = {};

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {'Authorization': `Bearer ${accessToken}`},
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat menambahkan balasan baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data specification', async () => {
      const server = await createServer(container);
      const accessToken = await ServerTestHelper.generateToken();

      // Add Thread
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
        content: 'content comment'
      };
      const responseComment = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestCommentPayload,
        headers: {'Authorization': `Bearer ${accessToken}`},
      });
      const responseCommentJson = JSON.parse(responseComment.payload);
      const commentId = responseCommentJson.data.addedComment.id;

      // Arrange
      const requestPayload = {
        content: 123,
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {'Authorization': `Bearer ${accessToken}`},
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat menambahkan balasan baru karena tipe data tidak sesuai');
    });
  });

  describe('when DELETE /thread/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    it('should response 200 and success', async () => {
      const server = await createServer(container);
      const accessToken = await ServerTestHelper.generateToken();

      // Add Thread
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
        content: 'content comment'
      };
      const responseComment = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestCommentPayload,
        headers: {'Authorization': `Bearer ${accessToken}`},
      });
      const responseCommentJson = JSON.parse(responseComment.payload);
      const commentId = responseCommentJson.data.addedComment.id;

      // Add Reply
      const requestPayload = {
        content: 'content reply',
      };

      const responseReply = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {'Authorization': `Bearer ${accessToken}`},
      });
      const responseReplyJson = JSON.parse(responseReply.payload);
      const replyId = responseReplyJson.data.addedReply.id;

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
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

      // Add Thread
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
        content: 'content comment'
      };
      const responseComment = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestCommentPayload,
        headers: {'Authorization': `Bearer ${accessToken}`},
      });
      const responseCommentJson = JSON.parse(responseComment.payload);
      const commentId = responseCommentJson.data.addedComment.id;

      // Add Reply
      const requestPayload = {
        content: 'content reply',
      };

      const responseReply = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {'Authorization': `Bearer ${accessToken}`},
      });
      const responseReplyJson = JSON.parse(responseReply.payload);
      const replyId = responseReplyJson.data.addedReply.id;
      const newAccessToken = await ServerTestHelper.generateToken();

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {'Authorization': `Bearer ${newAccessToken}`},
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat menghapus balasan yang bukan milik anda');
    });

    it('should response 403 and unauthorized', async () => {
      const server = await createServer(container);
      const accessToken = await ServerTestHelper.generateToken();

      // Add Thread
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
        content: 'content comment'
      };
      const responseComment = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestCommentPayload,
        headers: {'Authorization': `Bearer ${accessToken}`},
      });
      const responseCommentJson = JSON.parse(responseComment.payload);
      const commentId = responseCommentJson.data.addedComment.id;

      // Arrange
      const replyId = 'xxx';

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {'Authorization': `Bearer ${accessToken}`},
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('balasan tidak ditemukan');
    });
  });
});
