import { RowDataPacket } from 'mysql2'
import { query } from '../../../db/con'
import { ISkilzDb } from '../interfaces/skilz.interface'

export class SkilzModel {
  public static table = 'skilz'

  static async findbyId(id: number) {
    const sql = `SELECT * FROM ${SkilzModel.table} WHERE skilz_user = ?`
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
      const result = (await this.findbyId(id)) as unknown as ISkilzDb[]
      console.log(result[0])
      return result[0]
    } catch (error: any) {
      console.error(error)
      throw new Error(error.message)
    }
  }

  static async create(data: ISkilzDb) {
    let sql2 = `INSERT INTO ${SkilzModel.table}(skilz_user, skills) VALUES(?, ?)`
    try {
      const [result] = await (query.execute(sql2, [
        data.skilz_user,
        JSON.stringify(data.skilz),
      ]) as Promise<RowDataPacket[]>)
      return { id: result.insertId }
    } catch (error: any) {
      console.log(error.message)
      throw new Error(error.message)
    }
  }

  static async update(data: ISkilzDb) {
    let sql2 = `UPDATE ${SkilzModel.table} SET skills = ? WHERE skilz_user = ?`
    console.log(data.skilz.length)
    if (data.skilz.length === 0) {
      try {
        const deleted = await this.delete(data.skilz_user)
        return { id: deleted!.id }
      } catch (error: any) {
        console.log(error.message)
        throw new Error(error.message)
      }
    } else {
      try {
        const [result] = await (query.execute(sql2, [
          JSON.stringify(data.skilz),
          data.skilz_user,
        ]) as Promise<RowDataPacket[]>)

        return { id: result.insertId }
      } catch (error: any) {
        console.log(error.message)
        throw new Error(error.message)
      }
    }
  }

  static async delete(id: number) {
    let sql2 = `DELETE FROM ${SkilzModel.table} WHERE skilz_user = ?`
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
