const NewReply = require('../../../../Domains/threadCommentReplies/entities/NewReply');
const ThreadCommentReplyRepository = require('../../../../Domains/threadCommentReplies/ThreadCommentReplyRepository');
const ThreadCommentRepository = require('../../../../Domains/threadComments/ThreadCommentRepository');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const AddReplyUseCase = require('../AddReplyUseCase');

describe('AddReplyUseCase', () => {
  it('should orchestrating the new reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'content reply',
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    /** creating dependency of use case */
    const mockThreadCommentReplyRepository = new ThreadCommentReplyRepository();
    const mockThreadCommentRepository = new ThreadCommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadExists = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadCommentRepository.verifyCommentExists = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadCommentReplyRepository.addReply = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: 'reply-123',
        content: useCasePayload.content,
        owner: useCasePayload.owner,
      }));

    /** mocking needed function */
    const getReplyUseCase = new AddReplyUseCase({
      threadCommentReplyRepository: mockThreadCommentReplyRepository,
      threadCommentRepository: mockThreadCommentRepository,
      threadRepository: mockThreadRepository
    });

    // Action
    const addedReply = await getReplyUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThreadExists).toBeCalledWith(useCasePayload.threadId);
    expect(mockThreadCommentRepository.verifyCommentExists).toBeCalledWith(useCasePayload.commentId);
    expect(mockThreadCommentReplyRepository.addReply).toBeCalledWith({
      content: useCasePayload.content,
      threadId: useCasePayload.threadId,
      commentId: useCasePayload.commentId,
      owner: useCasePayload.owner,
    });
    expect(addedReply.id).toEqual('reply-123');
    expect(addedReply.content).toEqual(useCasePayload.content);
    expect(addedReply.owner).toEqual(useCasePayload.owner);
  });
});
