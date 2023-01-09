class DetailThreadUseCase {
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
    const thread = await this._threadRepository.getThreadById(useCasePayload);

    const comments = await this._threadCommentRepository.getCommentsByThreadId(thread.id);

    if (comments.length) {
      thread.comments = comments

      for (const comment of comments) {
        if (comment.isDelete) {
          comment.content = '**komentar telah dihapus**';
        }
        delete comment.isDelete;

        const replies = await this._threadCommentReplyRepository.getRepliesByCommentId(comment.id);
        if (replies.length) {
          comment.replies = replies;

          for (const reply of replies) {
            if (reply.isDelete) {
              reply.content = '**balasan telah dihapus**';
            }
            delete reply.isDelete;
          }
        }
      }
    }

    return thread;
  }
}

module.exports = DetailThreadUseCase;
