const NewThreadComment = require('../NewThreadComment');

describe('NewThreadComment entities', () => {
  it('should throw error when payload not contain needed property', async () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new NewThreadComment(payload)).toThrowError('NEW_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', async () => {
    // Arrange
    const payload = {
      content: 123,
      threadId: 'thread-123',
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new NewThreadComment(payload)).toThrowError('NEW_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewThreadComment entities correctly', async () => {
    // Arrange
    const payload = {
      content: 'Content Comment',
      threadId: 'thread-123',
      owner: 'user-123',
    };

    // Action
    const { content, threadId, owner } = new NewThreadComment(payload);

    // Assert
    expect(content).toEqual(payload.content);
    expect(threadId).toEqual(payload.threadId);
    expect(owner).toEqual(payload.owner);
  });
});
