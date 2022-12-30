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
    const exists = await this._threadRepository.verifyThreadExists(newComment.threadId);
    if (!exists) {
      throw new Error('THREAD.NOT_FOUND');
    }

    return await this._threadCommentRepository.addComment(newComment);
  }
}

module.exports = AddCommentUseCase;
