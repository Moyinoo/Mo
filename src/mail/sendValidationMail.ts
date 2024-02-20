import { transporter2 } from './transporter'
import dotenv from 'dotenv'
import path from 'path'
import ejs from 'ejs'

dotenv.config()
interface ImailOptions {
  from: string
  to: string
  cc?: string[]
  bcc?: string[]
  subject: string
  html: string
}

const sendValidationMail = async ({
  email,
  firstName,
  link,
}: {
  email: string
  firstName: string
  link: string
}) => {
  let current = new Date()
  let cDate =
    current.getFullYear() +
    '-' +
    (current.getMonth() + 1) +
    '-' +
    current.getDate()
  let cTime =
    current.getHours() + ':' + current.getMinutes() + ':' + current.getSeconds()
  let dateTime = cDate + ' ' + cTime

  const templatePath = path.join(__dirname, '../views/verification.ejs')
  const dat = await ejs.renderFile(templatePath, {
    firstName,
    link,
  })

  const mailOption: ImailOptions = {
    from: 'Tayture <support@tayture.com>',
    to: email,
    subject: `Verify Your Email Address for Tayture<${dateTime}>`,
    html: dat,
  }

  try {
    await transporter2.sendMail(mailOption)
    console.log('Verification Mail sent succesfully')
  } catch (error) {
    console.error(error, 'Validation Mail')
    console.log('Error sending Verification mail', error)
  }
}

export default sendValidationMail
