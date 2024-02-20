import path from 'path'
import ejs from 'ejs'
import transporter from './transporter'
import dotenv from 'dotenv'
import IAssessmentData from '../features/Assesement/interfaces/assesement.interface'
dotenv.config()
interface ImailOptions {
  from: string
  to: string
  cc?: string[]
  bcc?: string[]
  subject: string
  html: string
}

const sendAssesementResultMail = async ({
  email,
  firstName,
  data,
}: {
  email: string
  firstName: string
  data: IAssessmentData
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
  const templatePath = path.join(__dirname, '../views/index.ejs')
  const dat = await ejs.renderFile(templatePath, {
    firstName,
    keyz: Object.values(data).map(e =>
      Object.keys(e).find(key => key !== 'total'),
    ),
    scoreMap: {
      0: 'turns on your emergency alarm.',
      1: 'turns on your emergency alarm.',
      2: 'turns on your emergency alarm.',
      3: 'gives you a feeling of discomfort.',
      4: 'gives you a feeling of discomfort.',
      5: 'gives you a feeling of discomfort.',
      6: 'is not as great as you want it.',
      7: 'is not as great as you want it.',
      8: 'makes you feel proud',
      9: 'makes you feel proud',
      10: 'makes you feel proud',
    },
    data,
  })

  const mailOption: ImailOptions = {
    from: 'Tayture <hello@tayture.com>',
    to: email,
    bcc: ['assesement@tayture.com'],
    subject: `Here comes the result of your satisfaction calculator <${dateTime}>`,
    html: dat,
  }

  try {
    await transporter.sendMail(mailOption)
    console.log('Mail sent succesfully')
  } catch (error) {
    //@ts-ignore
    console.log('Error sending mail', error)
    console.error(error, 'Assesement result')
  }
}

export default sendAssesementResultMail
