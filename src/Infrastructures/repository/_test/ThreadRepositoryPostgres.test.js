const ThreadTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const { customAlphabet } = require('nanoid');
const nanoid = customAlphabet('123456789abcdef', 10);

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist add thread', async () => {
      const randomId = nanoid(16);
      // Add User
      await UsersTableTestHelper.addUser({ id: `user-${randomId}`, username: `riskiamad${randomId}` });

      // Arrange
      const newThread = new NewThread({
        title: 'Judul Thread',
        body: 'Body Thread',
        owner: `user-${randomId}`,
      });
      const fakeIdGenerator = () => randomId;
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadRepositoryPostgres.addThread(newThread);

      // Assert
      const threads = await ThreadTableTestHelper.findThreadsById(`thread-${randomId}`);
      expect(threads).toHaveLength(1);
      expect(threads[0].id).toEqual(`thread-${randomId}`);
      expect(threads[0].title).toEqual(newThread.title);
      expect(threads[0].body).toEqual(newThread.body);
      expect(threads[0].owner).toEqual(newThread.owner);
      expect(threads[0].date).toBeDefined();
      expect(threads[0].date).not.toEqual('');
    });
  });

  describe('getThreadById function', () => {
    it('should return thread', async () => {
      const randomId = nanoid(16);
      // Add User
      await UsersTableTestHelper.addUser({ id: `user-${randomId}`, username: `riskiamad${randomId}` });

      // Arrange
      const newThread = new NewThread({
        title: 'Judul Thread',
        body: 'Body Thread',
        owner: `user-${randomId}`,
      });
      const fakeIdGenerator = () => randomId;
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadRepositoryPostgres.addThread(newThread);
      const threads = await threadRepositoryPostgres.getThreadById(`thread-${randomId}`);

      // Assert
      expect(threads.id).toEqual(`thread-${randomId}`);
      expect(threads.title).toEqual(newThread.title);
      expect(threads.body).toEqual(newThread.body);
      expect(threads.username).toEqual(`riskiamad${randomId}`);
      expect(threads.date).toBeDefined();
      expect(threads.date).not.toEqual('');
    });
  });

  describe('verifyThreadExists function', () => {
    it('should return true if thread exists', async () => {
      const randomId = nanoid(16);
      // Add User
      await UsersTableTestHelper.addUser({ id: `user-${randomId}`, username: `riskiamad${randomId}` });

      // Arrange
      const newThread = new NewThread({
        title: 'Judul Thread',
        body: 'Body Thread',
        owner: `user-${randomId}`,
      });
      const fakeIdGenerator = () => randomId;
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadRepositoryPostgres.addThread(newThread);
      const exists = await threadRepositoryPostgres.verifyThreadExists(`thread-${randomId}`);

      // Assert
      expect(exists).toEqual(true);
    });
  });
});
