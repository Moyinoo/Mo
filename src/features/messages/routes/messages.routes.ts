import express from 'express'
import { MessageController } from '../controllers/messages.controller'

const messagesRouter = express.Router()

messagesRouter.post('/messages/verify', MessageController.prototype.verify)
// schoolRouter.post('/user/register', SchoolController.prototype.register)
// schoolRouter.get('/user/signout', auth, signOut, SchoolController.prototype.signout)

export { messagesRouter }
