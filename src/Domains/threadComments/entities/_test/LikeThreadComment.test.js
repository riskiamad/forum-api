const LikeThreadComment = require('../LikeThreadComment');

describe('LikeThreadComment entities', () => {
  it('should throw error when payload not contain needed properties', async () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    // Action and Assert
    expect(() => new LikeThreadComment(payload)).toThrowError('LIKE_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', async () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      userId: 123,
    };

    // Action and Assert
    expect(() => new LikeThreadComment(payload)).toThrowError('LIKE_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create LikeThreadComment entities successfully', async () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      userId: 'user-123',
    };

    // Action
    const { threadId, commentId, userId } = new LikeThreadComment(payload);

    // Assert
    expect(threadId).toEqual(payload.threadId);
    expect(commentId).toEqual(payload.commentId);
    expect(userId).toEqual(payload.userId);
  })
});
