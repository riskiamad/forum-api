class LikeThreadComment {
  constructor(payload) {
    this._verifyPayload(payload);

    this.threadId = payload.threadId;
    this.commentId = payload.commentId;
    this.userId = payload.userId;
  }

  _verifyPayload(payload) {
    const { threadId, commentId, userId } = payload;

    if (!threadId || !commentId || !userId) {
      throw new Error('LIKE_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof threadId !== 'string' || typeof commentId !== 'string' || typeof userId !== 'string') {
      throw new Error('LIKE_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = LikeThreadComment;
