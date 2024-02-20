import { Request, Response } from 'express'
import { SchoolModel } from '../models/school.model'
import { getPostedMatch } from '../../../utils/helpers'
import { ISchDb } from '../interfaces/school.interface'

export class SchoolController {
  async search(req: Request, res: Response) {
    console.log(req.query.name)
    const name: string = req.query.name as string
    try {
      const schools = await SchoolModel.search({ name })
      res.status(200).send({
        message: 'Fetch successfull',
        data: schools ? schools : [],
      })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: [] })
    }
  }
  async getSchool(req: Request, res: Response) {
    const { id } = req.params
    try {
      const user = await SchoolModel.get(+id)
      res.status(200).send({ message: 'Fetch successfull', data: user })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: {} })
    }
  }
  async getAllSchool(req: Request, res: Response) {
    try {
      const user = await SchoolModel.getAll()
      res.status(200).send({ message: 'Fetch successfull', data: user })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: [] })
    }
  }

  async updateSchool(req: Request, res: Response) {
    try {
      const user = await SchoolModel.update({ ...req.body })
      res.status(200).send({ message: 'Update Succesfull', data: user })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: {} })
    }
  }

  public async filterSchool(req: Request, res: Response) {
    const { start, end, city, lga, st, posted, pending_post } = req.body

    try {
      const result = await SchoolModel.filterSchool(
        start,
        end,
        city,
        lga,
        st,
        pending_post,
      )

      if (posted) {
        console.log('entered')
        const postedMatch = await getPostedMatch(result as unknown as ISchDb[])
        return res.status(200).send({
          message: 'fetch succesfull',
          status: true,
          data: postedMatch,
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

  async verifySchool(req: Request, res: Response) {
    const { sch_verified, sch_id } = req.body
    console.log(sch_verified, sch_id)
    try {
      const user = await SchoolModel.verify(+sch_verified, +sch_id)
      res.status(200).send({ message: 'Update Succesfull', data: user })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: {} })
    }
  }

  async createSchool(req: Request, res: Response) {
    try {
      const user = await SchoolModel.create({ ...req.body })
      res
        .status(200)
        .send({ message: 'School added successfully', data: user.id })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: {} })
    }
  }

  async deleteSchool(req: Request, res: Response) {
    const { id } = req.params
    try {
      const user = await SchoolModel.delete(+id)
      res.status(200).send({ message: 'Delete succesfull', data: user })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: {} })
    }
  }
}
