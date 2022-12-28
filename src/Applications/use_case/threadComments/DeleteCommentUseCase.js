class DeleteCommentUseCase {
  constructor({
                threadCommentRepository,
              }) {
    this._threadCommentRepository = threadCommentRepository;
  }

  async execute(useCasePayload) {
    const {commentId, owner} = useCasePayload;
    const comment = await this._threadCommentRepository.getCommentById(commentId);

    if (comment?.owner !== owner) {
      throw new Error('DELETE_COMMENT_USE_CASE.UNAUTHORIZED');
    }

    await this._threadCommentRepository.deleteComment(commentId);
  }
}

module.exports = DeleteCommentUseCase;
