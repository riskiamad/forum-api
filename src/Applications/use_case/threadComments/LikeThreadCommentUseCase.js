const LikeThreadComment = require('../../../Domains/threadComments/entities/LikeThreadComment');

class LikeThreadCommentUseCase {
  constructor({
    threadRepository,
    threadCommentRepository,
              }) {
    this._threadRepository = threadRepository;
    this._threadCommentRepository = threadCommentRepository;
  }

  async execute(useCasePayload) {
    const likeThreadComment = new LikeThreadComment(useCasePayload);

    await this._threadRepository.verifyThreadExists(likeThreadComment.threadId);

    await this._threadCommentRepository.verifyCommentExists(likeThreadComment.commentId);

    const exists = await this._threadCommentRepository.verifyUserCommentLikeExists(likeThreadComment.commentId, likeThreadComment.userId);

    if (exists) {
      return await this._threadCommentRepository.deleteUserCommentLikes(likeThreadComment.commentId, likeThreadComment.userId);
    } else {
      return await this._threadCommentRepository.addUserCommentLikes(likeThreadComment.commentId, likeThreadComment.userId);
    }
  }
}

module.exports = LikeThreadCommentUseCase;
