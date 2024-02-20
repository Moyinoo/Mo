import { Request, Response } from 'express'
import { ExperienceModel } from '../models/experience.model'

export class ExperienceController {
  async getExperience(req: Request, res: Response) {
    const { id } = req.params
    try {
      const user = await ExperienceModel.get(+id)
      res.status(200).send({ message: 'Fetch successfull', data: user })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: {} })
    }
  }

  async updateExperience(req: Request, res: Response) {
    try {
      const user = await ExperienceModel.update({ ...req.body })
      res.status(200).send({ message: 'Update Succesfull', data: user })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: {} })
    }
  }

  async createExperience(req: Request, res: Response) {
    try {
      const user = await ExperienceModel.create({ ...req.body })
      res
        .status(200)
        .send({ message: 'Experience added successfully', data: user.id })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: {} })
    }
  }

  async deleteExperience(req: Request, res: Response) {
    const { id } = req.params
    try {
      const user = await ExperienceModel.delete(+id)
      res.status(200).send({ message: 'Delete succesfull', data: user })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: {} })
    }
  }
}
