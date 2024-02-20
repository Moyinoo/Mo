import { Request, Response } from 'express'
import { CommentModel } from '../models/comment.model'

export class CommentController {
  async getComment(req: Request, res: Response) {
    const { id } = req.params
    try {
      const comment = await CommentModel.getWithUser(+id)
      console.log(comment)
      res.status(200).send({
        message: 'Fetch successfull',
        data: typeof comment === 'undefined' ? [] : comment,
      })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: {} })
    }
  }

  async createComment(req: Request, res: Response) {
    try {
      const comment = await CommentModel.create({ ...req.body })
      res
        .status(200)
        .send({ message: 'Comment added successfully', data: comment.id })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: {} })
    }
  }

  async incComment(req: Request, res: Response) {
    try {
      const comment = await CommentModel.incCommentLike(
        req.body.comment_id,
        req.body.process,
      )
      res.status(200).send({ message: 'increment successfully', data: {} })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: {} })
    }
  }

  async incCommentReply(req: Request, res: Response) {
    try {
      const comment = await CommentModel.incReply(req.body.comment_id)
      res.status(200).send({ message: 'Comment added successfully', data: {} })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: {} })
    }
  }

  async deleteComment(req: Request, res: Response) {
    const { id } = req.params
    try {
      const comment = await CommentModel.delete(+id)
      res.status(200).send({ message: 'Delete succesfull', data: comment })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: {} })
    }
  }
}
