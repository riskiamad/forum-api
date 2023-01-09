class DeleteCommentUseCase {
  constructor({
    threadCommentRepository,
  }) {
    this._threadCommentRepository = threadCommentRepository;
  }

  async execute(useCasePayload) {
    const {commentId, owner} = useCasePayload;
    await this._threadCommentRepository.verifyCommentOwner(commentId, owner);

    await this._threadCommentRepository.deleteComment(commentId);
  }
}

module.exports = DeleteCommentUseCase;
