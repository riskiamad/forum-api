const ThreadCommentRepository = require('../../../../Domains/threadComments/ThreadCommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const deletePayload = {
      commentId: 'comment-123',
      owner: 'user-123',
    };

    /** creating dependency of use case */
    const mockThreadCommentRepository = new ThreadCommentRepository();

    /** mocking needed function */
    mockThreadCommentRepository.getCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: 'comment-123',
        content: 'content comment',
        threadId: 'thread-123',
        owner: 'user-123',
        isDelete: false,
      }));
    mockThreadCommentRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** mocking needed function */
    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadCommentRepository: mockThreadCommentRepository,
    });

    // Action
    await deleteCommentUseCase.execute(deletePayload)

    // Assert
    expect(mockThreadCommentRepository.getCommentById(deletePayload.commentId));
    expect(mockThreadCommentRepository.deleteComment)
      .toHaveBeenCalledWith(deletePayload.commentId);
  });
});
