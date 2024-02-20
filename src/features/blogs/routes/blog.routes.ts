import express from 'express'
import { BlogController } from '../controllers/blog.controller'

const blogRouter = express.Router()

blogRouter.get('/blog/:id', BlogController.prototype.getBlog)
blogRouter.get('/blog', BlogController.prototype.getAllBlog)
blogRouter.put('/blog/update', BlogController.prototype.updateBlog)
blogRouter.post('/blog/like/inc', BlogController.prototype.incBlogLikeCount)
blogRouter.post('/blog/comment/inc', BlogController.prototype.incBlogComment)
blogRouter.post('/blog/create', BlogController.prototype.createBlog)
blogRouter.delete('/blog/delete/:id', BlogController.prototype.deleteBlog)

export { blogRouter }
