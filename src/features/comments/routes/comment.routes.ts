import express from 'express'
import { CommentController } from '../controllers/comment.controller'

const commentRouter = express.Router()

commentRouter.get('/comment/:id', CommentController.prototype.getComment)
commentRouter.post('/comment/like/inc', CommentController.prototype.incComment)
commentRouter.post(
  '/comment/reply/inc',
  CommentController.prototype.incCommentReply,
)

commentRouter.post('/comment/create', CommentController.prototype.createComment)
commentRouter.delete(
  '/comment/delete/:id',
  CommentController.prototype.deleteComment,
)

export { commentRouter }
