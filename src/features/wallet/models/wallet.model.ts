import { RowDataPacket } from 'mysql2'
import { query } from '../../../db/con'
import { IWalletDb } from '../interfaces/wallet.interfaces'
import { NotificationModel } from '../../notification/models/notification.model'
import { ioh } from '../../..'
import { SchoolModel } from '../../school/models/school.model'

export class WalletModel {
  public static table = 'wallets'

  static async findbyId(id: number) {
    const sql = `SELECT * FROM ${WalletModel.table} WHERE wallet_sch = ?`
    try {
      const [result] = await query.execute(sql, [id])
      return result
    } catch (error: any) {
      console.error(error)
      throw new Error(error.message)
    }
  }
  static async get(id: number) {
    try {
      const result = (await this.findbyId(id)) as unknown as IWalletDb[]
      return result[0]
    } catch (error: any) {
      console.error(error)
      throw new Error(error.message)
    }
  }

  static async create(data: IWalletDb) {
    let sql2 = `INSERT INTO ${WalletModel.table}(`
    let val = `VALUES(`
    const updateList = Object.keys(data)
    const update = ['wallet_user', 'wallet_sch']
    const keys: any[] = []
    updateList.forEach((list: string, ind) => {
      if (update.includes(list)) {
        if (ind === updateList.length - 1) {
          sql2 += `${list}) `
          val += `?)`
        } else {
          sql2 += `${list}, `
          val += `?, `
        }
        keys.push((data as any)[list])
      }
    })

    sql2 += val
    console.error(sql2)
    console.log(keys)

    try {
      const [result] = await (query.execute(sql2, [...keys]) as Promise<
        RowDataPacket[]
      >)
      return { id: result.insertId }
    } catch (error: any) {
      console.log(error.message)
      throw new Error(error.message)
    }
  }

  static async update(data: IWalletDb) {
    let sql2 = `UPDATE ${WalletModel.table} SET `
    const updateList = Object.keys(data)
    const update = ['wallet_balance']
    const keys: any[] = []
    updateList.forEach((list: string, ind) => {
      if (update.includes(list)) {
        if (ind === updateList.length - 1) {
          sql2 += `${list} = ? `
        } else {
          sql2 += `${list} = ?, `
        }
        keys.push((data as any)[list])
      }
    })

    sql2 += `WHERE wallet_id = ?`
    sql2 = sql2.replace(/,\s*WHERE/, ' WHERE')
    console.error(sql2)
    console.log(keys)

    try {
      const [result] = await (query.execute(sql2, [
        ...keys,
        data.wallet_id,
      ]) as Promise<RowDataPacket[]>)

      return { id: result.insertId }
    } catch (error: any) {
      console.log(error.message)
      throw new Error(error.message)
    }
  }
  static async updateBySchId(data: IWalletDb) {
    try {
      let sch = await SchoolModel.findbySchId(+data.wallet_sch!)
      let wallet = (await this.findbyId(
        +data.wallet_sch!,
      )) as unknown as IWalletDb[]
      let sql2 = `UPDATE ${WalletModel.table} SET wallet_balance = ? WHERE wallet_sch = ?`
      const diff =
        +wallet[0].wallet_balance! - +data.wallet_balance! > 0
          ? +wallet[0].wallet_balance! - +data.wallet_balance!
          : 0
      const [result] = await (query.execute(sql2, [
        diff,
        data.wallet_sch,
      ]) as Promise<RowDataPacket[]>)
      const time = new Date()
      const msg = {
        notification_caption: 'Wallet Debit',
        notification_user: sch.sch_user,
        notification_msg:
          'Wallet has been debited of 1000 naira for hire as job deadline has passed',
        notification_status: 0,
        notification_created_at: time,
      }
      const id = await NotificationModel.create(msg)
      ioh.emit('Wallet Funded', {
        notification_id: id.id,
        ...msg,
      })

      return { id: result.insertId }
    } catch (error: any) {
      console.log(error.message)
      throw new Error(error.message)
    }
  }

  static async delete(id: number) {
    let sql2 = `DELETE FROM ${WalletModel.table} WHERE wallet_id = ?`
    try {
      const [result] = await (query.execute(sql2, [id]) as Promise<
        RowDataPacket[]
      >)
      return { id }
    } catch (error) {
      console.error(error)
    }
  }
}
