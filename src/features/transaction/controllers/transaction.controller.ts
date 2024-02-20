import { Request, Response } from 'express'
import { TransactionModel } from '../models/transaction.model'

export class TransactionController {
  async getTransaction(req: Request, res: Response) {
    const { id } = req.params
    try {
      const user = await TransactionModel.get(+id)
      res.status(200).send({ message: 'Fetch successfull', data: user })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: {} })
    }
  }

  async getJobTransaction(req: Request, res: Response) {
    const { transaction_job, transaction_sch } = req.query
    try {
      const sum = await TransactionModel.getJobT({
        transaction_job: Number(transaction_job),
        transaction_sch: Number(transaction_sch),
      })
      res.status(200).send({ message: 'Fetch successfull', data: sum })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: {} })
    }
  }

  async getSchTransaction(req: Request, res: Response) {
    const { transaction_sch } = req.query
    try {
      const sum = await TransactionModel.getSchT({
        transaction_sch: Number(transaction_sch),
      })
      res.status(200).send({ message: 'Fetch successfull', data: sum })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: {} })
    }
  }

  async updateTransaction(req: Request, res: Response) {
    try {
      const user = await TransactionModel.update({ ...req.body })
      res.status(200).send({ message: 'Update Succesfull', data: user })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: {} })
    }
  }
  async updateTransactionDeduction(req: Request, res: Response) {
    try {
      const user = await TransactionModel.updateDeduction({ ...req.body })
      res.status(200).send({ message: 'Update Succesfull', data: user })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: {} })
    }
  }

  async createTransaction(req: Request, res: Response) {
    try {
      const user = await TransactionModel.create({ ...req.body })
      res
        .status(200)
        .send({ message: 'Transaction added successfully', data: user.id })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: {} })
    }
  }

  async deleteTransaction(req: Request, res: Response) {
    const { id } = req.params
    try {
      const user = await TransactionModel.delete(+id)
      res.status(200).send({ message: 'Delete succesfull', data: user })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: {} })
    }
  }
}
