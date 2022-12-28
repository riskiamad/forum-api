const ThreadCommentRepository = require('../../../../Domains/threadComments/ThreadCommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const deletePayload = {
      commentId: 'comment-123',
      owner: 'user-123',
    };

    const expectedComment = {
      id: 'comment-123',
      owner: 'user-123',
    };

    /** creating dependency of use case */
    const mockThreadCommentRepository = new ThreadCommentRepository();

    /** mocking needed function */
    mockThreadCommentRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadCommentRepository.getCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedComment));

    /** mocking needed function */
    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadCommentRepository: mockThreadCommentRepository,
    });

    // Action
    await deleteCommentUseCase.execute(deletePayload)

    // Assert
    expect(mockThreadCommentRepository.deleteComment)
      .toHaveBeenCalledWith(deletePayload.commentId);
  });
});
