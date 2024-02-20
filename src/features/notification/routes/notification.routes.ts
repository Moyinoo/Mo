import express from 'express'
import { NotificationController } from '../controllers/notification.controller'

const notificationRouter = express.Router()

notificationRouter.get(
  '/notification/:id',
  NotificationController.prototype.getUserNotification,
)
notificationRouter.post(
  '/notification/create',
  NotificationController.prototype.createNotification,
)

notificationRouter.put(
  '/notification/update',
  NotificationController.prototype.updateNotification,
)

notificationRouter.delete(
  '/notification/delete/:id',
  NotificationController.prototype.deleteNotification,
)

export { notificationRouter }
