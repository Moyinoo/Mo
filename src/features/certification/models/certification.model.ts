import { RowDataPacket } from 'mysql2'
import { query } from '../../../db/con'
import { ICertDb } from '../interfaces/certification.interface'

export class CertificationModel {
  public static table = 'certification'

  static async findbyId(id: number) {
    const sql = `SELECT * FROM ${CertificationModel.table} WHERE cert_user = ?`
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
      const result = (await this.findbyId(id)) as unknown as ICertDb[]
      return result
    } catch (error: any) {
      console.error(error)
      throw new Error(error.message)
    }
  }

  static async create(data: ICertDb) {
    let sql2 = `INSERT INTO ${CertificationModel.table}(`
    let val = `VALUES(`
    const updateList = Object.keys(data)
    const update = [
      'cert_user',
      'cert_name',
      'cert_company',
      'cert_month_issued',
      'cert_year_issued',
      'cert_month_exp',
      'cert_year_exp',
      'cert_skills',
    ]
    const keys: any[] = []
    updateList.forEach((list: string, ind) => {
      if (update.includes(list)) {
        if (list === 'cert_skills') {
          if (ind === updateList.length - 1) {
            sql2 += `${list}) `
            val += `?)`
          } else {
            sql2 += `${list}, `
            val += `?, `
          }
          keys.push(JSON.stringify(data[list]))
        } else {
          if (ind === updateList.length - 1) {
            sql2 += `${list}) `
            val += `?)`
          } else {
            sql2 += `${list}, `
            val += `?, `
          }
          keys.push((data as any)[list])
        }
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

  static async update(data: ICertDb) {
    let sql2 = `UPDATE ${CertificationModel.table} SET `
    const updateList = Object.keys(data)
    const update = [
      'cert_name',
      'cert_company',
      'cert_month_issued',
      'cert_year_issued',
      'cert_month_exp',
      'cert_year_exp',
      'cert_skills',
    ]
    const keys: any[] = []
    updateList.forEach((list: string, ind) => {
      if (update.includes(list)) {
        if (list === 'cert_skills') {
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

    sql2 += `WHERE cert_user = ? AND cert_id = ?`
    console.error(sql2)
    console.log(keys)

    try {
      const [result] = await (query.execute(sql2, [
        ...keys,
        data.cert_user,
        data.cert_id,
      ]) as Promise<RowDataPacket[]>)

      return { id: result.insertId }
    } catch (error: any) {
      console.log(error.message)
      throw new Error(error.message)
    }
  }

  static async delete(id: number) {
    let sql2 = `DELETE FROM ${CertificationModel.table} WHERE cert_id = ?`
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
