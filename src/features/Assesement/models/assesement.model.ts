import { query } from '../../../db/con'
import { DatabaseConnectionError } from '../../../errors/database-connection'
import { IAssesementDb } from '../interfaces/assesement.interface'

export class Assesement {
  public static table: string = 'assesement'
  static async save({ a_name, a_email, taken, path, result }: IAssesementDb) {
    let sql = `INSERT INTO ${Assesement.table}(a_name, a_email, taken, path, result)
            VALUES(?, ?, ?, ?, ?)`
    try {
      await query.execute({
        sql,
        values: [a_name, a_email, taken, path, result],
      })
    } catch (error) {
      console.log('error inserting into data', error)
      throw new DatabaseConnectionError()
    }
  }

  static async findAll() {
    let sql = `SELECT * FROM ${Assesement.table}`
    try {
      const result = await query.execute({ sql })
      return result
    } catch (error) {
      console.log('error fetching')
      throw new DatabaseConnectionError()
    }
  }

  static async findOneById(id: number): Promise<Assesement | null> {
    let sql = `SELECT * FROM ${Assesement.table} WHERE a_id = ?`
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
    let sql = `SELECT * FROM ${Assesement.table} WHERE a_email = ?`
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

  static async updateOne(
    path: string,
    result: string,
    taken: number,
    email: string,
  ) {
    let sql = `UPDATE ${Assesement.table} SET path = ?, result = ?, taken = ? WHERE a_email = ?`
    try {
      ;(await query.execute({
        sql,
        values: [path, result, taken, email],
      })) as unknown as any
      console.log('data updated')
    } catch (error) {
      console.log('error updating data', error)
      throw new DatabaseConnectionError()
    }
  }
}
