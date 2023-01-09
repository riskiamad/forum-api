/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadCommentRepliesTestHelper = {
  async addReply({
    id = 'reply-123', content = 'content reply', commentId = 'comment-123', owner = 'user-123', date = new Date().toISOString()
  }) {
    const query = {
      text: 'INSERT INTO thread_comment_replies VALUES($1, $2, $3, $4, $5)',
      values: [id, content, commentId, owner, date],
    };

    await pool.query(query);
  },

  async findReplyById(id) {
    const query = {
      text: 'SELECT id, content, owner, thread_comment_id, is_delete, date FROM thread_comment_replies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('TRUNCATE TABLE thread_comment_replies');
  },
};

module.exports = ThreadCommentRepliesTestHelper;
