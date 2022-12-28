const NewThreadComment = require('../../../../Domains/threadComments/entities/NewThreadComment')
const ThreadCommentRepository = require('../../../../Domains/threadComments/ThreadCommentRepository');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  it('should orchestrating the new comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'content comment',
      threadId: 'thread-123',
      owner: 'user-123',
    };

    const expectedComment = new NewThreadComment({
      id: 'comment-123',
      content: useCasePayload.content,
      threadId: useCasePayload.threadId,
      owner: useCasePayload.owner,
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockThreadCommentRepository = new ThreadCommentRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedComment));

    /** mocking needed function */
    const getCommentUseCase = new AddCommentUseCase({
      threadCommentRepository: mockThreadCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const newComment = await getCommentUseCase.execute(useCasePayload);

    // Assert
    expect(newComment).toStrictEqual(expectedComment);
    expect(mockThreadCommentRepository.addComment).toBeCalledWith(new NewThreadComment({
      content: useCasePayload.content,
      threadId: useCasePayload.threadId,
      owner: useCasePayload.owner,
    }));
  });
});
