import { Request, Response } from 'express'
import sendChatMail from '../../../mail/sendChatMail'

export class ChatController {
  async sendChatMail(req: Request, res: Response) {
    const { name, email, challenge } = req.body
    const html = `Good day sir/ma, \n my name is ${name} and my email is ${email} and my challange is ${challenge}`
    try {
      sendChatMail({ email, firstName: name, html })
      res.status(201).send({ message: 'Mail sent succesfully', status: true })
    } catch (error) {
      console.log('error sending mail', error)
      res.status(500).send({ message: 'Mail sending failed', status: false })
    }
  }
}
