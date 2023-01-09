exports.up = (pgm) => {
  pgm.createTable('thread_comment_replies', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    content: {
      type: 'TEXT',
      notNull: true,
    },
    thread_comment_id: {
      type: 'VARCHAR(50)',
      references: 'thread_comments',
      notNull: true,
      foreignKeys: true,
      onDelete: 'cascade',
      index: true
    },
    owner: {
      type: 'VARCHAR(50)',
      references: 'users',
      notNull: true,
      foreignKeys: true,
      onDelete: 'cascade',
    },
    date: {
      type: 'TIMESTAMP',
      notNull: true,
      default: pgm.func('current_timestamp')
    },
    is_delete: {
      type: 'BOOLEAN',
      notNull: true,
      default: 'false',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('thread_comment_replies');
};
