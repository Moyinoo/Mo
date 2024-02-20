import { RowDataPacket } from 'mysql2'
import { query } from '../../../db/con'
import { ITestimonialDb } from '../interfaces/testimonial.interface'

export class TestimonialModel {
  public static table = 'testimonial'

  static async findbyId(id: number) {
    const sql = `SELECT * FROM ${TestimonialModel.table} WHERE ts_user = ?`
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
      const result = (await this.findbyId(id)) as unknown as ITestimonialDb[]
      return result
    } catch (error: any) {
      console.error(error)
      throw new Error(error.message)
    }
  }

  static async create(data: ITestimonialDb) {
    let sql2 = `INSERT INTO ${TestimonialModel.table}(`
    let val = `VALUES(`
    const updateList = Object.keys(data)
    const update = [
      'ts_user',
      'ts_name',
      'ts_role_supervised',
      'ts_description',
      'ts_position',
      'ts_email',
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

  static async update(data: ITestimonialDb) {
    let sql2 = `UPDATE ${TestimonialModel.table} SET `
    const updateList = Object.keys(data)
    const update = [
      'ts_name',
      'ts_role_supervised',
      'ts_description',
      'ts_position',
      'ts_email',
    ]
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

    sql2 += `WHERE ts_user = ? AND ts_id = ?`
    console.error(sql2)
    console.log(keys)

    try {
      const [result] = await (query.execute(sql2, [
        ...keys,
        data.ts_user,
        data.ts_id,
      ]) as Promise<RowDataPacket[]>)

      return { id: result.insertId }
    } catch (error: any) {
      console.log(error.message)
      throw new Error(error.message)
    }
  }

  static async delete(id: number) {
    let sql2 = `DELETE FROM ${TestimonialModel.table} WHERE ts_id = ?`
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
