import { Request, Response } from 'express'
import { Waiting } from '../models/waiting.model'

export class WaitingController {
  async saveWaiting(req: Request, res: Response) {
    const { name, email } = req.body
    await Waiting.save({ name, email })
    res
      .status(201)
      .send({ message: 'user added to wait list succesfully', status: true })
  }
}
