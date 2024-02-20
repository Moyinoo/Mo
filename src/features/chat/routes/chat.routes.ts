import express from 'express'
import { ChatController } from '../controllers/chat.controller'

const chatRouter = express.Router()

chatRouter.post('/chat', ChatController.prototype.sendChatMail)

export { chatRouter }
