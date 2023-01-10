const AddCommentUseCase = require('../../../../Applications/use_case/threadComments/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/threadComments/DeleteCommentUseCase');
const LikeThreadCommentUseCase = require('../../../../Applications/use_case/threadComments/LikeThreadCommentUseCase');

class ThreadCommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
    this.likeCommentHandler = this.likeCommentHandler.bind(this);
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

  async likeCommentHandler(request, h) {
    const likeCommentUseCase = this._container.getInstance(LikeThreadCommentUseCase.name);
    const { id: userId } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    await likeCommentUseCase.execute({ threadId, commentId, userId });

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = ThreadCommentsHandler;
