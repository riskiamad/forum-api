const ThreadCommentReplyRepository = require('../../Domains/threadCommentReplies/ThreadCommentReplyRepository');
const Comment = require("../../Domains/threadComments/entities/Comment");

class ThreadCommentReplyRepositoryPostgres extends ThreadCommentReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(newReply) {
    const { content, commentId, owner } = newReply;
    const id = `reply-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO thread_comment_replies VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, content, commentId, owner, date],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async getReplyById(replyId) {
    const query = {
      text: 'SELECT id, content, thread_comment_id AS "commentId", owner, date, is_delete AS "isDelete"' +
            ' FROM thread_comment_replies WHERE id = $1',
      values: [replyId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new Error('THREAD_COMMENT_REPLY_REPOSITORY_POSTGRES.NOT_FOUND');
    }

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

  async getRepliesByCommentId(commentId) {
    const query = {
      text: `SELECT tcr.id, tcr.thread_comment_id AS "commentId", tcr.date, u.username,` +
        ` CASE is_delete WHEN true THEN '**balasan telah dihapus**'` +
        ` ELSE content END AS content FROM thread_comment_replies tcr ` +
        ` LEFT JOIN users u ON u.id = tcr.owner` +
        ` WHERE tcr.thread_comment_id = $1 ORDER BY date ASC`,
      values: [commentId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }
}

module.exports = ThreadCommentReplyRepositoryPostgres;
