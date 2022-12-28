const Comment = require('../Comment');

describe('Comment entities', () => {
  it('should throw error when payload did not contain needed property', async () => {
    // Arrange
    const payload = {
      content: 'content comment',
      threadId: 'thread-123',
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new Comment(payload)).toThrowError('THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', async () => {
    // Arrange
    const payload = {
      id: 123,
      content: 'content comment',
      threadId: 'thread-123',
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new Comment(payload)).toThrowError('THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create comment object correctly', async () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'content comment',
      threadId: 'thread-123',
      owner: 'user-123',
    };

    // Action
    const comment = new Comment(payload);

    // Assert
    expect(comment.id).toEqual(payload.id);
    expect(comment.content).toEqual(payload.content);
    expect(comment.threadId).toEqual(payload.threadId);
    expect(comment.owner).toEqual(payload.owner);
  });
});
