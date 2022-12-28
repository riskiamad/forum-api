/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadCommentRepliesTestHelper = {
  async addReply({
    id = 'reply-123', content = 'content reply', commentId = 'comment-123', owner = 'user-123'
                 }) {
    const query = {
      text: 'INSERT INTO thread_comment_replies VALUES($1, $2, $3, $4)',
      values: [id, content, commentId, owner],
    };

    await pool.query(query);
  },

  async findReplyById(id) {
    const query = {
      text: 'SELECT * FROM thread_comment_replies WHERE id = $1 AND NOT is_delete',
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
