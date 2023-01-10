const LikeThreadCommentUseCase = require('../LikeThreadCommentUseCase');
const ThreadCommentRepository = require('../../../../Domains/threadComments/ThreadCommentRepository');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');

describe('LikeThreadCommentUseCase', () => {
  it('should orchestrating the like thread comment action correctly', async () => {
    // Arrange
    const likeThreadCommentPayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      userId: 'user-123',
    };

    /** creating dependency of use case */
    const mockThreadCommentRepository = new ThreadCommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadExists = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadCommentRepository.verifyCommentExists = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadCommentRepository.verifyUserCommentLikeExists = jest.fn()
      .mockImplementation(() => Promise.resolve(false));
    mockThreadCommentRepository.addUserCommentLikes = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: 'commentLike-123',
        comment_id: 'comment-123',
        user_id: 'user-123',
      }));

    /** mocking needed function */
    const likeThreadCommentUseCase = new LikeThreadCommentUseCase({
      threadCommentRepository: mockThreadCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedCommentLike = await likeThreadCommentUseCase.execute(likeThreadCommentPayload);

    // Assert
    expect(mockThreadRepository.verifyThreadExists).toHaveBeenCalledWith(likeThreadCommentPayload.threadId);
    expect(mockThreadCommentRepository.verifyCommentExists).toHaveBeenCalledWith(likeThreadCommentPayload.commentId);
    expect(mockThreadCommentRepository.verifyUserCommentLikeExists).toHaveBeenCalledWith(likeThreadCommentPayload.commentId, likeThreadCommentPayload.userId);
    expect(mockThreadCommentRepository.addUserCommentLikes).toHaveBeenCalledWith(likeThreadCommentPayload.commentId, likeThreadCommentPayload.userId);
    expect(addedCommentLike.id).toEqual('commentLike-123');
    expect(addedCommentLike.comment_id).toEqual(likeThreadCommentPayload.commentId);
    expect(addedCommentLike.user_id).toEqual(likeThreadCommentPayload.userId);
  });

  it('should orchestrating the unlike thread comment action correctly', async () => {
    // Arrange
    const likeThreadCommentPayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      userId: 'user-123',
    };

    /** creating dependency of use case */
    const mockThreadCommentRepository = new ThreadCommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadExists = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadCommentRepository.verifyCommentExists = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadCommentRepository.verifyUserCommentLikeExists = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockThreadCommentRepository.deleteUserCommentLikes = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** mocking needed function */
    const likeThreadCommentUseCase = new LikeThreadCommentUseCase({
      threadCommentRepository: mockThreadCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Assert
    await expect(likeThreadCommentUseCase.execute(likeThreadCommentPayload)).resolves.not.toThrowError();
    expect(mockThreadRepository.verifyThreadExists).toHaveBeenCalledWith(likeThreadCommentPayload.threadId);
    expect(mockThreadCommentRepository.verifyCommentExists).toHaveBeenCalledWith(likeThreadCommentPayload.commentId);
    expect(mockThreadCommentRepository.verifyUserCommentLikeExists).toHaveBeenCalledWith(likeThreadCommentPayload.commentId, likeThreadCommentPayload.userId);
    expect(mockThreadCommentRepository.deleteUserCommentLikes).toHaveBeenCalledWith(likeThreadCommentPayload.commentId, likeThreadCommentPayload.userId);
  });
});
