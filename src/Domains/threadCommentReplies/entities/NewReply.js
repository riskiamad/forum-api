class NewReply {
  constructor(payload) {
    this._verifyPayload(payload);

    this.content = payload.content;
    this.threadId = payload.threadId;
    this.commentId = payload.commentId;
    this.owner = payload.owner;
  }

  _verifyPayload(payload) {
    const { content, threadId, commentId, owner } = payload;

    if (!content || !threadId || !commentId || !owner) {
      throw new Error('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string' || typeof threadId !== 'string' || typeof commentId !== 'string' || typeof owner !== 'string') {
      throw new Error('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = NewReply;
