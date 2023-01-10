const NewThreadComment = require('../../../Domains/threadComments/entities/NewThreadComment');
const LikeThreadComment = require('../../../Domains/threadComments/entities/LikeThreadComment');
const pool = require('../../database/postgres/pool');
const ThreadCommentRepositoryPostgres = require('../ThreadCommentRepositoryPostgres');
const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UserCommentLikesTableTestHelper = require('../../../../tests/UserCommentLikesTableTestHelper');
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
      const userId = `user-${randomId}`;
      const threadId = `thread-${randomId}`;
      const commentId = `comment-${randomId}`;

      // Add User
      await UsersTableTestHelper.addUser({ id: userId, username: `riskiamad${randomId}`});

      // Add Thread
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });

      // Arrange
      const newComment = new NewThreadComment({
        content: 'content comment',
        threadId: threadId,
        owner: userId,
      });
      const fakeIdGenerator = () => randomId;
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedComment = await threadCommentRepositoryPostgres.addComment(newComment);
      const comments = await ThreadCommentsTableTestHelper.findCommentsById(`comment-${randomId}`);

      // Assert
      expect(addedComment.id).toEqual(`comment-${randomId}`);
      expect(addedComment.content).toEqual(newComment.content);
      expect(addedComment.owner).toEqual(newComment.owner);
      expect(comments).toHaveLength(1);
      expect(comments[0].id).toEqual(`comment-${randomId}`);
    });
  });

  describe('deleteComment function', () => {
    it('should persist delete comment', async () => {
      const randomId = nanoid(16);
      const userId = `user-${randomId}`;
      const threadId = `thread-${randomId}`;
      const commentId = `comment-${randomId}`;

      // Add User
      await UsersTableTestHelper.addUser({ id: userId, username: `riskiamad${randomId}`});

      // Add Thread
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });

      // Arrange
      const newComment = new NewThreadComment({
        content: 'content comment',
        threadId: threadId,
        owner: userId,
      });
      const fakeIdGenerator = () => randomId;
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await ThreadCommentsTableTestHelper.addComment({ id: commentId, content: newComment.content, owner: newComment.owner, threadId: newComment.threadId});
      await threadCommentRepositoryPostgres.deleteComment(commentId);

      // Assert
      const comments = await ThreadCommentsTableTestHelper.findCommentsById(commentId);

      expect(comments[0].is_delete).toEqual(true);
    });
  });

  describe('getCommentsByThreadId function', () => {
    it('should return comment', async () => {
      const randomId = nanoid(16);
      const userId = `user-${randomId}`;
      const threadId = `thread-${randomId}`;
      const commentId = `comment-${randomId}`;

      // Add User
      await UsersTableTestHelper.addUser({ id: userId, username: `riskiamad${randomId}`});

      // Add Thread
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });

      // Arrange
      const newComment = new NewThreadComment({
        content: 'content comment',
        threadId: threadId,
        owner: userId,
      });
      const fakeIdGenerator = () => randomId;
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const now = new Date();
      await ThreadCommentsTableTestHelper.addComment({ id: commentId, content: newComment.content, threadId: newComment.threadId, owner: newComment.owner, date: now});
      const comments = await threadCommentRepositoryPostgres.getCommentsByThreadId(threadId);

      // Assert
      expect(comments).toHaveLength(1);
      expect(comments[0].id).toEqual(commentId);
      expect(comments[0].content).toEqual(newComment.content);
      expect(comments[0].date).toEqual(now);
      expect(comments[0].isDelete).toEqual(false);
      expect(comments[0].username).toEqual(`riskiamad${randomId}`);
    });
  });

  describe('verifyCommentExists function', () => {
    it('should not return error if comment exists', async () => {
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
      await expect(threadCommentRepositoryPostgres.verifyCommentExists(`comment-${randomId}`)).resolves.not.toThrowError('THREAD_COMMENT.NOT_FOUND');
    });

    it('should throw error not found', async () => {
      const fakeIdGenerator = () => '123';
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator);

      // Assert
      await expect(threadCommentRepositoryPostgres.verifyCommentExists('xxx')).rejects.toThrowError('THREAD_COMMENT.NOT_FOUND');
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should not return error if user is comment owner', async () => {
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
      await expect(threadCommentRepositoryPostgres.verifyCommentOwner(`comment-${randomId}`, `user-${randomId}`)).resolves.not.toThrowError('THREAD_COMMENT.UNAUTHORIZED');
    });

    it('should throw error unauthorized', async () => {
      const randomId = nanoid(16);

      // Add User
      await UsersTableTestHelper.addUser({ id: `user-${randomId}`, username: `riskiamad${randomId}`});

      // Add Thread
      await ThreadsTableTestHelper.addThread({ id: `thread-${randomId}`, owner: `user-${randomId}` });

      // Arrange
      new NewThreadComment({
        content: 'content comment',
        threadId: `thread-${randomId}`,
        owner: `user-${randomId}`,
      });
      const fakeIdGenerator = () => randomId;
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator);

      // Assert
      await expect(threadCommentRepositoryPostgres.verifyCommentOwner(`comment-${randomId}`, 'xxx')).rejects.toThrowError('THREAD_COMMENT.NOT_FOUND');
    });

    it('should throw error not found', async () => {
      const fakeIdGenerator = () => '123';
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator);

      // Assert
      await expect(threadCommentRepositoryPostgres.verifyCommentOwner({commentId: 'xxx', owner: 'xxx'})).rejects.toThrowError('THREAD_COMMENT.NOT_FOUND');
    });
  });

  describe('verifyUserCommentLikeExists function', () => {
    it('should return true if user comment likes exists', async () => {
      const randomId = nanoid(16);
      const userId = `user-${randomId}`;
      const threadId = `thread-${randomId}`;
      const commentId = `thread-${randomId}`;
      const commentLikeId = `commentLike-${randomId}`;

      // Add User
      await UsersTableTestHelper.addUser({id: userId, username: `riskiamad${randomId}` });

      // Add Thread
      await ThreadsTableTestHelper.addThread({id: threadId, owner: userId});

      // Add Comment
      await ThreadCommentsTableTestHelper.addComment({id: commentId, threadId: threadId, owner: userId});

      // Add User Comment Like
      await UserCommentLikesTableTestHelper.addUserCommentLikes({id: commentLikeId, commentId: commentId, userId: userId});

      // Arrange
      const payload = {
        commentId: commentId,
        userId: userId,
      };
      const fakeIdGenerator = () => randomId;
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator);

      const exists = await threadCommentRepositoryPostgres.verifyUserCommentLikeExists(payload.commentId, payload.userId);

      // Assert
      expect(exists).toEqual(true);
    });

    it('should return false if user comment likes not exists', async () => {
      // Arrange
      const payload = {
        commentId: 'comment-123',
        userId: 'user-123',
      };
      const fakeIdGenerator = () => '123';
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const exists = await threadCommentRepositoryPostgres.verifyUserCommentLikeExists(payload.commentId, payload.userId);

      // Assert
      expect(exists).toEqual(false);
    });
  });

  describe('addUserCommentLikes function', () => {
    it('should persist user comment likes', async () => {
      const randomId = nanoid(16);
      const userId = `user-${randomId}`;
      const threadId = `thread-${randomId}`;
      const commentId = `comment-${randomId}`;

      // Add User
      await UsersTableTestHelper.addUser({id: userId, username: `riskiamad${randomId}`});

      // Add Thread
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId});

      // Add Comment
      await ThreadCommentsTableTestHelper.addComment({ id: commentId, threadId: threadId, owner: userId});

      // Arrange
      const payload = {
        commentId: commentId,
        userId: userId,
      };
      const fakeIdGenerator = () => randomId;
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedUserCommentLikes = await threadCommentRepositoryPostgres.addUserCommentLikes(payload.commentId, payload.userId);

      // Assert
      expect(addedUserCommentLikes.id).toEqual(`commentLike-${randomId}`);
      expect(addedUserCommentLikes.comment_id).toEqual(commentId);
      expect(addedUserCommentLikes.user_id).toEqual(userId);
    });
  });

  describe('deletedUserCommentLikes function', () => {
    it('should not throw error is delete success', async () => {
      const randomId = nanoid(16);
      const userId = `user-${randomId}`;
      const threadId = `thread-${randomId}`;
      const commentId = `comment-${randomId}`;
      const commentLikeId = `commentLike-${randomId}`;

      // Add User
      await UsersTableTestHelper.addUser({id: userId, username: `riskiamad${randomId}`});

      // Add Thread
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId});

      // Add Comment
      await ThreadCommentsTableTestHelper.addComment({ id: commentId, threadId: threadId, owner: userId});

      // Add Comment Like
      await UserCommentLikesTableTestHelper.addUserCommentLikes({ id: commentLikeId, commentId: commentId, userId: userId});

      // Arrange
      const payload = {
        commentId: commentId,
        userId: userId,
      };
      const fakeIdGenerator = () => randomId;
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator);

      // Assert
      await expect(threadCommentRepositoryPostgres.deleteUserCommentLikes(payload.commentId, payload.userId)).resolves.not.toThrowError('USER_COMMENT_LIKE.NOT_FOUND');
    });

    it('should throw error if user comment like not found', async () => {
      // Arrange
      const payload = {
        commentId: 'comment-123',
        userId: 'user-123',
      };
      const fakeIdGenerator = () => '123';
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator);

      // Assert
      await expect(threadCommentRepositoryPostgres.deleteUserCommentLikes(payload.commentId, payload.userId)).rejects.toThrowError('USER_COMMENT_LIKE.NOT_FOUND');
    });
  });
});
