class DeleteReplyUseCase {
  constructor({
    threadCommentReplyRepository,
              }) {
    this._threadCommentReplyRepository = threadCommentReplyRepository;
  }

  async execute(useCasePayload) {
    const {replyId, owner} = useCasePayload;
    const reply = await this._threadCommentReplyRepository.getReplyById(replyId);

    if (reply?.owner !== owner) {
      throw new Error('DELETE_REPLY_USE_CASE.UNAUTHORIZED');
    }

    await this._threadCommentReplyRepository.deleteReply(replyId);
  }
}

module.exports = DeleteReplyUseCase;
