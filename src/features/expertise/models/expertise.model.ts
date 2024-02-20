import { RowDataPacket } from 'mysql2'
import { query } from '../../../db/con'
import { IXpertDb } from '../interfaces/expertise.interface'

export class ExpertiseModel {
  public static table = 'expertise'

  static async findbyId(id: number) {
    const sql = `SELECT * FROM ${ExpertiseModel.table} WHERE xpert_user = ?`
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
      const result = (await this.findbyId(id)) as unknown as IXpertDb[]
      return result
    } catch (error: any) {
      console.error(error)
      throw new Error(error.message)
    }
  }

  static async create(data: IXpertDb) {
    let sql2 = `INSERT INTO ${ExpertiseModel.table}(xpert_user, xpert_subject, xpert_class) VALUES(?, ?, ?)`
    try {
      const [result] = await (query.execute(sql2, [
        data.xpert_user,
        data.xpert_subject,
        JSON.stringify(data.xpert_class),
      ]) as Promise<RowDataPacket[]>)
      return { id: result.insertId }
    } catch (error: any) {
      console.log(error.message)
      throw new Error(error.message)
    }
  }

  static async update(data: IXpertDb) {
    let sql2 = `UPDATE ${ExpertiseModel.table} SET `
    const updateList = Object.keys(data)
    const update = ['xpert_subject', 'xpert_class']
    const keys: any[] = []
    updateList.forEach((list: string, ind) => {
      if (update.includes(list)) {
        if (list === 'xpert_class') {
          if (ind === updateList.length - 1) {
            sql2 += `${list} = ? `
          } else {
            sql2 += `${list} = ?, `
          }
          keys.push(JSON.stringify(data[list]))
        } else {
          if (ind === updateList.length - 1) {
            sql2 += `${list} = ? `
          } else {
            sql2 += `${list} = ?, `
          }
          keys.push((data as any)[list])
        }
      }
    })

    sql2 += `WHERE xpert_user = ? AND xpert_id = ?`

    console.log(sql2)
    console.log(data)
    try {
      const [result] = await (query.execute(sql2, [
        ...keys,
        data.xpert_user,
        data.xpert_id,
      ]) as Promise<RowDataPacket[]>)

      return { id: result.insertId }
    } catch (error: any) {
      console.log(error.message)
      throw new Error(error.message)
    }
  }

  static async delete(id: number) {
    let sql2 = `DELETE FROM ${ExpertiseModel.table} WHERE xpert_id = ?`
    try {
      const [result] = await (query.execute(sql2, [id]) as Promise<
        RowDataPacket[]
      >)
      console.log(result)
      return { id }
    } catch (error) {
      console.error(error)
    }
  }
}
