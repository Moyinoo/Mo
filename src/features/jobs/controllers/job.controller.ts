import { Request, Response } from 'express'
import { JobModel } from '../models/job.model'
import { AppliedModel } from '../../applied/models/applied.model'
import {
  IJobUserMatch,
  getMatchedCountAndusers,
  getMatchedJobsusers,
  getSelectedCount,
} from '../../../utils/helpers'

export class JobController {
  async getJob(req: Request, res: Response) {
    const { id } = req.params
    console.log(id)
    try {
      const job = await JobModel.get(+id)
      // console.log(job)
      const applied = await AppliedModel.findbySchoolId(+id)

      const nJob = getMatchedCountAndusers(job, applied)

      const addSelected = await getSelectedCount(nJob)
      res
        .status(200)
        .send({ message: 'Fetch successfull', data: { job: addSelected } })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: {} })
    }
  }

  async getActiveJob(req: Request, res: Response) {
    console.log('here')
    try {
      const user = await JobModel.getActive()
      res.status(200).send({ message: 'Fetch successfull', data: user })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: [] })
    }
  }

  async searchJob(req: Request, res: Response) {
    const title: string = req.query.title as string
    const sch_id: number = Number(req.query.sch)
    try {
      const jobs = await JobModel.getByJobTitle({ title, sch_id })
      res
        .status(200)
        .send({ message: 'Fetch successfull', data: jobs ? jobs : [] })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: [] })
    }
  }

  async getActiveMatchJob(req: Request, res: Response) {
    const { id } = req.params
    try {
      const user = await JobModel.getActiveMatchJob(+id)
      const data = getMatchedJobsusers(user as unknown as IJobUserMatch)

      res.status(200).send({ message: 'Fetch successfull', data: data })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: [] })
    }
  }

  async updateJob(req: Request, res: Response) {
    try {
      const user = await JobModel.update({ ...req.body })
      res.status(200).send({ message: 'Update Succesfull', data: user })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: {} })
    }
  }

  async createJob(req: Request, res: Response) {
    try {
      const user = await JobModel.create({ ...req.body })
      res.status(200).send({ message: 'Job added successfully', data: user.id })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: {} })
    }
  }

  async deleteJob(req: Request, res: Response) {
    const { id } = req.params
    try {
      const user = await JobModel.delete(+id)
      res.status(200).send({ message: 'Delete succesfull', data: user })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: {} })
    }
  }
}
