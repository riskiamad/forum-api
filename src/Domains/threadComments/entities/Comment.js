class Comment {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, content, threadId, owner, date, isDelete } = payload;

    this.id = id;
    this.content = content;
    this.threadId = threadId;
    this.owner = owner;
    this.date = date;
    this.isDelete = isDelete;
  }

  _verifyPayload({ id, content, owner }) {
    if (!id || !content || !owner) {
      throw new Error('THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof content !== 'string' || typeof owner !== 'string') {
      throw new Error('THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = Comment;
