/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadCommentTableHelper = {
  async addComment({
    id = 'comment-123', content = 'content comment', threadId = 'thread-123', owner = 'user-123', date = new Date().toISOString()
  }) {
    const query = {
      text: 'INSERT INTO thread_comments VALUES($1, $2, $3, $4, $5)',
      values: [id, content, threadId, owner, date],
    };

    await pool.query(query);
  },

  async findCommentsById(id) {
    const query = {
      text: 'SELECT id, content, owner, thread_id, is_delete, date FROM thread_comments WHERE id = $1',
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
