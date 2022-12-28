const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const Thread = require('../../Domains/threads/entities/Thread');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(newThread) {
    const { title, body, owner } = newThread;
    const id = `thread-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, body, owner',
      values: [id, title, body, owner, date],
    };

    const result = await this._pool.query(query);

    return new Thread({ ...result.rows[0] });
  }

  async getThreadById(threadId) {
    const query = {
      text: 'SELECT t.id, t.title, t.body, t.date, u.username FROM threads t' +
            ' LEFT JOIN users u ON u.id = t.owner' +
            ' WHERE t.id = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new Error('THREAD_REPOSITORY_POSTGRES.NOT_FOUND')
    }

    return result.rows[0];
  }
}

module.exports = ThreadRepositoryPostgres;
