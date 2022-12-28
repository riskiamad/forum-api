const ThreadCommentRepository = require('../../Domains/threadComments/ThreadCommentRepository');
const Comment = require('../../Domains/threadComments/entities/Comment');

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

    return new Comment({ ...result.rows[0] });
  }

  // getCommentById = (commentId) => new Promise(async (resolve, reject) => {
  //   try {
  //     const query = {
  //       text: 'SELECT id, content, thread_id AS "threadId", owner, date, is_delete AS "isDelete" FROM thread_comments' +
  //         ' WHERE id = $1',
  //       values: [commentId],
  //     };
  //
  //     const result = await this._pool.query(query);
  //     resolve(new Comment( { ...result.rows[0] }))
  //   } catch (error) {
  //     reject(error)
  //   }
  // })

  async getCommentById(commentId) {
    const query = {
      text: 'SELECT id, content, thread_id AS "threadId", owner, date, is_delete AS "isDelete" FROM thread_comments' +
            ' WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new Error('THREAD_COMMENT_REPOSITORY_POSTGRES.NOT_FOUND');
    }

    return new Comment({...result.rows[0]});
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
      text: `SELECT tc.id, tc.thread_id AS "threadId", tc.date, u.username,` +
            ` CASE is_delete WHEN true THEN '**komentar telah dihapus**'` +
            ` ELSE content END AS content FROM thread_comments tc ` +
            ` LEFT JOIN users u ON u.id = tc.owner` +
            ` WHERE tc.thread_id = $1 ORDER BY date ASC`,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }
}

module.exports = ThreadCommentRepositoryPostgres;
