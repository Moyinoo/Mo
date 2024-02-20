import { Request, Response } from 'express'
import { BlogModel } from '../models/blog.model'

export class BlogController {
  async getBlog(req: Request, res: Response) {
    const { id } = req.params
    try {
      const blog = await BlogModel.get(+id)
      res.status(200).send({
        message: 'Fetch successfull',
        data: typeof blog === 'undefined' ? [] : blog,
      })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: {} })
    }
  }

  async getAllBlog(req: Request, res: Response) {
    try {
      const blog = await BlogModel.getAll()
      res.status(200).send({
        message: 'Fetch successfull',
        data: typeof blog === 'undefined' ? [] : blog,
      })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: {} })
    }
  }

  async updateBlog(req: Request, res: Response) {
    try {
      const blog = await BlogModel.update({ ...req.body })
      res.status(200).send({ message: 'Update Succesfull', data: blog })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: {} })
    }
  }

  async createBlog(req: Request, res: Response) {
    try {
      const blog = await BlogModel.create({ ...req.body })
      res
        .status(200)
        .send({ message: 'Blog added successfully', data: blog.id })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: {} })
    }
  }

  async incBlogLikeCount(req: Request, res: Response) {
    try {
      const comment = await BlogModel.incLike(
        req.body.blog_id,
        req.body.process,
      )
      res.status(200).send({ message: 'increment successfully', data: {} })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: {} })
    }
  }

  async incBlogComment(req: Request, res: Response) {
    try {
      const Blog = await BlogModel.incBlogComment(req.body.blog_id)
      res.status(200).send({ message: 'Comment added successfully', data: {} })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: {} })
    }
  }

  async deleteBlog(req: Request, res: Response) {
    const { id } = req.params
    try {
      const blog = await BlogModel.delete(+id)
      res.status(200).send({ message: 'Delete succesfull', data: blog })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: {} })
    }
  }
}
