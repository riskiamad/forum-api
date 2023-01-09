const NewThreadComment = require('../../../Domains/threadComments/entities/NewThreadComment');

class AddCommentUseCase {
  constructor({
    threadCommentRepository,
    threadRepository,
  }) {
    this._threadCommentRepository = threadCommentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const newComment = new NewThreadComment(useCasePayload);
    await this._threadRepository.verifyThreadExists(newComment.threadId);

    return await this._threadCommentRepository.addComment(newComment);
  }
}

module.exports = AddCommentUseCase;
