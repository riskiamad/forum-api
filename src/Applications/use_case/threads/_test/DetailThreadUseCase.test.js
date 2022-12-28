const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const DetailThreadUseCase = require('../DetailThreadUseCase');
const ThreadCommentRepository = require('../../../../Domains/threadComments/ThreadCommentRepository');
const ThreadCommentReplyRepository = require('../../../../Domains/threadCommentReplies/ThreadCommentReplyRepository');

describe('DetailThreadUseCase', () => {
  it('should orchestrating the detail thread action correctly', async () => {
    // Arrange
    const useCasePayload = 'thread-123';

    const expectedThread = {
      id: 'thread-123',
      title: 'Judul Thread',
      body: 'Body Thread',
      owner: 'user-123',
    };

    const expectedComment = [
      {
        id: 'comment-123',
        content: 'content comment',
        threadId: 'thread-123',
        owner: 'user-123',
      }
    ];

    const expectedReply = [
      {
        id: 'reply-123',
        content: 'content reply',
        commentId: 'comment-123',
        owner: 'user-123',
      }
    ];

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockThreadCommentRepository = new ThreadCommentRepository();
    const mockThreadCommentReplyRepository = new ThreadCommentReplyRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedThread));
    mockThreadCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedComment));
    mockThreadCommentReplyRepository.getRepliesByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedReply));

    /** creating use case instance */
    const getThreadUseCase = new DetailThreadUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
      threadCommentReplyRepository: mockThreadCommentReplyRepository,
    });

    // Action
    const detailThread = await getThreadUseCase.execute(useCasePayload);

    // Assert
    expect(detailThread).toStrictEqual(expectedThread);
    expect(mockThreadRepository.getThreadById).toBeCalledWith('thread-123');
  });
});
