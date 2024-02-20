import { RowDataPacket } from 'mysql2'
import { query } from '../../../db/con'
import { IBlogDb } from '../interfaces/blog.interface'

export class BlogModel {
  public static table = 'blogs'

  static async findbyId(id: number) {
    const sql = `SELECT * FROM ${BlogModel.table} WHERE blog_id = ?`
    try {
      const [result] = await query.execute(sql, [id])
      return result
    } catch (error: any) {
      console.error(error)
      throw new Error(error.message)
    }
  }

  static async getAll() {
    const sql = `SELECT * FROM ${BlogModel.table}`
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
      const result = (await this.findbyId(id)) as unknown as IBlogDb[]
      return result[0]
    } catch (error: any) {
      console.error(error)
      throw new Error(error.message)
    }
  }

  static async create(data: IBlogDb) {
    let sql2 = `INSERT INTO ${BlogModel.table}(`
    let val = `VALUES(`
    const updateList = Object.keys(data)
    const update = ['blog_user', 'title', 'banner', 'content', 'tags']
    const keys: any[] = []
    updateList.forEach((list: string, ind) => {
      if (update.includes(list)) {
        if (list === 'content' || list === 'tags') {
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

  static async incLike(id: number, process: string) {
    const sql = `
    UPDATE ${BlogModel.table}
    SET total_likes = total_likes ${process === 'inc' ? '+' : '-'} 1
    WHERE blog_id = ?
  `
    try {
      const [result] = await (query.execute(sql, [id]) as Promise<
        RowDataPacket[]
      >)
      console.log(result)
    } catch (error: any) {
      console.error(error)
      throw new Error(error.message)
    }
  }

  static async incBlogComment(id: number) {
    const sql = `
    UPDATE ${BlogModel.table}
    SET total_comments = total_comments + 1
    WHERE blog_id = ?
  `
    try {
      const [result] = await (query.execute(sql, [id]) as Promise<
        RowDataPacket[]
      >)
      console.log(result)
    } catch (error: any) {
      console.error(error)
      throw new Error(error.message)
    }
  }

  static async update(data: IBlogDb) {
    let sql2 = `UPDATE ${BlogModel.table} SET `
    const updateList = Object.keys(data)
    const update = [
      'title',
      'banner',
      'content',
      'tags',
      'total_likes',
      'total_comments',
      'total_reads',
      'total_parent_comments',
    ]
    const keys: any[] = []
    updateList.forEach((list: string, ind) => {
      if (update.includes(list)) {
        if (list === 'content' || list === 'tags') {
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

    sql2 += `WHERE blog_id = ?`
    console.error(sql2)
    console.log(keys)

    try {
      const [result] = await (query.execute(sql2, [
        ...keys,
        data.blog_id,
      ]) as Promise<RowDataPacket[]>)

      return { id: result.insertId }
    } catch (error: any) {
      console.log(error.message)
      throw new Error(error.message)
    }
  }

  static async delete(id: number) {
    let sql2 = `DELETE FROM ${BlogModel.table} WHERE blog_id = ?`
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
