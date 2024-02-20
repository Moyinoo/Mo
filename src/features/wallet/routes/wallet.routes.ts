import express from 'express'
import { WalletController } from '../controllers/wallet.controller'

const walletRouter = express.Router()

walletRouter.get('/wallet/:id', WalletController.prototype.getWallet)
walletRouter.put('/wallet/update', WalletController.prototype.updateWallet)
walletRouter.post('/wallet/create', WalletController.prototype.createWallet)
walletRouter.delete(
  '/wallet/delete/:id',
  WalletController.prototype.deleteWallet,
)

export { walletRouter }
