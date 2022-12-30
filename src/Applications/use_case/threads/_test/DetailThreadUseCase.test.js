const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const DetailThreadUseCase = require('../DetailThreadUseCase');
const ThreadCommentRepository = require('../../../../Domains/threadComments/ThreadCommentRepository');
const ThreadCommentReplyRepository = require('../../../../Domains/threadCommentReplies/ThreadCommentReplyRepository');

describe('DetailThreadUseCase', () => {
  it('should orchestrating the detail thread action correctly', async () => {
    // Arrange
    const useCasePayload = 'thread-123';

    const expectedDetailThread = {
      id: 'thread-123',
      title: 'Judul Thread',
      body: 'Body Thread',
      username: 'riskiamad',
      date: '2022-12-29T20:17:28.630Z',
      comments: [
        {
          id: 'comment-123',
          content: 'content comment',
          date: '2022-12-29T20:17:28.630Z',
          username: 'riskiamad',
          replies: [
            {
              id: 'reply-123',
              content: 'content reply',
              date: '2022-12-29T20:17:28.630Z',
              username: 'riskiamad',
            }
          ],
        },
      ],
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockThreadCommentRepository = new ThreadCommentRepository();
    const mockThreadCommentReplyRepository = new ThreadCommentReplyRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: 'thread-123',
        title: 'Judul Thread',
        body: 'Body Thread',
        date: '2022-12-29T20:17:28.630Z',
        username: 'riskiamad',
      }));
    mockThreadCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve([
        {
          id: 'comment-123',
          content: 'content comment',
          date: '2022-12-29T20:17:28.630Z',
          isDelete: false,
          username: 'riskiamad',
        }
      ]));
    mockThreadCommentReplyRepository.getRepliesByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve([
        {
          id: 'reply-123',
          content: 'content reply',
          date: '2022-12-29T20:17:28.630Z',
          isDelete: false,
          username: 'riskiamad',
        }
      ]));

    /** creating use case instance */
    const getThreadUseCase = new DetailThreadUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
      threadCommentReplyRepository: mockThreadCommentReplyRepository,
    });

    // Action
    const detailThread = await getThreadUseCase.execute(useCasePayload);

    // Assert
    expect(detailThread).toStrictEqual(expectedDetailThread);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload);
    expect(mockThreadCommentRepository.getCommentsByThreadId).toBeCalledWith(useCasePayload);
    expect(mockThreadCommentReplyRepository.getRepliesByCommentId).toBeCalledWith('comment-123');
  });
});
