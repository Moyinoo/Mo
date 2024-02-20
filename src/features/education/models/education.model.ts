import { RowDataPacket } from 'mysql2'
import { query } from '../../../db/con'
import { IEduDb } from '../interfaces/education.interface'

export class EducationModel {
  public static table = 'education'

  static async findbyId(id: number) {
    const sql = `SELECT * FROM ${EducationModel.table} WHERE edu_user = ?`
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
      const result = (await this.findbyId(id)) as unknown as IEduDb[]
      return result
    } catch (error: any) {
      console.error(error)
      throw new Error(error.message)
    }
  }

  static async create(data: IEduDb) {
    let sql2 = `INSERT INTO ${EducationModel.table}(`
    let val = `VALUES(`
    const updateList = Object.keys(data)
    const update = [
      'edu_school',
      'edu_degree',
      'edu_field',
      'edu_startMonth',
      'edu_startYear',
      'edu_endMonth',
      'edu_endYear',
      'grade',
      'edu_user',
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
      console.log(result)
      console.log(result.insertId)
      return { id: result.insertId }
    } catch (error: any) {
      console.log(error.message)
      throw new Error(error.message)
    }
  }

  static async update(data: IEduDb) {
    let sql2 = `UPDATE ${EducationModel.table} SET `
    const updateList = Object.keys(data)
    const update = [
      'edu_school',
      'edu_degree',
      'edu_field',
      'edu_startMonth',
      'edu_startYear',
      'edu_endMonth',
      'edu_endYear',
      'grade',
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

    sql2 += `WHERE edu_user = ? AND edu_id = ?`
    console.error(sql2)
    console.log(keys)

    try {
      const [result] = await (query.execute(sql2, [
        ...keys,
        data.edu_user,
        data.edu_id,
      ]) as Promise<RowDataPacket[]>)

      return { id: result.insertId }
    } catch (error: any) {
      console.log(error.message)
      throw new Error(error.message)
    }
  }

  static async delete(id: number) {
    let sql2 = `DELETE FROM ${EducationModel.table} WHERE edu_id = ?`
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
