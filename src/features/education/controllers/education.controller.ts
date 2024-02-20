import { Request, Response } from 'express'
import { EducationModel } from '../models/education.model'

export class EducationController {
  async getEducation(req: Request, res: Response) {
    const { id } = req.params
    try {
      const user = await EducationModel.get(+id)
      res.status(200).send({ message: 'Fetch successfull', data: user })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: {} })
    }
  }

  async updateEducation(req: Request, res: Response) {
    try {
      const user = await EducationModel.update({ ...req.body })
      res.status(200).send({ message: 'Update Succesfull', data: user })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: {} })
    }
  }

  async createEducation(req: Request, res: Response) {
    try {
      const user = await EducationModel.create({ ...req.body })
      res
        .status(200)
        .send({ message: 'Education added successfully', data: user.id })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: {} })
    }
  }

  async deleteEducation(req: Request, res: Response) {
    const { id } = req.params
    try {
      const user = await EducationModel.delete(+id)
      res.status(200).send({ message: 'Delete succesfull', data: user })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: {} })
    }
  }
}
