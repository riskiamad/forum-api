const ThreadCommentReplyRepository = require('../../Domains/threadCommentReplies/ThreadCommentReplyRepository');

class ThreadCommentReplyRepositoryPostgres extends ThreadCommentReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(newReply) {
    const {content, commentId, owner} = newReply;
    const id = `reply-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO thread_comment_replies VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, content, commentId, owner, date],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async deleteReply(replyId) {
    const query = {
      text: 'UPDATE thread_comment_replies' +
        ' SET is_delete = true' +
        ' WHERE id = $1',
      values: [replyId],
    };

    await this._pool.query(query);
  }

  async getRepliesByCommentIds(commentIds) {
    const query = {
      text: `SELECT tcr.id, tcr.date, tcr.content, tcr.is_delete AS "isDelete", tcr.thread_comment_id AS "commentId", u.username
      FROM thread_comment_replies tcr
      INNER JOIN users u ON u.id = tcr.owner
      WHERE tcr.thread_comment_id = ANY($1::text[])
      ORDER BY tcr.date ASC`,
      values: [commentIds],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async verifyReplyOwner(replyId, owner) {
    const query = {
      text: 'SELECT id, owner FROM thread_comment_replies WHERE id = $1',
      values: [replyId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new Error('THREAD_COMMENT_REPLY.NOT_FOUND');
    }

    if (result.rows[0].owner !== owner) {
      throw new Error('THREAD_COMMENT_REPLY.UNAUTHORIZED');
    }
  }
}

module.exports = ThreadCommentReplyRepositoryPostgres;
