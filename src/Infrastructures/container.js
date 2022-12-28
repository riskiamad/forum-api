/* istanbul ignore file */

const { createContainer } = require('instances-container');

// external agency
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const Jwt = require('@hapi/jwt');
const pool = require('./database/postgres/pool');

// service (repository, helper, manager, etc)
const UserRepository = require('../Domains/users/UserRepository');
const PasswordHash = require('../Applications/security/PasswordHash');
const UserRepositoryPostgres = require('./repository/UserRepositoryPostgres');
const BcryptPasswordHash = require('./security/BcryptPasswordHash');
const AuthenticationTokenManager = require('../Applications/security/AuthenticationTokenManager');
const JwtTokenManager = require('./security/JwtTokenManager');
const AuthenticationRepository = require('../Domains/authentications/AuthenticationRepository');
const AuthenticationRepositoryPostgres = require('../Infrastructures/repository/AuthenticationRepositoryPostgres');
const ThreadRepository = require('../Domains/threads/ThreadRepository');
const ThreadRepositoryPostgres = require('../Infrastructures/repository/ThreadRepositoryPostgres');
const ThreadCommentRepository = require('../Domains/threadComments/ThreadCommentRepository');
const ThreadCommentRepositoryPostgres = require('../Infrastructures/repository/ThreadCommentRepositoryPostgres');
const ThreadCommentReplyRepository = require('../Domains/threadCommentReplies/ThreadCommentReplyRepository');
const ThreadCommentReplyRepositoryPostgres = require('../Infrastructures/repository/ThreadCommentReplyRepositoryPostgres');

// use case
const AddUserUseCase = require('../Applications/use_case/users/AddUserUseCase');
const LoginUserUseCase = require('../Applications/use_case/authentications/LoginUserUseCase');
const LogoutUserUseCase = require('../Applications/use_case/authentications/LogoutUserUseCase');
const RefreshAuthenticationUseCase = require('../Applications/use_case/authentications/RefreshAuthenticationUseCase');
const NewThreadUseCase = require('../Applications/use_case/threads/NewThreadUseCase');
const AddCommentUseCase = require('../Applications/use_case/threadComments/AddCommentUseCase');
const DeleteCommentUseCase = require('../Applications/use_case/threadComments/DeleteCommentUseCase');
const DetailThreadUseCase = require('../Applications/use_case/threads/DetailThreadUseCase');
const AddReplyUseCase = require('../Applications/use_case/threadCommentReplies/AddReplyUseCase');
const DeleteReplyUseCase = require('../Applications/use_case/threadCommentReplies/DeleteReplyUseCase');

// creating container
const container = createContainer();

// registering services and repository
container.register([
  {
    key: UserRepository.name,
    Class: UserRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
  {
    key: AuthenticationRepository.name,
    Class: AuthenticationRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
      ],
    },
  },
  {
    key: ThreadRepository.name,
    Class: ThreadRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
  {
    key: ThreadCommentRepository.name,
    Class: ThreadCommentRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
  {
    key: ThreadCommentReplyRepository.name,
    Class: ThreadCommentReplyRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
  {
    key: PasswordHash.name,
    Class: BcryptPasswordHash,
    parameter: {
      dependencies: [
        {
          concrete: bcrypt,
        },
      ],
    },
  },
  {
    key: AuthenticationTokenManager.name,
    Class: JwtTokenManager,
    parameter: {
      dependencies: [
        {
          concrete: Jwt.token,
        },
      ],
    },
  },
]);

// registering use cases
container.register([
  {
    key: AddUserUseCase.name,
    Class: AddUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'userRepository',
          internal: UserRepository.name,
        },
        {
          name: 'passwordHash',
          internal: PasswordHash.name,
        },
      ],
    },
  },
  {
    key: LoginUserUseCase.name,
    Class: LoginUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'userRepository',
          internal: UserRepository.name,
        },
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name,
        },
        {
          name: 'authenticationTokenManager',
          internal: AuthenticationTokenManager.name,
        },
        {
          name: 'passwordHash',
          internal: PasswordHash.name,
        },
      ],
    },
  },
  {
    key: LogoutUserUseCase.name,
    Class: LogoutUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name,
        },
      ],
    },
  },
  {
    key: RefreshAuthenticationUseCase.name,
    Class: RefreshAuthenticationUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name,
        },
        {
          name: 'authenticationTokenManager',
          internal: AuthenticationTokenManager.name,
        },
      ],
    },
  },
  {
    key: NewThreadUseCase.name,
    Class: NewThreadUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadRepository',
          internal: ThreadRepository.name,
        },
      ],
    },
  },
  {
    key: AddCommentUseCase.name,
    Class: AddCommentUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadCommentRepository',
          internal: ThreadCommentRepository.name,
        },
        {
          name: 'threadRepository',
          internal: ThreadRepository.name,
        },
      ],
    },
  },
  {
    key: DeleteCommentUseCase.name,
    Class: DeleteCommentUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadCommentRepository',
          internal: ThreadCommentRepository.name,
        },
      ],
    },
  },
  {
    key: DetailThreadUseCase.name,
    Class: DetailThreadUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadRepository',
          internal: ThreadRepository.name,
        },
        {
          name: 'threadCommentRepository',
          internal: ThreadCommentRepository.name,
        },
        {
          name: 'threadCommentReplyRepository',
          internal: ThreadCommentReplyRepository.name,
        },
      ],
    },
  },
  {
    key: AddReplyUseCase.name,
    Class: AddReplyUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadRepository',
          internal: ThreadRepository.name,
        },
        {
          name: 'threadCommentRepository',
          internal: ThreadCommentRepository.name,
        },
        {
          name: 'threadCommentReplyRepository',
          internal: ThreadCommentReplyRepository.name,
        },
      ],
    },
  },
  {
    key: DeleteReplyUseCase.name,
    Class: DeleteReplyUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadCommentReplyRepository',
          internal: ThreadCommentReplyRepository.name,
        },
      ],
    },
  },
]);

module.exports = container;
