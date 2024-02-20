import dotenv from 'dotenv'
dotenv.config()
import cors from 'cors'
import express, { Express, Request, Response } from 'express'
import 'express-async-errors'
import morgan from 'morgan'
import hpp from 'hpp'
import compression from 'compression'
import { errorHandler } from './middlewares/error-handlers'
import path from 'path'
import { assesementRouter } from './features/Assesement/routes/routes'
import { establishDatabaseConnection } from './db/con'
import { waitingRouter } from './features/waiting/routes/waiting.routes'
import { chatRouter } from './features/chat/routes/chat.routes'
import { startMailServer, startMailServer2 } from './mail/transporter'
import { userRouter } from './features/users/routes/user.routes'
import { locationRouter } from './features/location/routes/location.routes'
import http from 'http'
import { Server } from 'socket.io'
import { educationRouter } from './features/education/routes/education.routes'
import { experienceRouter } from './features/experience/routes/education.routes'
import { expertiseRouter } from './features/expertise/routes/expertise.routes'
import { skilzRouter } from './features/skilz/routes/skilz.routes'
import { certificationRouter } from './features/certification/routes/certiffication.routes'
import { testimonialRouter } from './features/testimonial/routes/testimonial.routes'
import { schoolRouter } from './features/school/routes/school.routes'
import { jobRouter } from './features/jobs/routes/job.routes'
import { appliedRouter } from './features/applied/routes/applied.routes'
import { matchedRouter } from './features/matched/routes/matched.routes'
import { selectedRouter } from './features/selected/routes/selected.routes'
import { notificationRouter } from './features/notification/routes/notification.routes'
import { walletRouter } from './features/wallet/routes/wallet.routes'
import { transactionRouter } from './features/transaction/routes/transaction.route'
import fs from 'fs'
import limiter from './middlewares/limiter'
import { sendValMail } from './utils/helpers'
import { blogRouter } from './features/blogs/routes/blog.routes'
import { commentRouter } from './features/comments/routes/comment.routes'
// import sendAssesementResultMail from './mail/sendAssessmentResult'

const PATH = '/api/v1'
const PATH2 = '/api/v1/pic'
const app: Express = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:5173',
      'https://tayture.com',
      'https://staging.tayture.com',
      'https://8d3e-105-112-31-18.ngrok-free.app',
    ],
    credentials: true,
  },
})
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://tayture.com',
      'https://staging.tayture.com',
      'https://8d3e-105-112-31-18.ngrok-free.app',
    ],
  }),
)

app.use(express.static('views'))
app.use(express.json())
establishDatabaseConnection()
startMailServer()
startMailServer2()
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(hpp())
app.use(limiter)
app.use(compression())
app.use(morgan(':method :url :status :response-time ms'))
app.get(PATH, (req: Request, res: Response) => {
  res.send({ message: 'Server is running' })
})
app.post(`${PATH}/resendmail`, async (req: Request, res: Response) => {
  try {
    await sendValMail(req.body.email, req.body.fname, req.body.token)
    res.status(200).send({ message: 'Mail sent' })
  } catch (error: any) {
    console.log(error.message)
    throw new Error(error.message)
  }
})
// app.post(`${PATH}/resendassesement`, async (req: Request, res: Response) => {
//   try {
//     sendAssesementResultMail({
//       email: 'classclimax@gmail.com',
//       firstName: 'Omolara',
//       //@ts-ignore
//       data: [
//         {
//           //@ts-ignore
//           'school admin': [
//             {
//               id: 'sa1',
//               question: 'What’s your first name',
//               type: 'input',
//               input_type: 'text',
//               input_placeholder: 'First name',
//               required: false,
//               answer: 'Omolara',
//             },
//             {
//               id: 'sa2',
//               question: 'How long have you been a school administrator?',
//               type: 'slider',
//               min: 0,
//               max: 50,
//               required: false,
//               answer: 50,
//             },
//             {
//               id: 'sa3',
//               question:
//                 'How would you rate the academic performance of most of your students?',
//               type: 'slider',
//               required: true,
//               score: 7,
//             },
//             {
//               id: 'sa4',
//               question:
//                 'How satisfied are you with the current level of teacher-parent collaboration in your school?',
//               type: 'slider',
//               required: true,
//               score: 6,
//             },
//             {
//               id: 'sa5',
//               question:
//                 'How easily are you able to connect your staff with resources, courses, and mentors for professional development?',
//               type: 'slider',
//               required: true,
//               score: 8,
//             },
//             {
//               id: 'sa6',
//               question:
//                 'How satisfied are you with how well your school is known?',
//               type: 'slider',
//               required: true,
//               score: 8,
//             },
//             {
//               id: 'sa7',
//               question:
//                 'To what extent are your students able to consider their teachers as life models?',
//               type: 'slider',
//               required: true,
//               score: 6,
//             },
//             {
//               id: 'sa8',
//               question:
//                 'How satisfied are you with the contribution of parents to the academic development of their wards?',
//               type: 'slider',
//               required: true,
//               score: 4,
//             },
//             {
//               id: 'sa9',
//               question:
//                 'How would you rate the ease of hiring new staff into your school?',
//               type: 'slider',
//               required: true,
//               score: 2,
//             },
//             {
//               id: 'sa10',
//               question: 'What’s your email address',
//               type: 'input',
//               input_type: 'email',
//               input_placeholder: 'Email address',
//               required: false,
//               answer: 'classclimax@gmail.com',
//             },
//           ],
//           total: 59,
//         },
//       ],
//     })
//     res.status(200).send({ message: 'Mail sent' })
//   } catch (error: any) {
//     console.log(error.message)
//     throw new Error(error.message)
//   }
// })

app.get(PATH2, (req: Request, res: Response) => {
  const templatePath = path.join(__dirname, '../html/dav.html')
  console.log(templatePath)
  fs.access(templatePath, fs.constants.R_OK, err => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' })
      res.end('HTML file not found.')
    } else {
      // Read the HTML file and send it as a response
      fs.readFile(templatePath, 'utf8', (error, data) => {
        if (error) {
          res.writeHead(500, { 'Content-Type': 'text/plain' })
          res.end('Error reading the HTML file.')
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html' })
          res.end(data)
        }
      })
    }
  })
})

app.use(PATH, assesementRouter)
app.use(PATH, waitingRouter)
app.use(PATH, chatRouter)
app.use(PATH, userRouter)
app.use(PATH, locationRouter)
app.use(PATH, educationRouter)
app.use(PATH, experienceRouter)
app.use(PATH, expertiseRouter)
app.use(PATH, skilzRouter)
app.use(PATH, certificationRouter)
app.use(PATH, testimonialRouter)
app.use(PATH, schoolRouter)
app.use(PATH, jobRouter)
app.use(PATH, appliedRouter)
app.use(PATH, matchedRouter)
app.use(PATH, selectedRouter)
app.use(PATH, notificationRouter)
app.use(PATH, walletRouter)
app.use(PATH, transactionRouter)
app.use(PATH, blogRouter)
app.use(PATH, commentRouter)

app.use(errorHandler)

export { server, io }
