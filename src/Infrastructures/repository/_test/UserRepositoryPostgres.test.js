const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const RegisteredUser = require('../../../Domains/users/entities/RegisteredUser');
const pool = require('../../database/postgres/pool');
const { customAlphabet } = require('nanoid');
const nanoid = customAlphabet('123456789abcdef', 10);
const UserRepositoryPostgres = require('../UserRepositoryPostgres');

describe('UserRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('verifyAvailableUsername function', () => {
    it('should throw InvariantError when username not available', async () => {
      // Arrange
      const randomId = nanoid(16);
      await UsersTableTestHelper.addUser({ id: `user-${randomId}`, username: `riskiamad${randomId}` });
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(userRepositoryPostgres.verifyAvailableUsername(`riskiamad${randomId}`)).rejects.toThrowError(InvariantError);
    });

    it('should not throw InvariantError when username available', async () => {
      // Arrange
      const randomId = nanoid(16);
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, { id: `user-${randomId}`, username: `riskiamad${randomId}` });

      // Action and Assert
      await expect(userRepositoryPostgres.verifyAvailableUsername(`riskiamad${randomId}`)).resolves.not.toThrowError(InvariantError);
    });
  });

  describe('addUser function', () => {
    it('should persist register user', async () => {
      // Arrange
      const randomId = nanoid(16);
      const registerUser = new RegisterUser({
        username: `riskiamad${randomId}`,
        password: 'secret_password',
        fullname: 'Achmad Rizky Syahrani',
      });
      const fakeIdGenerator = () => randomId; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await userRepositoryPostgres.addUser(registerUser);

      // Assert
      const users = await UsersTableTestHelper.findUsersById(`user-${randomId}`);
      expect(users).toHaveLength(1);
    });

    it('should return registered user correctly', async () => {
      // Arrange
      const randomId = nanoid(16);
      const registerUser = new RegisterUser({
        username: `riskiamad${randomId}`,
        password: 'secret_password',
        fullname: 'Achmad Rizky Syahrani',
      });
      const fakeIdGenerator = () => randomId; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const registeredUser = await userRepositoryPostgres.addUser(registerUser);

      // Assert
      expect(registeredUser).toStrictEqual(new RegisteredUser({
        id: `user-${randomId}`,
        username: `riskiamad${randomId}`,
        fullname: 'Achmad Rizky Syahrani',
      }));
    });
  });

  describe('getPasswordByUsername', () => {
    it('should throw InvariantError when user not found', () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(userRepositoryPostgres.getPasswordByUsername('dicoding'))
        .rejects
        .toThrowError(InvariantError);
    });

    it('should return username password when user is found', async () => {
      // Arrange
      const randomId = nanoid(16);
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({
        id: `user-${randomId}`,
        username: `riskiamad${randomId}`,
        password: 'secret_password',
      });

      // Action & Assert
      const password = await userRepositoryPostgres.getPasswordByUsername(`riskiamad${randomId}`);
      expect(password).toBe('secret_password');
    });
  });

  describe('getIdByUsername', () => {
    it('should throw InvariantError when user not found', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(userRepositoryPostgres.getIdByUsername('dicoding'))
        .rejects
        .toThrowError(InvariantError);
    });

    it('should return user id correctly', async () => {
      // Arrange
      const randomId = nanoid(16);
      await UsersTableTestHelper.addUser({ id: `user-${randomId}`, username: `riskiamad${randomId}` });
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action
      const userId = await userRepositoryPostgres.getIdByUsername(`riskiamad${randomId}`);

      // Assert
      expect(userId).toEqual(`user-${randomId}`);
    });
  });
});
