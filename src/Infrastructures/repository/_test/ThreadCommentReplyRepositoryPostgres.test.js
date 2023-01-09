const NewReply = require('../../../Domains/threadCommentReplies/entities/NewReply');
const pool = require('../../database/postgres/pool');
const ThreadCommentReplyRepositoryPostgres = require('../ThreadCommentReplyRepositoryPostgres');
const ThreadCommentRepliesTableTestHelper = require('../../../../tests/ThreadCommentRepliesTableTestHelper');
const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const { customAlphabet } = require('nanoid');
const nanoid = customAlphabet('123456789abcdef', 10);

describe('ThreadCommentReplyRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadCommentRepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addReply function', () => {
    it('should persist add reply', async () => {
      const randomId = nanoid(16);
      const userId = `user-${randomId}`;
      const threadId = `thread-${randomId}`;
      const commentId = `comment-${randomId}`;

      // Add User
      await UsersTableTestHelper.addUser({ id: userId, username: `riskiamad${randomId}`});

      // Add Thread
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId});

      // Add Comment
      await ThreadCommentsTableTestHelper.addComment( { id: commentId, threadId: threadId, owner: userId});

      // Arrange
      const newReply = new NewReply({
        content: 'content reply',
        threadId: threadId,
        commentId: commentId,
        owner: userId,
      });
      const fakeIdGenerator = () => randomId;
      const threadCommentReplyRepositoryPostgres = new ThreadCommentReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedReply = await threadCommentReplyRepositoryPostgres.addReply(newReply);
      const replies = await ThreadCommentRepliesTableTestHelper.findReplyById(`reply-${randomId}`);

      // Assert
      expect(addedReply.id).toEqual(`reply-${randomId}`);
      expect(addedReply.content).toEqual(newReply.content);
      expect(addedReply.owner).toEqual(newReply.owner);
      expect(replies).toHaveLength(1);
      expect(replies[0].id).toEqual(`reply-${randomId}`);
    });
  });

  describe('deleteReply function', () => {
    it('should persist delete reply', async () => {
      const randomId = nanoid(16);
      const userId = `user-${randomId}`;
      const threadId = `thread-${randomId}`;
      const commentId = `comment-${randomId}`;
      const replyId = `reply-${randomId}`;

      // Add User
      await UsersTableTestHelper.addUser({ id: userId, username: `riskiamad${randomId}`});

      // Add Thread
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId});

      // Add Comment
      await ThreadCommentsTableTestHelper.addComment( { id: commentId, threadId: threadId, owner: userId});

      // Arrange
      const newReply = new NewReply({
        content: 'content reply',
        threadId: threadId,
        commentId: commentId,
        owner: userId,
      });
      const fakeIdGenerator = () => randomId;
      const threadCommentReplyRepositoryPostgres = new ThreadCommentReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await ThreadCommentRepliesTableTestHelper.addReply({ id: replyId, content: newReply.content, commentId: newReply.commentId, owner: newReply.owner, date: new Date() });
      await threadCommentReplyRepositoryPostgres.deleteReply(replyId);

      const reply = await ThreadCommentRepliesTableTestHelper.findReplyById(replyId);

      // Assert
      expect(reply[0].is_delete).toEqual(true);
    });
  });

  describe('getReplyByCommentId function', () => {
    it('should return replies', async () => {
      const randomId = nanoid(16);
      const userId = `user-${randomId}`;
      const threadId = `thread-${randomId}`;
      const commentId = `comment-${randomId}`;
      const replyId = `reply-${randomId}`;

      // Add User
      await UsersTableTestHelper.addUser({ id: userId, username: `riskiamad${randomId}`});

      // Add Thread
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId});

      // Add Comment
      await ThreadCommentsTableTestHelper.addComment( { id: commentId, threadId: threadId, owner: userId});

      // Arrange
      const newReply = new NewReply({
        content: 'content reply',
        threadId: threadId,
        commentId: commentId,
        owner: userId,
      });
      const fakeIdGenerator = () => randomId;
      const threadCommentReplyRepositoryPostgres = new ThreadCommentReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const now = new Date();
      await ThreadCommentRepliesTableTestHelper.addReply({ id: replyId, content: newReply.content, commentId: newReply.commentId, owner: newReply.owner, date: now });
      const replies = await threadCommentReplyRepositoryPostgres.getRepliesByCommentId(commentId);

      // Assert
      expect(replies[0].id).toEqual(replyId);
      expect(replies[0].content).toEqual(newReply.content);
      expect(replies[0].username).toEqual(`riskiamad${randomId}`);
      expect(replies[0].isDelete).toEqual(false);
      expect(replies[0].date).toEqual(now);
    });
  });

  describe('verifyReplyOwner function', () => {
    it('should not return error if user reply owner', async () => {
      const randomId = nanoid(16);
      const userId = `user-${randomId}`;
      const threadId = `thread-${randomId}`;
      const commentId = `comment-${randomId}`;
      const replyId = `reply-${randomId}`;

      // Add User
      await UsersTableTestHelper.addUser({ id: userId, username: `riskiamad${randomId}`});

      // Add Thread
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId});

      // Add Comment
      await ThreadCommentsTableTestHelper.addComment( { id: commentId, threadId: threadId, owner: userId});

      // Arrange
      const newReply = new NewReply({
        content: 'content reply',
        threadId: threadId,
        commentId: commentId,
        owner: userId,
      });
      const fakeIdGenerator = () => randomId;
      const threadCommentReplyRepositoryPostgres = new ThreadCommentReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await ThreadCommentRepliesTableTestHelper.addReply({ id: replyId, commentId: newReply.commentId, content: newReply.content, owner: newReply.owner});

      // Assert
      await expect(threadCommentReplyRepositoryPostgres.verifyReplyOwner(replyId, userId)).resolves.not.toThrowError('THREAD_COMMENT_REPLY.UNAUTHORIZED');
    });

    it('should return error if user not reply owner', async () => {
      const randomId = nanoid(16);
      const userId = `user-${randomId}`;
      const threadId = `thread-${randomId}`;
      const commentId = `comment-${randomId}`;
      const replyId = `reply-${randomId}`;

      // Add User
      await UsersTableTestHelper.addUser({ id: userId, username: `riskiamad${randomId}`});

      // Add Thread
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId});

      // Add Comment
      await ThreadCommentsTableTestHelper.addComment( { id: commentId, threadId: threadId, owner: userId});

      // Arrange
      const newReply = new NewReply({
        content: 'content reply',
        threadId: threadId,
        commentId: commentId,
        owner: userId,
      });
      const fakeIdGenerator = () => randomId;
      const threadCommentReplyRepositoryPostgres = new ThreadCommentReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await ThreadCommentRepliesTableTestHelper.addReply({ id: replyId, commentId: newReply.commentId, content: newReply.content, owner: newReply.owner});

      // Assert
      await expect(threadCommentReplyRepositoryPostgres.verifyReplyOwner(replyId, 'xxx')).rejects.toThrowError('THREAD_COMMENT_REPLY.UNAUTHORIZED');
    });

    it('should throw error not found if replyId not exists', async () => {
      // Arrange
      const fakeIdGenerator = () => '123';
      const threadCommentReplyRepositoryPostgres = new ThreadCommentReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Assert
      await expect(threadCommentReplyRepositoryPostgres.verifyReplyOwner('xxx', 'xxx')).rejects.toThrowError('THREAD_COMMENT_REPLY.NOT_FOUND');
    });
  });
});
