const NewThread = require('../../../../Domains/threads/entities/NewThread');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const NewThreadUseCase = require('../NewThreadUseCase');

describe('NewThreadUseCase', () => {
  it('should orchestrating the new thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'Judul thread',
      body: 'Body thread',
      owner: 'user-123',
    }

    const expectedThread = {
      id: 'thread-123',
      title: useCasePayload.title,
      body: useCasePayload.body,
      owner: useCasePayload.owner,
    }

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.addThread = jest.fn(() => ({
      id: 'thread-123',
      title: 'Judul thread',
      body: 'Body thread',
      owner: 'user-123',
    }));

    /** creating use case instance */
    const getThreadUseCase = new NewThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const newThread = await getThreadUseCase.execute(useCasePayload);

    // Assert
    expect(newThread).toStrictEqual(expectedThread);
    expect(mockThreadRepository.addThread).toBeCalledWith(new NewThread({
      title: useCasePayload.title,
      body: useCasePayload.body,
      owner: useCasePayload.owner,
    }));
  });
});
