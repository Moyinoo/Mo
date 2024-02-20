import express from 'express'
import { TransactionController } from '../controllers/transaction.controller'

const transactionRouter = express.Router()

transactionRouter.get(
  '/transaction/:id',
  TransactionController.prototype.getTransaction,
)
transactionRouter.get(
  '/transaction',
  TransactionController.prototype.getJobTransaction,
)
transactionRouter.get(
  '/transaction/all/sch',
  TransactionController.prototype.getSchTransaction,
)
transactionRouter.put(
  '/transaction/update',
  TransactionController.prototype.updateTransactionDeduction,
)
transactionRouter.post(
  '/transaction/create',
  TransactionController.prototype.createTransaction,
)
transactionRouter.delete(
  '/transaction/delete/:id',
  TransactionController.prototype.deleteTransaction,
)

export { transactionRouter }
