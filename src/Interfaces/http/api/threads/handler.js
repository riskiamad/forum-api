const NewThreadUseCase = require('../../../../Applications/use_case/threads/NewThreadUseCase');
const DetailThreadUseCase = require('../../../../Applications/use_case/threads/DetailThreadUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadDetailHandler = this.getThreadDetailHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const addThreadUseCase = this._container.getInstance(NewThreadUseCase.name);
    const { id: owner } = request.auth.credentials;
    const { title, body } = request.payload;
    const addedThread = await addThreadUseCase.execute({ title, body, owner });

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async getThreadDetailHandler(request, h) {
    const detailThreadUseCase = this._container.getInstance(DetailThreadUseCase.name);
    const { threadId } = request.params;
    const thread = await detailThreadUseCase.execute(threadId);

    const response = h.response({
      status: 'success',
      data: {
        thread,
      },
    });
    response.code(200);
    return response;
  }
}

module.exports = ThreadsHandler;
