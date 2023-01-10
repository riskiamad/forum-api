/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const UserCommentLikesTableHelper = {
  async addUserCommentLikes({
                              id = 'commentLike-123', commentId = 'comment-123', userId = 'user-123'
                            }) {
    const query = {
      text: 'INSERT INTO user_comment_likes VALUES($1, $2, $3) RETURNING id, comment_id, user_id',
      values: [id, commentId, userId],
    }

    await pool.query(query);
  },

  async getUserCommentLikes(id) {
    const query = {
      text: 'SELECT id, comment_id, user_id FROM user_comment_likes WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('TRUNCATE TABLE user_comment_likes CASCADE');
  },
};

module.exports = UserCommentLikesTableHelper
