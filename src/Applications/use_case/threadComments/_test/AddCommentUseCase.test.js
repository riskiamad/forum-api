const NewThreadComment = require('../../../../Domains/threadComments/entities/NewThreadComment')
const ThreadCommentRepository = require('../../../../Domains/threadComments/ThreadCommentRepository');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const AddCommentUseCase = require('../AddCommentUseCase');
const {add} = require("nodemon/lib/rules");

describe('AddCommentUseCase', () => {
  it('should orchestrating the new comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'content comment',
      threadId: 'thread-123',
      owner: 'user-123',
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockThreadCommentRepository = new ThreadCommentRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadExists = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: 'comment-123',
        content: useCasePayload.content,
        owner: useCasePayload.owner,
      }));

    /** mocking needed function */
    const getCommentUseCase = new AddCommentUseCase({
      threadCommentRepository: mockThreadCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedComment = await getCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThreadExists).toBeCalledWith(useCasePayload.threadId);
    expect(mockThreadCommentRepository.addComment).toBeCalledWith(new NewThreadComment({
      content: useCasePayload.content,
      threadId: useCasePayload.threadId,
      owner: useCasePayload.owner,
    }));
    expect(addedComment.id).toEqual('comment-123');
    expect(addedComment.content).toEqual(useCasePayload.content);
    expect(addedComment.owner).toEqual(useCasePayload.owner);
  });
});
