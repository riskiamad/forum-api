const Thread = require('../Thread');

describe('Thread entities', () => {
  it('should throw error when payload did not contain needed property', async () => {
    // Arrange
    const payload = {
      title: 'Judul Thread',
      body: 'Body Thread',
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new Thread(payload)).toThrowError('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', async () => {
    // Arrange
    const payload = {
      id: 123,
      title: 'Judul Thread',
      body: 'Body Thread',
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new Thread(payload)).toThrowError('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create thread object correctly', async () => {
    // Arrange
    const payload = {
      id: 'user-123',
      title: 'Judul Thread',
      body: 'Body Thread',
      owner: 'user-123',
    };

    // Action
    const thread  = new Thread(payload);

    // Assert
    expect(thread.id).toEqual(payload.id);
    expect(thread.title).toEqual(payload.title);
    expect(thread.body).toEqual(payload.body);
    expect(thread.owner).toEqual(payload.owner);
  });
});
