import { sms } from '../../../sms/twilio'

class MessageService {
  public sendText(msg: string, no: string) {
    console.log(process.env.TWILIO_NUMBER!)
    sms.messages
      .create({
        from: process.env.TWILIO_NUMBER,
        to: no,
        body: `Your otp is ${msg}`,
      })
      .then(result => console.log('message sent'))
      .catch((error: Error) => console.log(error))
  }
}

export const messageService: MessageService = new MessageService()
