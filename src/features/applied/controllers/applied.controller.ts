import { Request, Response } from 'express'
import { AppliedModel } from '../models/applied.model'
import { UserModel } from '../../users/models/user.models'

export class AppliedController {
  async getAppliedUser(req: Request, res: Response) {
    const { id } = req.params
    try {
      const user = await AppliedModel.getAppliedUser(+id)
      res.status(200).send({ message: 'Fetch successfull', data: user })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: {} })
    }
  }
  async getAppliedSchool(req: Request, res: Response) {
    const { id } = req.params
    try {
      const school = await AppliedModel.getAppliedSchool(+id)
      res.status(200).send({ message: 'Fetch successfull', data: school })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: {} })
    }
  }
  async getAppliedJob(req: Request, res: Response) {
    const { id } = req.params
    try {
      const job = await AppliedModel.getAppliedJob(+id)
      res.status(200).send({ message: 'Fetch successfull', data: job })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: {} })
    }
  }

  async createApplied(req: Request, res: Response) {
    const { ap_user, ap_sch, ap_job_id, ap_sample_answer, applied, cv, cover } =
      req.body
    try {
      const user = await AppliedModel.create({
        ap_user,
        ap_sch,
        ap_job_id,
        ap_sample_answer,
      })
      await UserModel.updateUser({
        id: ap_user,
        applied,
        cv,
        cover,
      } as unknown as any)
      res
        .status(200)
        .send({
          message:
            'Great! Your application was received. Watch out for updates',
          data: user.id,
        })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: {} })
    }
  }

  async deleteApplied(req: Request, res: Response) {
    const { id } = req.params
    try {
      const user = await AppliedModel.delete(+id)
      res.status(200).send({ message: 'Delete succesfull', data: user })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: {} })
    }
  }
}
