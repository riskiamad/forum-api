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
      const commentsMap = new Map();

      for (const comment of comments) {
        if (comment.isDelete) {
          comment.content = '**komentar telah dihapus**';
        }
        delete comment.isDelete;

        commentsMap.set(comment.id, comment);
      }

      const commentIds = Array.from(commentsMap.keys());

      const replies = await this._threadCommentReplyRepository.getRepliesByCommentIds(commentIds);

      if (replies.length) {
        for (const reply of replies) {
          if (reply.isDelete) {
            reply.content = '**balasan telah dihapus**';
          }
          delete reply.isDelete;

          let commentObject = commentsMap.get(reply.commentId);

          delete reply.commentId;

          commentObject.replies ? commentObject.replies.push(reply) : commentObject.replies = [reply];
        }
      }

      thread.comments = Array.from(commentsMap.values());
    }

    return thread;
  }
}

module.exports = DetailThreadUseCase;
