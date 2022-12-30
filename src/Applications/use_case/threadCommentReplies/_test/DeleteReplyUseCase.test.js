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
    mockThreadCommentReplyRepository.getReplyById = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: 'reply-123',
        content: 'content reply',
        commentId: 'comment-123',
        owner: 'user-123',
        date: '2022-12-29T20:17:28.526Z',
        isDelete: false,
      }));
    mockThreadCommentReplyRepository.deleteReply = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** mocking needed function */
    const deleteReplyUseCase = new DeleteReplyUseCase({
      threadCommentReplyRepository: mockThreadCommentReplyRepository,
    });

    // Action
    await deleteReplyUseCase.execute(deletePayload);

    // Assert
    expect(mockThreadCommentReplyRepository.getReplyById(deletePayload.replyId));
    expect(mockThreadCommentReplyRepository.deleteReply)
      .toHaveBeenCalledWith(deletePayload.replyId);
  })
})
