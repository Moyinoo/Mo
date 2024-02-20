import { Request, Response } from 'express'
import { UserModel } from '../models/user.models'
import { IUserDb } from '../interfaces/user.interface'
import sendValidationMail from '../../../mail/sendValidationMail'
import console from '../../../utils/logger'
import axios from 'axios'
import sendWelcomeMail from '../../../mail/sendWelcomeMail'
import { getProfileMatch } from '../../../utils/helpers'
import sendUserRegisteredMail from '../../../mail/sendUserRegisteredMail'
import { AppliedModel } from '../../applied/models/applied.model'
import sendPasswordMail from '../../../mail/sendPasswordMail'

export class UserController {
  public async login(req: Request, res: Response) {
    const { email, password, type } = req.body
    try {
      if (type === 'manual') {
        const user = await UserModel.signin(email, password)
        res.status(200).send({ message: 'Succesful sign in', data: user })
      } else {
        const user = await UserModel.signinGoogle(email, password)
        res.status(200).send({ message: 'Succesful sign in', data: user })
      }
    } catch (error: any) {
      res.status(400).send({ message: error.message, data: {} })
    }
  }

  public async verify(req: Request, res: Response) {
    const validationToken = req.params.token
    try {
      const user = await UserModel.signInByValidationToken(validationToken)
      res.status(200).send({ message: 'Succesful sign in', data: user })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: {} })
    }
  }
  public async getUser(req: Request, res: Response) {
    const id = req.query.user
    const header = req.headers['authorization']
    const token = header!.replace('Bearer ', '')
    console.log(token)

    try {
      const user = await UserModel.getUser(+id!)
      res
        .status(200)
        .send({ message: 'Fetch successfull', data: { ...user, token } })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: {} })
    }
  }

  public async verifyNumber(req: Request, res: Response) {
    const { phone } = req.body
    console.log(phone.replace('+', ''))
    try {
      const result = await axios.post(
        'https://api.ng.termii.com/api/sms/otp/send',
        {
          api_key:
            'TLiWvkZknZAmLu9Gb9s6xQwg8NoQqJNkCmZ9DJdif2MHcvBZktWbFbMpfdaXRK',
          message_type: 'NUMERIC',
          to: phone.replace('+', ''),
          from: 'Tayture',
          channel: 'generic',
          pin_attempts: 3,
          pin_time_to_live: 10,
          pin_length: 6,
          pin_placeholder: '< 1234 >',
          message_text: 'Your one time password is < 1234 >',
          pin_type: 'NUMERIC',
        },
      )
      console.log('sms sent succesfully')
      console.log(result)
      res.status(200).send({
        message: 'SMS sent succesfully',
        data: { pinId: result.data.pinId },
      })
    } catch (error: any) {
      console.log('error: ', error)
      res.status(400).send({ message: error.message, data: {} })
    }
  }
  public async verifyOTP(req: Request, res: Response) {
    const { otp, pinId, phone, user_id } = req.body
    try {
      const result = await axios.post(
        'https://api.ng.termii.com/api/sms/otp/verify',
        {
          api_key:
            'TLiWvkZknZAmLu9Gb9s6xQwg8NoQqJNkCmZ9DJdif2MHcvBZktWbFbMpfdaXRK',
          pin_id: pinId,
          pin: otp,
        },
      )
      if (result.data.verified) {
        const user = await UserModel.verifyOTP(user_id, phone)
        res.status(200).send({ message: 'Phone number verified', data: user })
      } else {
        throw new Error('Incorrect code, please try again')
      }
    } catch (error: any) {
      console.log(error.message)
      res.status(400).send({ message: error.message, data: {} })
    }
  }

  public async register(req: Request, res: Response) {
    const {
      fname,
      lname,
      email,
      password,
      type,
      picture,
      school_name,
      phone,
    }: IUserDb = req.body
    try {
      if (type === 'manual') {
        const user = await UserModel.signup({
          fname,
          lname,
          email,
          password,
          type,
          school_name,
          phone,
        })

        sendValidationMail({
          email,
          firstName: fname,
          link: `tayture.com/verify/${user.validation_token}`,
        })

        res.status(200).send({ message: 'signup successful', data: user })
      } else {
        const user = await UserModel.signupGoogle({
          fname,
          lname,
          email,
          type,
          picture,
          school_name,
        })
        res.status(200).send({ message: 'signup successful', data: user })
      }
      sendUserRegisteredMail({
        name: fname,
      })
    } catch (error: any) {
      console.error(error)
      return res.status(400).send({ message: error.message, data: {} })
    }
  }

  public async apply(req: Request, res: Response) {
    const {
      fname,
      lname,
      email,
      password,
      type,
      cv,
      cover,
      ap_sch,
      ap_job_id,
      ap_sample_answer,
      picture,
      applied,
      school_name,
    } = req.body
    try {
      const user = await UserModel.signupLanding({
        fname,
        lname,
        email,
        password,
        type,
        cover,
        cv,
        applied,
      })

      if (!user.updated) {
        await AppliedModel.create({
          ap_user: user.id,
          ap_sch,
          ap_job_id,
          ap_sample_answer,
        })
        await UserModel.updateUser({
          id: user.id,
          applied,
        } as unknown as any)

        sendValidationMail({
          email,
          firstName: fname,
          link: `tayture.com/verify/${user.validation_token}`,
        })

        sendPasswordMail({
          email,
          firstName: fname,
          password,
        })
        sendUserRegisteredMail({
          name: fname,
        })
        return res
          .status(200)
          .send({ message: 'Application successful', data: user })
      }

      res.status(200).send({ message: 'Application successful', data: user })
    } catch (error: any) {
      console.error(error)
      return res.status(400).send({ message: error.message, data: {} })
    }
  }

  public async update(req: Request, res: Response) {
    try {
      const user = await UserModel.updateUser({ ...req.body })
      res.status(200).send({ message: 'User updated succesfully', data: user })
    } catch (error: any) {
      res.status(400).send({ message: error.message, data: {} })
    }
  }

  public async signout(req: Request, res: Response) {
    console.log('got to signout controller')
    res.status(200).send({ message: 'signout successful', data: {} })
  }

  public async sendWelcome(req: Request, res: Response) {
    try {
      await UserModel.updateFirstTime(req.body.email)
      sendWelcomeMail({
        email: req.body.email,
        firstName: req.body.fname,
      })
      res.status(200).send({ message: 'Welcome mail sent succesfully' })
    } catch (error: any) {
      res.status(400).send({ message: error.message, data: {} })
    }

    res.status(200).send({ message: 'signout successful', data: {} })
  }

  public async getAll(req: Request, res: Response) {
    try {
      const result = (await UserModel.findAll()) as unknown as IUserDb[]
      res
        .status(200)
        .send({ message: 'fetch succesfull', status: true, data: result })
    } catch (error) {
      res
        .status(500)
        .send({ message: 'An error occurred', status: false, error })
    }
  }

  public async filterUser(req: Request, res: Response) {
    const { start, end, city, lga, st, path, profile } = req.body

    try {
      const result = await UserModel.filterUser(start, end, city, lga, st, path)

      if (profile >= 10) {
        const profileMatch = await getProfileMatch(result, profile)
        return res.status(200).send({
          message: 'fetch succesfull',
          status: true,
          data: profileMatch,
        })
      }
      res
        .status(200)
        .send({ message: 'fetch succesfull', status: true, data: result })
    } catch (error) {
      res
        .status(500)
        .send({ message: 'An error occurred', status: false, error })
    }
  }

  public async deleteOne(req: Request, res: Response) {
    const batchId = req.params.batch_id
    try {
      await UserModel.deleteOneById(+batchId)
      res.status(200).send({ message: 'delete succesfull', status: true })
    } catch (error) {
      res
        .status(500)
        .send({ message: 'An error occurred', status: false, error })
    }
  }

  public async blogLike(req: Request, res: Response) {
    const { blog_id, id, process } = req.body
    try {
      const user = await UserModel.addUserBlogLikes(id, blog_id, process)
      res.status(200).send({ message: 'Blog id added succesfully', data: user })
    } catch (error: any) {
      res.status(400).send({ message: error.message, data: {} })
    }
  }

  public async blogComment(req: Request, res: Response) {
    const { blog_id, id } = req.body
    try {
      const user = await UserModel.addUserBlogComments(id, blog_id)
      res
        .status(200)
        .send({ message: 'Blog comment added succesfully', data: user })
    } catch (error: any) {
      res.status(400).send({ message: error.message, data: {} })
    }
  }

  public async commentLike(req: Request, res: Response) {
    const { comment_id, id, process } = req.body
    try {
      const user = await UserModel.addUserCommentLikes(id, comment_id, process)
      res
        .status(200)
        .send({ message: 'Comment comment added succesfully', data: user })
    } catch (error: any) {
      res.status(400).send({ message: error.message, data: {} })
    }
  }

  public async commentComment(req: Request, res: Response) {
    const { comment_id, id } = req.body
    try {
      const user = await UserModel.addUserBlogComments(id, comment_id)
      res
        .status(200)
        .send({ message: 'Comment comment added succesfully', data: user })
    } catch (error: any) {
      res.status(400).send({ message: error.message, data: {} })
    }
  }
}
