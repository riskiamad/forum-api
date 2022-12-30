const NewThreadComment = require('../../../Domains/threadComments/entities/NewThreadComment');
const pool = require('../../database/postgres/pool');
const ThreadCommentRepositoryPostgres = require('../ThreadCommentRepositoryPostgres');
const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const { customAlphabet } = require('nanoid');
const nanoid = customAlphabet('123456789abcdef', 10);

describe('ThreadCommentRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadCommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist add comment', async () => {
      const randomId = nanoid(16);

      // Add User
      await UsersTableTestHelper.addUser({ id: `user-${randomId}`, username: `riskiamad${randomId}`});

      // Add Thread
      await ThreadsTableTestHelper.addThread({ id: `thread-${randomId}`, owner: `user-${randomId}` });

      // Arrange
      const newComment = new NewThreadComment({
        content: 'content comment',
        threadId: `thread-${randomId}`,
        owner: `user-${randomId}`,
      });
      const fakeIdGenerator = () => randomId;
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadCommentRepositoryPostgres.addComment(newComment);

      // Assert
      const comments = await ThreadCommentsTableTestHelper.findCommentsById(`comment-${randomId}`);
      expect(comments).toHaveLength(1);
      expect(comments[0].id).toEqual(`comment-${randomId}`);
      expect(comments[0].content).toEqual(newComment.content);
      expect(comments[0].thread_id).toEqual(newComment.threadId);
      expect(comments[0].owner).toEqual(newComment.owner);
      expect(comments[0].is_delete).toEqual(false);
      expect(comments[0].date).not.toEqual('');
      expect(comments[0].date).toBeDefined();
    });
  });

  describe('deleteComment function', () => {
    it('should persist delete comment', async () => {
      const randomId = nanoid(16);

      // Add User
      await UsersTableTestHelper.addUser({ id: `user-${randomId}`, username: `riskiamad${randomId}`});

      // Add Thread
      await ThreadsTableTestHelper.addThread({ id: `thread-${randomId}`, owner: `user-${randomId}` });

      // Arrange
      const newComment = new NewThreadComment({
        content: 'content comment',
        threadId: `thread-${randomId}`,
        owner: `user-${randomId}`,
      });
      const fakeIdGenerator = () => randomId;
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadCommentRepositoryPostgres.addComment(newComment);

      await threadCommentRepositoryPostgres.deleteComment(`comment-${randomId}`)

      // Assert
      const comments = await ThreadCommentsTableTestHelper.findCommentsById(`comment-${randomId}`);
      const deletedComment = await threadCommentRepositoryPostgres.getCommentById(`comment-${randomId}`);
      expect(comments).toHaveLength(0);
      expect(deletedComment.id).toEqual(`comment-${randomId}`);
      expect(deletedComment.content).toEqual(newComment.content);
      expect(deletedComment.threadId).toEqual(newComment.threadId);
      expect(deletedComment.owner).toEqual(newComment.owner);
      expect(deletedComment.isDelete).toEqual(true);
      expect(deletedComment.date).not.toEqual('');
      expect(deletedComment.date).toBeDefined();
    });
  });

  describe('getCommentById function', () => {
    it('should return comment', async () => {
      const randomId = nanoid(16);

      // Add User
      await UsersTableTestHelper.addUser({ id: `user-${randomId}`, username: `riskiamad${randomId}`});

      // Add Thread
      await ThreadsTableTestHelper.addThread({ id: `thread-${randomId}`, owner: `user-${randomId}` });

      // Arrange
      const newComment = new NewThreadComment({
        content: 'content comment',
        threadId: `thread-${randomId}`,
        owner: `user-${randomId}`,
      });
      const fakeIdGenerator = () => randomId;
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedComment = await threadCommentRepositoryPostgres.addComment(newComment);
      const comments = await threadCommentRepositoryPostgres.getCommentById(addedComment.id);

      // Assert
      expect(comments.id).toEqual(addedComment.id);
      expect(comments.threadId).toEqual(newComment.threadId);
      expect(comments.content).toEqual(newComment.content);
      expect(comments.owner).toEqual(newComment.owner);
      expect(comments.isDelete).toEqual(false);
      expect(comments.date).not.toEqual('');
      expect(comments.date).toBeDefined();
    });
  });

  describe('getCommentsByThreadId function', () => {
    it('should return comment', async () => {
      const randomId = nanoid(16);

      // Add User
      await UsersTableTestHelper.addUser({ id: `user-${randomId}`, username: `riskiamad${randomId}`});

      // Add Thread
      await ThreadsTableTestHelper.addThread({ id: `thread-${randomId}`, owner: `user-${randomId}` });

      // Arrange
      const newComment = new NewThreadComment({
        content: 'content comment',
        threadId: `thread-${randomId}`,
        owner: `user-${randomId}`,
      });
      const fakeIdGenerator = () => randomId;
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedComment = await threadCommentRepositoryPostgres.addComment(newComment);
      const comments = await threadCommentRepositoryPostgres.getCommentsByThreadId(`thread-${randomId}`);

      // Assert
      expect(comments).toHaveLength(1);
      expect(comments[0].id).toEqual(addedComment.id);
      expect(comments[0].content).toEqual(newComment.content);
      expect(comments[0].date).toBeDefined();
      expect(comments[0].date).not.toEqual('');
      expect(comments[0].isDelete).toEqual(false);
      expect(comments[0].username).toEqual(`riskiamad${randomId}`);
    });
  });

  describe('verifyCommentExists function', () => {
    it('should return true if comment exists', async () => {
      const randomId = nanoid(16);

      // Add User
      await UsersTableTestHelper.addUser({ id: `user-${randomId}`, username: `riskiamad${randomId}`});

      // Add Thread
      await ThreadsTableTestHelper.addThread({ id: `thread-${randomId}`, owner: `user-${randomId}` });

      // Arrange
      const newComment = new NewThreadComment({
        content: 'content comment',
        threadId: `thread-${randomId}`,
        owner: `user-${randomId}`,
      });
      const fakeIdGenerator = () => randomId;
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedComment = await threadCommentRepositoryPostgres.addComment(newComment);
      const exists = await threadCommentRepositoryPostgres.verifyCommentExists(`comment-${randomId}`);

      // Assert
      expect(exists).toEqual(true);
    });
  });
});
