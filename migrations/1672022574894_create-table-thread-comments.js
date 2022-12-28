/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('thread_comments', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    content: {
      type: 'TEXT',
      notNull: true,
    },
    thread_id: {
      type: 'VARCHAR(50)',
      references: 'threads',
      notNull: true,
      foreignKeys: true,
      onDelete: 'cascade',
      index: true,
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
      default: pgm.func('CURRENT_TIMESTAMP'),
    },
    is_delete: {
      type: 'BOOLEAN',
      notNull: true,
      default: 'false',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('thread_comments');
};
