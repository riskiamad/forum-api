const NewReply = require('../../../Domains/threadCommentReplies/entities/NewReply');

class AddReplyUseCase {
  constructor({
    threadRepository,
    threadCommentRepository,
    threadCommentReplyRepository,
  }) {
    this._threadRepository = threadRepository;
    this._threadCommentRepository = threadCommentRepository;
    this._threadCommentReplyRepository = threadCommentReplyRepository;
  }

  async execute(useCasePayload) {
    const newReply = new NewReply(useCasePayload);

    const threadExists = await this._threadRepository.verifyThreadExists(newReply.threadId);
    if (!threadExists) {
      throw new Error('THREAD.NOT_FOUND');
    }

    const threadCommentExists = await this._threadCommentRepository.verifyCommentExists(newReply.commentId);
    if (!threadCommentExists) {
      throw new Error('THREAD_COMMENT.NOT_FOUND');
    }

    return await this._threadCommentReplyRepository.addReply(newReply);
  }
}

module.exports = AddReplyUseCase;
