const ThreadCommentReplyRepository = require('../../../../Domains/threadCommentReplies/ThreadCommentReplyRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('should orchestrating the delete reply action correctly', async () => {
    // Arrange
    const deletePayload = {
      replyId: 'reply-123',
      owner: 'user-123',
    };

    /** mocking dependency of use case */
    const mockThreadCommentReplyRepository = new ThreadCommentReplyRepository();

    /** mocking needed function */
    mockThreadCommentReplyRepository.verifyReplyOwner = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockThreadCommentReplyRepository.deleteReply = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** mocking needed function */
    const deleteReplyUseCase = new DeleteReplyUseCase({
      threadCommentReplyRepository: mockThreadCommentReplyRepository,
    });

    // Action
    await deleteReplyUseCase.execute(deletePayload);

    // Assert
    expect(mockThreadCommentReplyRepository.verifyReplyOwner(deletePayload.owner));
    expect(mockThreadCommentReplyRepository.deleteReply)
      .toHaveBeenCalledWith(deletePayload.replyId);
  });
});
