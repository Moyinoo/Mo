import { query } from '../../../db/con'
import { DatabaseConnectionError } from '../../../errors/database-connection'
import { IWaitingDb } from '../interfaces/waiting.interface'

export class Waiting {
  public static table: string = 'waiting'
  static async save({ name, email }: IWaitingDb) {
    let sql = `INSERT INTO ${Waiting.table}(name, email)
            VALUES(?, ?)`
    try {
      await query.execute({ sql, values: [name, email] })
    } catch (error) {
      console.log('error inserting into data', error)
      throw new DatabaseConnectionError()
    }
  }

  static async findAll() {
    let sql = `SELECT * FROM ${Waiting.table}`
    try {
      const result = await query.execute({ sql })
      return result
    } catch (error) {
      console.log('error fetching')
      throw new DatabaseConnectionError()
    }
  }

  static async findOneById(id: number): Promise<Waiting | null> {
    let sql = `SELECT * FROM ${Waiting.table} WHERE a_id = ?`
    try {
      const [rows] = (await query.execute({
        sql,
        values: [id],
      })) as unknown as any
      if (rows.length === 0) {
        return null
      }
      const assessmentData = rows[0] // Assuming a_id is unique
      return assessmentData
    } catch (error) {
      console.log('error fetching single data by id')
      throw new DatabaseConnectionError()
    }
  }

  static async findOneByEmail(email: string) {
    let sql = `SELECT * FROM ${Waiting.table} WHERE a_email = ?`
    try {
      const [result] = (await query.execute({
        sql,
        values: [email],
      })) as unknown as any
      if (result.length === 0) {
        return null
      }
      const assessmentData = result[0]
      return assessmentData
    } catch (error) {
      console.log('error fetching data by email', error)
      throw new DatabaseConnectionError()
    }
  }
}
