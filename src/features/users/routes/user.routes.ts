import express from 'express'
import { UserController } from '../controllers/user.controller'
import { auth, signOut } from '../../../middlewares/auth'

const userRouter = express.Router()

userRouter.get('/user', UserController.prototype.getUser)
userRouter.post('/user/login', UserController.prototype.login)
userRouter.get('/user/signout', auth, signOut, UserController.prototype.signout)
userRouter.post('/user/register', UserController.prototype.register)
userRouter.post('/user/apply', UserController.prototype.apply)
userRouter.put('/user/update', UserController.prototype.update)
userRouter.post('/user/verify/number', UserController.prototype.verifyNumber)
userRouter.post('/user/verify/otp', UserController.prototype.verifyOTP)
userRouter.get('/user/verify/:token', UserController.prototype.verify)
userRouter.post('/user/welcome', UserController.prototype.sendWelcome)
userRouter.post('/user/filter', UserController.prototype.filterUser)
userRouter.put('/user/blog/like/update', UserController.prototype.blogLike)
userRouter.put(
  '/user/blog/comment/update',
  UserController.prototype.blogComment,
)
userRouter.put(
  '/user/comment/like/update',
  UserController.prototype.commentLike,
)
userRouter.put(
  '/user/comment/comment/update',
  UserController.prototype.commentComment,
)

export { userRouter }
