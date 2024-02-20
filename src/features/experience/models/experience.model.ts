import { RowDataPacket } from 'mysql2'
import { query } from '../../../db/con'
import { IExpDb } from '../interfaces/experience.interface'

export class ExperienceModel {
  public static table = 'experience'

  static async findbyId(id: number) {
    const sql = `SELECT * FROM ${ExperienceModel.table} WHERE exp_user = ?`
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
      const result = (await this.findbyId(id)) as unknown as IExpDb[]
      return result
    } catch (error: any) {
      console.error(error)
      throw new Error(error.message)
    }
  }

  static async create(data: IExpDb) {
    let sql2 = `INSERT INTO ${ExperienceModel.table}(`
    let val = `VALUES(`
    const updateList = Object.keys(data)
    const update = [
      'exp_user',
      'exp_title',
      'exp_company',
      'exp_state',
      'exp_city',
      'exp_lga',
      'exp_responsibilities',
      'exp_startMonth',
      'exp_startYear',
      'exp_endMonth',
      'exp_endYear',
      'exp_endDate',
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

  static async update(data: IExpDb) {
    let sql2 = `UPDATE ${ExperienceModel.table} SET `
    const updateList = Object.keys(data)
    const update = [
      'exp_title',
      'exp_company',
      'exp_state',
      'exp_responsibilities',
      'exp_startMonth',
      'exp_startYear',
      'exp_endMonth',
      'exp_endYear',
      'exp_endDate',
      'exp_city',
      'exp_lga',
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

    sql2 += `WHERE exp_user = ? AND exp_id = ?`
    console.error(sql2)
    console.log(keys)

    try {
      const [result] = await (query.execute(sql2, [
        ...keys,
        data.exp_user,
        data.exp_id,
      ]) as Promise<RowDataPacket[]>)

      return { id: result.insertId }
    } catch (error: any) {
      console.log(error.message)
      throw new Error(error.message)
    }
  }

  static async delete(id: number) {
    let sql2 = `DELETE FROM ${ExperienceModel.table} WHERE exp_id = ?`
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
