import { Request, Response } from 'express'
import { WalletModel } from '../models/wallet.model'
import { NotificationModel } from '../../notification/models/notification.model'
import { ioh } from '../../..'

export class WalletController {
  async getWallet(req: Request, res: Response) {
    const { id } = req.params
    try {
      const user = await WalletModel.get(+id)
      res.status(200).send({ message: 'Fetch successfull', data: user })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: {} })
    }
  }

  async updateWallet(req: Request, res: Response) {
    try {
      const prev = await WalletModel.get(req.body.wallet_sch)
      const wallet = await WalletModel.update({ ...req.body })
      const bal = prev.wallet_balance
        ? req.body.wallet_balance - prev.wallet_balance
        : req.body.wallet_balance

      console.log(prev.wallet_balance)
      console.log(req.body.wallet_balance)
      console.log(bal)
      const time = new Date()
      if (req.body.debit === true) {
        const msg = {
          notification_caption: 'Wallet Debit',
          notification_user: req.body.wallet_user,
          notification_msg: `Wallet has been debited of ${req.body.wallet_balance} naira on succesfull hire`,
          notification_status: 0,
          notification_created_at: time,
        }
        const id = await NotificationModel.create(msg)
        ioh.emit('Wallet Funded', {
          notification_id: id.id,
          ...msg,
        })
      } else {
        const msg = {
          notification_caption: 'Successfully Funded Wallet',
          notification_user: req.body.wallet_user,
          notification_msg: `You've successfully funded your wallet with ${bal} naira.🎉`,
          notification_created_at: time,
        }

        const id = await NotificationModel.create(msg)
        ioh.emit('Wallet Funded', {
          notification_id: id.id,
          ...msg,
        })
      }
      res.status(200).send({ message: 'Update Succesfull', data: wallet })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: {} })
    }
  }

  async createWallet(req: Request, res: Response) {
    try {
      const user = await WalletModel.create({ ...req.body })
      res
        .status(200)
        .send({ message: 'Wallet added successfully', data: user.id })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: {} })
    }
  }

  async deleteWallet(req: Request, res: Response) {
    const { id } = req.params
    try {
      const user = await WalletModel.delete(+id)
      res.status(200).send({ message: 'Delete succesfull', data: user })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: {} })
    }
  }
}
