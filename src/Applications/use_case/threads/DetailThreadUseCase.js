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
    thread.comments = await this._threadCommentRepository.getCommentsByThreadId(thread.id);

    for (const comment of thread.comments) {
      const replies = await this._threadCommentReplyRepository.getRepliesByCommentId(comment.id);
      if (replies.length) {
        comment.replies = replies;
      }
    }

    return thread;
  }
}

module.exports = DetailThreadUseCase;
