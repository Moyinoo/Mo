import { RowDataPacket } from 'mysql2'
import { query } from '../../../db/con'
import { ITransactionDb } from '../interfaces/transaction.interface'
import { NotificationModel } from '../../notification/models/notification.model'

export class TransactionModel {
  public static table = 'transactions'

  static async findbyId(id: number) {
    const sql = `SELECT * FROM ${TransactionModel.table} WHERE transaction_sch = ?`
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
      const result = (await this.findbyId(id)) as unknown as ITransactionDb[]
      return result
    } catch (error: any) {
      console.error(error)
      throw new Error(error.message)
    }
  }
  static async getJobT(data: {
    transaction_job: number
    transaction_sch: number
  }) {
    const sql = `SELECT SUM(transaction_amount) AS total_amount
    FROM ${TransactionModel.table}
    WHERE transaction_sch = ?
      AND transaction_job = ?
      AND transaction_deducted = 0;`
    try {
      const [result] = await query.execute(sql, [
        data.transaction_sch,
        data.transaction_job,
      ])
      return result
    } catch (error: any) {
      console.error(error)
      throw new Error(error.message)
    }
  }
  static async getSchT(data: { transaction_sch: number }) {
    console.log(data.transaction_sch)
    const sql = `SELECT SUM(transaction_amount) AS total_amount
    FROM ${TransactionModel.table}
    WHERE transaction_sch = ?
      AND transaction_deducted = 0`
    try {
      const [result] = await query.execute(sql, [data.transaction_sch])
      return result
    } catch (error: any) {
      console.error(error)
      throw new Error(error.message)
    }
  }

  static async create(data: ITransactionDb) {
    let sql2 = `INSERT INTO ${TransactionModel.table}(`
    let val = `VALUES(`
    const updateList = Object.keys(data)
    const update = [
      'transaction_user',
      'transaction_sch',
      'transaction_job',
      'transaction_amount',
    ]
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

  static async update(data: ITransactionDb) {
    let sql2 = `UPDATE ${TransactionModel.table} SET `
    const updateList = Object.keys(data)
    const update = ['transaction_balance']
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

    sql2 += `WHERE transaction_id = ?`
    console.error(sql2)
    console.log(keys)

    try {
      const [result] = await (query.execute(sql2, [
        ...keys,
        data.transaction_id,
      ]) as Promise<RowDataPacket[]>)

      return { id: result.insertId }
    } catch (error: any) {
      console.log(error.message)
      throw new Error(error.message)
    }
  }
  static async updateDeduction(data: ITransactionDb) {
    let sql2 = `UPDATE ${TransactionModel.table} SET transaction_deducted = ?, transaction_updated_at = ? WHERE transaction_user = ? AND transaction_job = ? AND transaction_sch = ?`

    console.error(sql2)
    try {
      const [result] = await (query.execute(sql2, [
        1,
        new Date(),
        data.transaction_user,
        data.transaction_job,
        data.transaction_sch,
      ]) as Promise<RowDataPacket[]>)

      return { id: result.insertId }
    } catch (error: any) {
      console.log(error.message)
      throw new Error(error.message)
    }
  }

  static async delete(id: number) {
    let sql2 = `DELETE FROM ${TransactionModel.table} WHERE transaction_id = ?`
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
