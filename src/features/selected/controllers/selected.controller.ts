import { Request, Response } from 'express'
import { SelectedModel } from '../models/selected.model'
import { UserModel } from '../../users/models/user.models'
import { AppliedModel } from '../../applied/models/applied.model'
import { JobModel } from '../../jobs/models/job.model'

export class SelectedController {
  async getSchoolSelected(req: Request, res: Response) {
    const { sel_sch_id, sel_job_id } = req.body
    try {
      const user = await SelectedModel.get(+sel_sch_id, +sel_job_id)
      const selected = await AppliedModel.findByUserIdSelected(user)
      res
        .status(200)
        .send({ message: 'Selected added successfully', data: selected })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: {} })
    }
  }
  async getUserSelected(req: Request, res: Response) {
    const { id } = req.params
    try {
      const user = await SelectedModel.getInvited(+id)
      const selected = await JobModel.findSelectedJob(user)
      res
        .status(200)
        .send({ message: 'Selected added successfully', data: selected })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: {} })
    }
  }

  async updateSelected(req: Request, res: Response) {
    try {
      const user = await SelectedModel.update({ ...req.body })
      res.status(200).send({ message: 'Update Succesfull', data: user })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: {} })
    }
  }

  async updateSelectedHiredStatus(req: Request, res: Response) {
    try {
      const user = await SelectedModel.updateHiredStatus({ ...req.body })
      res.status(200).send({ message: 'Update Succesfull', data: user })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: {} })
    }
  }
  async updateSelectedHiredStatusUser(req: Request, res: Response) {
    try {
      const user = await SelectedModel.updateHiredStatusUser({ ...req.body })
      res.status(200).send({ message: 'Update Succesfull', data: user })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: {} })
    }
  }

  async createSelected(req: Request, res: Response) {
    const { sel_sch_id, sel_job_id, sel_user_id } = req.body

    try {
      const user = await SelectedModel.create({
        sel_sch_id,
        sel_job_id,
        sel_user_id,
      })

      res
        .status(200)
        .send({
          message: 'Hurray!!!🚀, Teacher has been added to selected tab',
          data: {},
        })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: {} })
    }
  }
}
