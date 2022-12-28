const NewThread = require('../../../Domains/threads/entities/NewThread');

class NewThreadUseCase {
  constructor({
    threadRepository,
  }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const newThread = new NewThread(useCasePayload);
    return await this._threadRepository.addThread(newThread);
  }
}

module.exports = NewThreadUseCase;
