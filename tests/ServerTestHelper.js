/* istanbul ignore file */
const AuthenticationTokenManager = require('../src/Applications/security/AuthenticationTokenManager');
const container = require('../src/Infrastructures/container');
const UserTableTestHelper = require('./UsersTableTestHelper');
const { customAlphabet } = require('nanoid');
const nanoid = customAlphabet('123456789abcdef', 10);

const ServerTestHelper = {
  async generateToken() {
    const randomId = nanoid(16);
    const payload = {
      id: `user-${randomId}`,
      username: `riskiamad${randomId}`,
    };
    await UserTableTestHelper.addUser(payload);

    return await container.getInstance(AuthenticationTokenManager.name).createAccessToken(payload);
  },

  async cleanTable() {
    await UserTableTestHelper.cleanTable();
  },
}

module.exports = ServerTestHelper;
