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

    await this._threadRepository.verifyThreadExists(newReply.threadId);

    await this._threadCommentRepository.verifyCommentExists(newReply.commentId);

    return await this._threadCommentReplyRepository.addReply(newReply);
  }
}

module.exports = AddReplyUseCase;
