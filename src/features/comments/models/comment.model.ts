import { RowDataPacket } from 'mysql2'
import { query } from '../../../db/con'
import { ICommentDb } from '../interfaces/comment.interface'
import { UserModel } from '../../users/models/user.models'

export class CommentModel {
  public static table = 'comments'

  static async findbyId(id: number) {
    const sql = `SELECT * FROM ${CommentModel.table} WHERE comment_blog_id = ?`
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
      const result = (await this.findbyId(id)) as unknown as ICommentDb[]
      return result
    } catch (error: any) {
      console.error(error)
      throw new Error(error.message)
    }
  }

  // static async create(data: ICommentDb) {
  //  const sql2 = `INSERT INTO comments (comment_blog_id, comment_user_id, comment)
  //  VALUES (?, ?, ?)`

  //   try {
  //     const [result] = await (query.execute(sql2, [data.comment_blog_id, data.commented_user_id, data.comment]) as Promise<
  //       RowDataPacket[]
  //     >)
  //     return { id: result.insertId }
  //   } catch (error: any) {
  //     console.log(error.message)
  //     throw new Error(error.message)
  //   }
  // }

  static async create(data: ICommentDb) {
    let sql = `INSERT INTO comments (comment_blog_id, comment_user_id, comment) VALUES (?, ?, ?)`
    let values = [data.comment_blog_id, data.comment_user_id, data.comment]

    if (data.parent_comment_id !== null) {
      sql = `INSERT INTO comments (comment_blog_id, comment_user_id, comment, parent_comment_id) VALUES (?, ?, ?, ?)`
      values.push(data.parent_comment_id)
    }
    console.log(sql)
    console.log(values)

    try {
      const [result] = await (query.execute(sql, values) as Promise<
        RowDataPacket[]
      >)
      return { id: result.insertId }
    } catch (error: any) {
      console.error(error.message)
      throw new Error(error.message)
    }
  }

  static async incCommentLike(id: number, process: string) {
    const sql = `
    UPDATE ${CommentModel.table}
    SET comment_like = comment_like ${process === 'inc' ? '+' : '-'} 1
    WHERE comment_id = ?
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

  static async incReply(id: number) {
    const sql = `
    UPDATE ${CommentModel.table}
    SET reply_count = reply_count + 1
    WHERE comment_id = ?
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

  static async delete(id: number) {
    let sql2 = `DELETE FROM ${CommentModel.table} WHERE comment_id = ?`
    try {
      const [result] = await (query.execute(sql2, [id]) as Promise<
        RowDataPacket[]
      >)
      return { id }
    } catch (error) {
      console.error(error)
    }
  }

  static async getWithUser(id: number) {
    const sql = `
      SELECT 
        c.*, 
        u.fname AS user_name,
        u.lname AS last_name, 
        u.picture AS user_picture
      FROM ${CommentModel.table} c
      LEFT JOIN users u ON c.comment_user_id = u.id
      WHERE c.comment_blog_id = ?
    `

    try {
      const [result] = await (query.execute(sql, [id]) as Promise<
        RowDataPacket[]
      >)
      const res = result.map((r: ICommentDb) => {
        return {
          ...r,
          comments: [],
        }
      })

      return res
    } catch (error: any) {
      console.error(error)
      throw new Error(error.message)
    }
  }
}
