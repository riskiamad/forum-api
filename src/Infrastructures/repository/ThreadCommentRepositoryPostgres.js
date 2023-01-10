const ThreadCommentRepository = require('../../Domains/threadComments/ThreadCommentRepository');

class ThreadCommentRepositoryPostgres extends ThreadCommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(newComment) {
    const { content, threadId, owner } = newComment;
    const id = `comment-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO thread_comments VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, content, threadId, owner, date],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async deleteComment(commentId) {
    const query = {
      text: 'UPDATE thread_comments' +
            ' SET is_delete = true' +
            ' WHERE id = $1',
      values: [commentId],
    };

    await this._pool.query(query);
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: `SELECT tc.id, tc.content, tc.date, tc.is_delete AS "isDelete", u.username, COUNT(ucl.id)::int AS "likeCount"` +
            ` FROM thread_comments tc` +
            ` LEFT JOIN users u ON u.id = tc.owner` +
            ` LEFT JOIN user_comment_likes ucl ON tc.id = ucl.comment_id` +
            ` WHERE tc.thread_id = $1 GROUP BY tc.id, u.username ORDER BY date ASC`,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async verifyCommentExists(commentId) {
    const query = {
      text: 'SELECT id FROM thread_comments WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new Error('THREAD_COMMENT.NOT_FOUND');
    }
  }

  async verifyCommentOwner(commentId, owner) {
    const query = {
      text: 'SELECT id, owner FROM thread_comments WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new Error('THREAD_COMMENT.NOT_FOUND');
    }

    if (result.rows[0].owner !== owner) {
      throw new Error('THREAD_COMMENT.UNAUTHORIZED');
    }
  }

  async verifyUserCommentLikeExists(commentId, userId) {
    const query = {
      text: 'SELECT id FROM user_comment_likes WHERE comment_id = $1 AND user_id = $2',
      values: [commentId, userId],
    };

    const result = await this._pool.query(query);

    return !!result.rowCount;
  }

  async addUserCommentLikes(commentId, userId) {
    const id = `commentLike-${this._idGenerator()}`;
    const query = {
      text: 'INSERT INTO user_comment_likes VALUES($1, $2, $3) RETURNING id, comment_id, user_id',
      values: [id, commentId, userId],
    }

    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async deleteUserCommentLikes(commentId, userId) {
    const query = {
      text: 'DELETE FROM user_comment_likes WHERE comment_id = $1 AND user_id = $2',
      values: [commentId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new Error('USER_COMMENT_LIKE.NOT_FOUND');
    }
  }
}

module.exports = ThreadCommentRepositoryPostgres;
