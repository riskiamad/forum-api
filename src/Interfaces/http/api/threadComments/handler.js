const AddCommentUseCase = require('../../../../Applications/use_case/threadComments/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/threadComments/DeleteCommentUseCase');

class ThreadCommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
    const { id: owner } = request.auth.credentials;
    const { threadId } = request.params;
    const { content } = request.payload;
    const addedComment = await addCommentUseCase.execute({ content, threadId, owner });

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentHandler(request, h) {
    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);
    const { id: owner } = request.auth.credentials;
    const { commentId } = request.params;
    await deleteCommentUseCase.execute({ owner, commentId });

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = ThreadCommentsHandler;
