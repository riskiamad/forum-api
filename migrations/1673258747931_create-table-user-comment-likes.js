exports.up = (pgm) => {
  pgm.createTable('user_comment_likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    comment_id: {
      type: 'VARCHAR(50)',
      references: 'thread_comments',
      notNull: true,
      foreignKeys: true,
      onDelete: 'cascade',
      index: true
    },
    user_id: {
      type: 'VARCHAR(50)',
      references: 'users',
      notNull: true,
      foreignKeys: true,
      onDelete: 'cascade',
      index: true
    }
  })
};

exports.down = (pgm) => {
  pgm.dropTable('user_comment_likes');
};
