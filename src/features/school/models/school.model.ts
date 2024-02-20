import { RowDataPacket } from 'mysql2'
import { con, establishDatabaseConnection, query } from '../../../db/con'
import { ISchDb } from '../interfaces/school.interface'
import { WalletModel } from '../../wallet/models/wallet.model'

export class SchoolModel {
  public static table = 'schools'

  static async search(data: { name: string }) {
    console.error(data)
    const sql = `
    SELECT *
    FROM ${SchoolModel.table}
    WHERE sch_name LIKE ?
  `
    try {
      const [result] = await query.execute(sql, [`%${data.name}%`])
      return result
    } catch (error: any) {
      console.error(error)
      throw new Error(error.message)
    }
  }

  static async findbyId(id: number) {
    const sql = `SELECT * FROM ${SchoolModel.table} WHERE sch_user = ?`
    try {
      const [result] = await query.execute(sql, [id])
      return result
    } catch (error: any) {
      console.error(error)
      throw new Error(error.message)
    }
  }

  static async updateJob(id: number) {
    const sql = `SELECT * FROM ${SchoolModel.table} WHERE sch_user = ?`
    try {
      const [result] = await query.execute(sql, [id])
      return result
    } catch (error: any) {
      console.error(error)
      throw new Error(error.message)
    }
  }

  static async findbySchId(id: number) {
    const sql = `SELECT * FROM ${SchoolModel.table} WHERE sch_id = ?`
    try {
      const [result] = await (query.execute(sql, [id]) as Promise<
        RowDataPacket[]
      >)
      return result[0]
    } catch (error: any) {
      console.error(error)
      throw new Error(error.message)
    }
  }
  static async getAll() {
    const sql = `SELECT * FROM ${SchoolModel.table}`
    try {
      const [result] = await query.execute(sql)
      return result
    } catch (error: any) {
      console.error(error)
      throw new Error(error.message)
    }
  }
  static async get(id: number) {
    try {
      const result = (await this.findbyId(id)) as unknown as ISchDb[]
      return result[0]
    } catch (error: any) {
      console.error(error)
      throw new Error(error.message)
    }
  }

  static async create(data: ISchDb) {
    let sql2 = `INSERT INTO ${SchoolModel.table}(`
    let val = `VALUES(`
    const updateList = Object.keys(data)
    const update = [
      'sch_user',
      'sch_logo',
      'sch_name',
      'sch_no_emp',
      'sch_address',
      'sch_state',
      'sch_city',
      'sch_lga',
      'sch_url',
      'sch_phone',
      'sch_admins_str',
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
      await establishDatabaseConnection()
      await con.beginTransaction()
      const [result] = await (query.execute(sql2, [...keys]) as Promise<
        RowDataPacket[]
      >)
      await WalletModel.create({
        wallet_sch: result.insertId,
        wallet_user: data.sch_user,
      })
      await con.commit()
      return { id: result.insertId }
    } catch (error: any) {
      console.log(error.message)
      await con.rollback()
      throw new Error(error.message)
    } finally {
      con.release()
    }
  }

  static async update(data: ISchDb) {
    let sql2 = `UPDATE ${SchoolModel.table} SET `
    const updateList = Object.keys(data)
    const update = [
      'sch_logo',
      'sch_name',
      'sch_no_emp',
      'sch_address',
      'sch_state',
      'sch_city',
      'sch_lga',
      'sch_url',
      'sch_phone',
      'sch_admins_str',
      'wallet',
      'pending_job_post',
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

    sql2 += `WHERE sch_user = ? AND sch_id = ?`
    console.error(sql2)
    console.log(keys)

    try {
      const [result] = await (query.execute(sql2, [
        ...keys,
        data.sch_user,
        data.sch_id,
      ]) as Promise<RowDataPacket[]>)

      return { id: result.insertId }
    } catch (error: any) {
      console.log(error.message)
      throw new Error(error.message)
    }
  }

  static async delete(id: number) {
    let sql2 = `DELETE FROM ${SchoolModel.table} WHERE sch_id = ?`
    try {
      const [result] = await (query.execute(sql2, [id]) as Promise<
        RowDataPacket[]
      >)
      return { id }
    } catch (error) {
      console.error(error)
    }
  }

  static async verify(stat: number, id: number) {
    console.log(stat)
    console.log(id)
    let sql2 = `UPDATE ${SchoolModel.table} SET sch_verified = ? WHERE sch_id = ?`
    try {
      const [result] = await (query.execute(sql2, [stat, id]) as Promise<
        RowDataPacket[]
      >)
      return { id }
    } catch (error) {
      console.error(error)
    }
  }

  static async filterSchool(
    start: string,
    end: string,
    city: string,
    lga: string,
    st: string,
    pending_post: number,
  ) {
    const keys: any[] = []
    try {
      // Start building the SQL query
      let sql = `SELECT * FROM ${SchoolModel.table} WHERE 1`

      if (start) {
        sql += ` AND created_at >= ?`
        keys.push(new Date(start).toISOString())
      }

      if (end) {
        sql += ` AND created_at <= ?`
        keys.push(new Date(end).toISOString())
      }

      if (city) {
        sql += ` AND city = ?`
        keys.push(city)
      }

      if (lga) {
        sql += ` AND lga = ?`
        keys.push(lga)
      }

      if (st) {
        sql += ` AND state = ?`
        keys.push(st)
      }

      if (pending_post) {
        sql += ` AND pending_job_post = ?`
        keys.push(pending_post)
      }

      const [rows] = await (query.execute(sql, [...keys]) as Promise<
        RowDataPacket[]
      >)
      return rows
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}
