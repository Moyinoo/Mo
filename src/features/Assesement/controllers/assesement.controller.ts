import { Request, Response } from 'express'
import { handleFormat, handlePath, handleResult } from '../../../utils/helpers'
import sendAssesementResultMail from '../../../mail/sendAssessmentResult'
import { Assesement } from '../models/assesement.model'
import { IAssesementDb } from '../interfaces/assesement.interface'
const data = [
  {
    parent: [
      {
        id: 'p1',
        question: 'What’s your first name',
        type: 'input',
        input_type: 'text',
        input_placeholder: 'First name',
        required: false,
        answer: 'David',
      },
      {
        id: 'p2',
        question:
          'How would you rate the sense of connection and the quality of communication with your children?',
        type: 'slider',
        required: true,
        score: 0,
      },
      {
        id: 'p3',
        question:
          'How accessible is knowledge and mentorship from other parents and experienced mentors?',
        type: 'slider',
        required: true,
        score: 0,
      },
      {
        id: 'p4',
        question:
          "How satisfied are you with your child's academic performance?",
        type: 'slider',
        required: true,
        score: 0,
      },
      {
        id: 'p5',
        question:
          "How will you rate your participation in your child's learning?",
        type: 'slider',
        required: true,
        score: 0,
      },
      {
        id: 'p6',
        question:
          "How well would you say you understand your child's learning style?",
        type: 'slider',
        required: true,
        score: 0,
      },
      {
        id: 'p7',
        question:
          "How would you rate the perfomance of child/children's school?",
        type: 'slider',
        required: true,
        score: 8,
      },
      {
        id: 'p8',
        question: 'What’s your email address',
        type: 'input',
        input_type: 'email',
        input_placeholder: 'Email address',
        answer: 'odavidbolaji14@gmail.com',
        required: false,
      },
    ],
    total: 13,
  },
  {
    teacher: [
      {
        id: 't1',
        question: 'What’s your first name',
        type: 'input',
        input_type: 'text',
        input_placeholder: 'First name',
        required: false,
        answer: '',
      },
      {
        id: 't2',
        question: 'How long have you been a teacher?',
        type: 'radio',
        options: ['1-5 years', '6-10 years', '11+ years'],
        required: false,
        answer: '6-10 years',
      },
      {
        id: 't3',
        question:
          'How would you rate your knowledge in designing learning experiences for children?',
        type: 'slider',
        required: true,
        score: 7,
      },
      {
        id: 't4',
        question:
          'How would you rate your ability to deliver knowledge in a way that is simple and understandable?',
        type: 'slider',
        required: true,
        score: 9,
      },
      {
        id: 't5',
        question:
          'How would you rate the performance of your school in providing an enabling environment for you to teach successfully?',
        type: 'slider',
        required: true,
        score: 8,
      },
      {
        id: 't6',
        question:
          'How would you rate the performance of parents in supporting the students learning?',
        type: 'slider',
        required: true,
        score: 0,
      },
      {
        id: 't7',
        question:
          'How accessible is knowledge and mentorship from other teachers and experienced mentors?',
        type: 'slider',
        required: true,
        score: 0,
      },
      {
        id: 't8',
        question:
          'Given the current realities, will most of your students like to become a teacher?',
        type: 'radio',
        options: ['Yes', 'No'],
        required: false,
        answer: 'No',
      },
      {
        id: 't9',
        question: 'What’s your email address',
        type: 'input',
        input_type: 'email',
        input_placeholder: 'Email address',
        required: false,
        answer: '',
      },
    ],
    total: 48,
  },
  {
    'school admin': [
      {
        id: 'sa1',
        question: 'What’s your first name',
        type: 'input',
        input_type: 'text',
        input_placeholder: 'First name',
        required: false,
        answer: '',
      },
      {
        id: 'sa2',
        question: 'How long have you been a school administrator?',
        type: 'slider',
        min: 0,
        max: 50,
        required: false,
        answer: 37,
      },
      {
        id: 'sa3',
        question:
          'How would you rate the academic performance of most of your students?',
        type: 'slider',
        required: true,
        score: 9,
      },
      {
        id: 'sa4',
        question:
          'How satisfied are you with the current level of teacher-parent collaboration in your school?',
        type: 'slider',
        required: true,
        score: 9,
      },
      {
        id: 'sa5',
        question:
          'How easily are you able to connect your staff with resources, courses, and mentors for professional development?',
        type: 'slider',
        required: true,
        score: 8,
      },
      {
        id: 'sa6',
        question: 'How satisfied are you with how much your school is known?',
        type: 'slider',
        required: true,
        score: 4,
      },
      {
        id: 'sa7',
        question:
          'To what extent are your students able to consider their teachers as life models?',
        type: 'slider',
        required: true,
        score: 7,
      },
      {
        id: 'sa8',
        question:
          'How satisfied are you with the contribution of parents to the academic development of their wards?',
        type: 'slider',
        required: true,
        score: 9,
      },
      {
        id: 'sa9',
        question: 'How easy or tidious is the process of hiring?',
        type: 'slider',
        required: true,
        score: 5,
      },
      {
        id: 'sa10',
        question: 'What’s your email address',
        type: 'input',
        input_type: 'email',
        input_placeholder: 'Email address',
        required: false,
        answer: '',
      },
    ],
    total: 73,
  },
]
export class AssesementController {
  async sendMail(req: Request, res: Response) {
    const formatBody = handleFormat(req.body)
    const result = (await Assesement.findOneByEmail(
      formatBody?.email,
    )) as unknown as IAssesementDb
    const path = Object.values(req.body).map((e: any) =>
      Object.keys(e).find(key => key !== 'total'),
    ) as unknown as string[]
    let taken = 1
    if (result !== null) {
      taken = result.taken + 1
      const mergePath = handlePath(result.path, taken, path)
      const mergeResult = handleResult(result.result, taken, req.body)
      await Assesement.updateOne(
        mergePath,
        mergeResult,
        taken,
        formatBody?.email,
      )
    } else {
      await Assesement.save({
        a_email: formatBody?.email,
        a_name: formatBody?.firstName!,
        taken,
        result: JSON.stringify([{ [taken]: req.body }]),
        path: JSON.stringify([{ [taken]: path }]),
      })
    }
    sendAssesementResultMail({
      email: formatBody?.email,
      firstName: formatBody?.firstName,
      data: req.body,
    })
    res.status(200).send({})
  }

  async renderMail(req: Request, res: Response) {
    res.render('index.ejs', {
      firstName: 'David',
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
  }
}
