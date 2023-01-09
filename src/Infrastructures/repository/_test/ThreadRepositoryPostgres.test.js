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
      const addedThread = await threadRepositoryPostgres.addThread(newThread);
      const threads = await ThreadTableTestHelper.findThreadsById(`thread-${randomId}`);
      // Assert
      expect(addedThread.id).toEqual(`thread-${randomId}`);
      expect(addedThread.title).toEqual(newThread.title);
      expect(addedThread.body).toEqual(newThread.body);
      expect(addedThread.owner).toEqual(newThread.owner);
      expect(threads).toHaveLength(1);
      expect(threads[0].id).toEqual(`thread-${randomId}`);
    });
  });

  describe('getThreadById function', () => {
    it('should return thread', async () => {
      const randomId = nanoid(16);
      const userId = `user-${randomId}`;
      const threadId = `thread-${randomId}`;

      // Add User
      await UsersTableTestHelper.addUser({ id: userId, username: `riskiamad${randomId}` });

      // Arrange
      const newThread = new NewThread({
        title: 'Judul Thread',
        body: 'Body Thread',
        owner: userId,
      });
      const fakeIdGenerator = () => randomId;
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const now = new Date();
      await ThreadTableTestHelper.addThread({ id: threadId, title: newThread.title, body: newThread.body, owner: newThread.owner, date: now });
      const threads = await threadRepositoryPostgres.getThreadById(threadId);

      // Assert
      expect(threads.id).toEqual(threadId);
      expect(threads.title).toEqual(newThread.title);
      expect(threads.body).toEqual(newThread.body);
      expect(threads.username).toEqual(`riskiamad${randomId}`);
      expect(threads.date).toEqual(now);
    });

    it('should throw error not found', async () => {
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Assert
      await expect(threadRepositoryPostgres.getThreadById('xxx')).rejects.toThrowError('THREAD.NOT_FOUND');
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

      // Assert
      await expect(threadRepositoryPostgres.verifyThreadExists(`thread-${randomId}`)).resolves.not.toThrowError('THREAD.NOT_FOUND');
    });

    it('should throw error if thread not exists', async () => {
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
      await expect(threadRepositoryPostgres.verifyThreadExists(`xxx`)).rejects.toThrowError('THREAD.NOT_FOUND');
    });
  });
});
