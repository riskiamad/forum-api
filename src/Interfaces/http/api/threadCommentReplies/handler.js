const AddReplyUseCase = require('../../../../Applications/use_case/threadCommentReplies/AddReplyUseCase');
const DeleteUseCase = require('../../../../Applications/use_case/threadCommentReplies/DeleteReplyUseCase');

class ThreadCommentRepliesHandler {
  constructor(container) {
    this._container = container;

    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
  }

  async postReplyHandler(request, h) {
    const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);
    const { id: owner } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    const { content } = request.payload;
    const addedReply = await addReplyUseCase.execute({ content, threadId, commentId, owner});

    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }

  async deleteReplyHandler(request, h) {
    const deleteReplyUseCase = this._container.getInstance(DeleteUseCase.name);
    const { id: owner } = request.auth.credentials;
    const { replyId } = request.params;
    await deleteReplyUseCase.execute({ owner, replyId });

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = ThreadCommentRepliesHandler;
