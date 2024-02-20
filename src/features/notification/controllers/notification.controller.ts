import { Request, Response } from 'express'
import { NotificationModel } from '../models/notification.model'

export class NotificationController {
  async getUserNotification(req: Request, res: Response) {
    const { id } = req.params
    try {
      const notification = await NotificationModel.get(+id)

      res.status(200).send({ message: 'Fetch successfull', data: notification })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: {} })
    }
  }

  async updateNotification(req: Request, res: Response) {
    try {
      const user = await NotificationModel.update({ ...req.body })
      res.status(200).send({ message: 'Update Succesfull', data: user })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: {} })
    }
  }

  async createNotification(req: Request, res: Response) {
    try {
      const user = await NotificationModel.create({ ...req.body })
      res
        .status(200)
        .send({ message: 'Notification added successfully', data: user.id })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: {} })
    }
  }

  async deleteNotification(req: Request, res: Response) {
    const { id } = req.params
    try {
      const user = await NotificationModel.delete(+id)
      res.status(200).send({ message: 'Delete succesfull', data: user })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: {} })
    }
  }
}
