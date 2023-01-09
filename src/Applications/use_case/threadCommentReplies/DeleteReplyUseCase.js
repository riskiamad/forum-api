class DeleteReplyUseCase {
  constructor({
    threadCommentReplyRepository,
              }) {
    this._threadCommentReplyRepository = threadCommentReplyRepository;
  }

  async execute(useCasePayload) {
    const {replyId, owner} = useCasePayload;
    await this._threadCommentReplyRepository.verifyReplyOwner(replyId, owner);

    await this._threadCommentReplyRepository.deleteReply(replyId);
  }
}

module.exports = DeleteReplyUseCase;
