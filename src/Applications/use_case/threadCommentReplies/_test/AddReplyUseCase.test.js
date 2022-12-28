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

    const expectedReply = new NewReply({
      id: 'reply-123',
      content: useCasePayload.content,
      threadId: useCasePayload.threadId,
      commentId: useCasePayload.commentId,
      owner: useCasePayload.owner,
    });

    /** creating dependency of use case */
    const mockThreadCommentReplyRepository = new ThreadCommentReplyRepository();
    const mockThreadCommentRepository = new ThreadCommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadCommentRepository.getCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadCommentReplyRepository.addReply = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedReply));

    /** mocking needed function */
    const getReplyUseCase = new AddReplyUseCase({
      threadCommentReplyRepository: mockThreadCommentReplyRepository,
      threadCommentRepository: mockThreadCommentRepository,
      threadRepository: mockThreadRepository
    });

    // Action
    const newReply = await getReplyUseCase.execute(useCasePayload);

    // Assert
    expect(newReply).toStrictEqual(expectedReply);
    expect(mockThreadCommentReplyRepository.addReply).toBeCalledWith({
      content: useCasePayload.content,
      threadId: useCasePayload.threadId,
      commentId: useCasePayload.commentId,
      owner: useCasePayload.owner,
    });
  });
});
