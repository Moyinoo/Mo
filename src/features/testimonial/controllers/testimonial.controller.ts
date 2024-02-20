import { Request, Response } from 'express'
import { TestimonialModel } from '../models/testimonial.model'

export class TestimonialController {
  async getTestimonial(req: Request, res: Response) {
    const { id } = req.params
    try {
      const user = await TestimonialModel.get(+id)
      res.status(200).send({ message: 'Fetch successfull', data: user })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: {} })
    }
  }

  async updateTestimonial(req: Request, res: Response) {
    try {
      const user = await TestimonialModel.update({ ...req.body })
      res.status(200).send({ message: 'Update Succesfull', data: user })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: {} })
    }
  }

  async createTestimonial(req: Request, res: Response) {
    try {
      const user = await TestimonialModel.create({ ...req.body })
      res
        .status(200)
        .send({ message: 'Testimonial added successfully', data: user.id })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: {} })
    }
  }

  async deleteTestimonial(req: Request, res: Response) {
    const { id } = req.params
    try {
      const user = await TestimonialModel.delete(+id)
      res.status(200).send({ message: 'Delete succesfull', data: user })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: {} })
    }
  }
}
