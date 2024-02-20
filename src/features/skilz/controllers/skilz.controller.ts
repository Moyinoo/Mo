import { Request, Response } from 'express'
import { SkilzModel } from '../models/skilz.model'

export class SkilzController {
  async getSkilz(req: Request, res: Response) {
    const { id } = req.params
    try {
      const user = await SkilzModel.get(+id)
      res.status(200).send({
        message: 'Fetch successfull',
        data: typeof user === 'undefined' ? { skills: [] } : user,
      })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: {} })
    }
  }

  async updateSkilz(req: Request, res: Response) {
    try {
      const user = await SkilzModel.update({ ...req.body })
      res.status(200).send({ message: 'Update Succesfull', data: user })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: {} })
    }
  }

  async createSkilz(req: Request, res: Response) {
    try {
      const user = await SkilzModel.create({ ...req.body })
      res
        .status(200)
        .send({ message: 'Skills added successfully', data: user.id })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: {} })
    }
  }

  //   async deleteSkilz(req: Request, res: Response) {
  //     const { id } = req.params
  //     try {
  //       const user = await SkilzModel.delete(+id)
  //       res.status(200).send({ message: 'Delete succesfull', data: user })
  //     } catch (error: any) {
  //       console.log(error)
  //       res.status(400).send({ message: error.message, data: {} })
  //     }
  //   }
}
