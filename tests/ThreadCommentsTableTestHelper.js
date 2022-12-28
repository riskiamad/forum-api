/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadCommentTableHelper = {
  async addComment({
    id = 'comment-123', content = 'content comment', threadId = 'thread-123', owner = 'user-123'
  }) {
    const query = {
      text: 'INSERT INTO thread_comments VALUES($1, $2, $3, $4)',
      values: [id, content, threadId, owner],
    };

    await pool.query(query);
  },

  async findCommentsById(id) {
    const query = {
      text: `SELECT * FROM thread_comments WHERE id = $1 AND NOT is_delete`,
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('TRUNCATE TABLE thread_comments CASCADE');
  },
};

module.exports = ThreadCommentTableHelper;
