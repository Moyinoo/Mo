import nodemailer from 'nodemailer'
// import { env } from "../config";

const transporter = nodemailer.createTransport({
  // host:  "env.MAIL_HOST",
  // port:  +env.MAIL_PORT,
  // secure: true,
  // auth: {
  //   user: env.MAIL_USER,
  //   pass: env.MAIL_PASS,
  // },
  host: 'tayture.com',
  port: 465,
  secure: true,
  auth: {
    user: 'hello@tayture.com',
    pass: '.g?Ov?}oty$0',
  },
})

export const transporter2 = nodemailer.createTransport({
  // host:  "env.MAIL_HOST",
  // port:  +env.MAIL_PORT,
  // secure: true,
  // auth: {
  //   user: env.MAIL_USER,
  //   pass: env.MAIL_PASS,
  // },
  host: 'tayture.com',
  port: 465,
  secure: true,
  auth: {
    user: 'support@tayture.com',
    pass: 'E5&4koG#+r[}',
  },
})

export const startMailServer = () => {
  transporter.verify((error, success) => {
    if (error) {
      console.log(error)
    } else {
      console.log('Mail hello server is running')
    }
  })
}
export const startMailServer2 = () => {
  transporter2.verify((error, success) => {
    if (error) {
      console.log(error)
    } else {
      console.log('Mail support server is running')
    }
  })
}

export default transporter
