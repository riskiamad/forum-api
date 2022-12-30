const NewReply = require('../../../Domains/threadCommentReplies/entities/NewReply');
const pool = require('../../database/postgres/pool');
const ThreadCommentReplyRepositoryPostgres = require('../ThreadCommentReplyRepositoryPostgres');
const ThreadCommentRepliesTableTestHelper = require('../../../../tests/ThreadCommentRepliesTableTestHelper');
const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const { customAlphabet } = require('nanoid');
const {add} = require("nodemon/lib/rules");
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
      await threadCommentReplyRepositoryPostgres.addReply(newReply);

      // Assert
      const replies = await ThreadCommentRepliesTableTestHelper.findReplyById(`reply-${randomId}`);
      expect(replies).toHaveLength(1);
      expect(replies[0].id).toEqual(`reply-${randomId}`);
      expect(replies[0].content).toEqual(newReply.content);
      expect(replies[0].owner).toEqual(newReply.owner);
      expect(replies[0].is_delete).toEqual(false);
      expect(replies[0].thread_comment_id).toEqual(newReply.commentId);
      expect(replies[0].date).not.toEqual('');
      expect(replies[0].date).toBeDefined();
    });
  });

  describe('deleteReply function', () => {
    it('should persist delete reply', async () => {
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
      await threadCommentReplyRepositoryPostgres.addReply(newReply);

      await threadCommentReplyRepositoryPostgres.deleteReply(`reply-${randomId}`);

      // Assert
      const replies = await ThreadCommentRepliesTableTestHelper.findReplyById(`reply-${randomId}`);
      const deletedReply = await threadCommentReplyRepositoryPostgres.getReplyById(`reply-${randomId}`);
      expect(replies).toHaveLength(0);
      expect(deletedReply.id).toEqual(`reply-${randomId}`);
      expect(deletedReply.content).toEqual(newReply.content);
      expect(deletedReply.owner).toEqual(newReply.owner);
      expect(deletedReply.isDelete).toEqual(true);
      expect(deletedReply.commentId).toEqual(newReply.commentId);
      expect(deletedReply.date).not.toEqual('');
      expect(deletedReply.date).toBeDefined();
    });
  });

  describe('getReplyById function', () => {
    it('should return reply', async () => {
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
      const replies = await threadCommentReplyRepositoryPostgres.getReplyById(addedReply.id);

      // Assert
      expect(replies.id).toEqual(`reply-${randomId}`);
      expect(replies.content).toEqual(newReply.content);
      expect(replies.owner).toEqual(newReply.owner);
      expect(replies.isDelete).toEqual(false);
      expect(replies.commentId).toEqual(newReply.commentId);
      expect(replies.date).not.toEqual('');
      expect(replies.date).toBeDefined();
    });
  });

  describe('getReplyByCommentId function', () => {
    it('should return replies', async () => {
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
      const replies = await threadCommentReplyRepositoryPostgres.getRepliesByCommentId(`comment-${randomId}`);

      // Assert
      expect(replies[0].id).toEqual(`reply-${randomId}`);
      expect(replies[0].content).toEqual(newReply.content);
      expect(replies[0].username).toEqual(`riskiamad${randomId}`);
      expect(replies[0].isDelete).toEqual(false);
      expect(replies[0].date).not.toEqual('');
      expect(replies[0].date).toBeDefined();
    });
  });
});
