import { RowDataPacket } from 'mysql2'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { query } from '../../../db/con'
import { IUserDb, Itoken } from '../interfaces/user.interface'
import { v4 as uuidv4 } from 'uuid'
import console from '../../../utils/logger'
const saltRounds = 10

export class UserModel {
  public static table = 'users'

  static async findbyEmail(email: string) {
    const sql = `SELECT * FROM ${UserModel.table} WHERE email = ?`
    try {
      const [result] = await query.execute(sql, [email])
      return result
    } catch (error: any) {
      // console.log('error fetching')
      console.error(error)
      throw new Error(error.message)
    }
  }
  static async findbyId(id: number) {
    const sql = `SELECT * FROM ${UserModel.table} WHERE id = ?`
    try {
      const [result] = await query.execute(sql, [id])
      return result
    } catch (error: any) {
      // console.log('error fetching')
      console.error(error)
      throw new Error(error.message)
    }
  }
  static async findbyToken(token: string) {
    const sql = `SELECT * FROM ${UserModel.table} WHERE validation_token = ?`
    try {
      const [result] = await query.execute(sql, [token])
      return result
    } catch (error) {
      console.log('error fetching')
    }
  }
  static async getUser(id: number) {
    const sql = `SELECT * FROM ${UserModel.table} WHERE id = ?`
    try {
      const [result] = await (query.execute(sql, [id]) as Promise<
        RowDataPacket[]
      >)
      const nData: IUserDb = result[0]
      delete nData.password
      delete nData.token
      delete nData.password_reset_expires
      delete nData.password_reset_token
      delete nData.validation_token
      return nData
    } catch (error) {
      console.log('error fetching')
    }
  }

  static async storeToken(id: number, token: string) {
    const sql = `SELECT * FROM ${UserModel.table} WHERE id = ?`
    const sql2 = `UPDATE ${UserModel.table} SET token = ? WHERE id = ?`
    const newToken = JSON.stringify([{ token }])
    try {
      const [result] = await (query.execute(sql, [id]) as Promise<
        RowDataPacket[]
      >)
      if (result[0].token === null) {
        await query.execute(sql2, [newToken, id])
      } else {
        let tokenList = result[0].token as unknown as string
        const mtokenList = JSON.parse(tokenList)
        mtokenList.push({ token })
        await query.execute(sql2, [JSON.stringify(mtokenList), id])
      }
    } catch (error) {
      console.log(error)
    }
  }
  static async storeTokenAndValidation(id: number, token: string) {
    const sql = `SELECT * FROM ${UserModel.table} WHERE id = ?`
    const sql2 = `UPDATE ${UserModel.table} SET token = ?, validated = ?, validation_token = NULL WHERE id = ?`
    const newToken = JSON.stringify([{ token }])
    try {
      const [result] = await (query.execute(sql, [id]) as Promise<
        RowDataPacket[]
      >)
      if (result[0].token === null) {
        await query.execute(sql2, [newToken, 1, id])
      } else {
        let tokenList = result[0].token as unknown as string
        const mtokenList = JSON.parse(tokenList)
        mtokenList.push({ token })
        await query.execute(sql2, [JSON.stringify(mtokenList), 1, id])
      }
    } catch (error) {
      console.log(error)
    }
  }

  static async signin(email: string, password: string) {
    try {
      const result = (await this.findbyEmail(email)) as unknown as IUserDb[]
      if (result && result.length > 0) {
        console.log(!result[0].validated)
        if (!result[0].validated)
          throw new Error('Please Verify Email to Login to dashboard')

        if (!result[0].password) {
          throw new Error('No account with that detail...Sign up')
        }
        const passwordMatch = bcrypt.compare(password, result[0].password!)

        if (!passwordMatch)
          throw new Error('No account with that detail...Sign up')

        const token = jwt.sign(
          { id: JSON.stringify(result[0].id) },
          '290b0356d3f8fceb65fa998eea2c60b0',
          // process.env.JWT_SECRET!,
        )

        await this.storeToken(result[0].id!, token)

        return { ...result[0], token }
      } else {
        throw new Error('No account with that detail...Sign up')
      }
    } catch (error: any) {
      console.error(error)
      throw new Error(error.message)
    }
  }

  static async signInByValidationToken(token: string) {
    try {
      const result = (await this.findbyToken(token)) as unknown as IUserDb[]
      if (result && result.length > 0) {
        const token = jwt.sign(
          { id: JSON.stringify(result[0].id) },
          '290b0356d3f8fceb65fa998eea2c60b0',
          // process.env.JWT_SECRET!,
        )

        await this.storeTokenAndValidation(result[0].id!, token)

        return { ...result[0], token }
      } else {
        throw new Error('No account with that detail...Sign up')
      }
    } catch (error: any) {
      console.log(error)
      throw new Error(error.message)
    }
  }
  static async verifyNumber(msg: string, user_id: number) {
    const sql2 = `UPDATE ${UserModel.table} SET otp = ? WHERE id = ?`
    try {
      await query.execute(sql2, [msg, user_id])
    } catch (error: any) {
      console.log(error)
      throw new Error(error.message)
    }
  }

  static async verifyOTP(user_id: number, phone: string) {
    const sql2 = `UPDATE ${UserModel.table} SET phone = ? WHERE id = ?`
    try {
      const res = (await this.findbyId(user_id)) as unknown as IUserDb[]
      await query.execute(sql2, [phone, user_id])

      const token = jwt.sign(
        { id: JSON.stringify(res[0].id) },
        '290b0356d3f8fceb65fa998eea2c60b0',
        // process.env.JWT_SECRET!,
      )
      await this.storeToken(res[0].id!, token)
      return { ...res[0], password: null, token, phone }
    } catch (error: any) {
      console.log(error)
      throw new Error(error.message)
    }
  }

  static async updateUser(data: IUserDb) {
    let sql2 = `UPDATE ${UserModel.table} SET `
    console.log(data)
    const updateList = Object.keys(data)
    const update = [
      'fname',
      'lname',
      'description',
      'address',
      'lga',
      'city',
      'state',
      'open_to_work',
      'cv',
      'cover',
      'picture',
      'workplace',
      'path',
      'available',
      'school_name',
      'otp',
      'password_reset_token',
      'password_reset_expires',
      'job_preference',
      'job_location',
      'applied',
    ]
    const keys: any[] = []
    updateList.forEach((list: string, ind) => {
      if (update.includes(list)) {
        if (list === 'path') {
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

    sql2 += `WHERE id = ?`
    console.error(sql2)
    console.log(keys)

    try {
      const [result] = await (query.execute(sql2, [
        ...keys,
        data.id,
      ]) as Promise<RowDataPacket[]>)
      const res = (await this.findbyId(data.id!)) as unknown as IUserDb[]
      const token = jwt.sign(
        { id: JSON.stringify(res[0].id) },
        '290b0356d3f8fceb65fa998eea2c60b0',
        // process.env.JWT_SECRET!,
      )
      await this.storeToken(res[0].id!, token)
      return { ...res[0], password: null, token }
    } catch (error: any) {
      console.log(error.message)
      throw new Error(error.message)
    }
  }

  static async signinGoogle(email: string, password: string) {
    try {
      const result = (await this.findbyEmail(email)) as unknown as IUserDb[]
      if (result && result.length > 0) {
        const token = jwt.sign(
          { id: JSON.stringify(result[0].id) },
          '290b0356d3f8fceb65fa998eea2c60b0',
          // process.env.JWT_SECRET!,
        )

        if (result[0].type === 'manual') {
          throw new Error('No account with that detail...Sign up')
        }

        await this.storeToken(result[0].id!, token)

        return { ...result[0], token }
      } else {
        throw new Error('No account with that detail...Sign up')
      }
    } catch (error: any) {
      console.log(error)
      throw new Error(error.message)
    }
  }

  static async replaceToken(id: number, token: Itoken) {
    const sql2 = `UPDATE ${UserModel.table} SET token = ? WHERE id = ?`
    let tokenList = token
    try {
      const ntokenList = JSON.stringify(tokenList)
      await query.execute(sql2, [ntokenList, id])
    } catch (error) {
      console.log(error)
    }
  }
  static async updateFirstTime(id: number) {
    const sql2 = `UPDATE ${UserModel.table} SET first_time = 0 WHERE email = ?`
    try {
      await query.execute(sql2, [id])
    } catch (error) {
      console.log(error)
    }
  }

  static async signup(data: IUserDb) {
    const sql = `INSERT INTO ${UserModel.table}(role_id, fname, lname, email, password, type, validated, validation_token, phone) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`
    try {
      const result = (await this.findbyEmail(
        data.email,
      )) as unknown as IUserDb[]

      if (result?.length > 0) {
        console.error('error')
        throw new Error('user exists')
      }
      const pass = await this.hashPassword(data.password!)
      const validation_token = uuidv4()
      //   await query.beginTransaction()
      const [row] = await (query.execute(sql, [
        2,
        data.fname,
        data.lname,
        data.email,
        pass,
        data.type,
        0,
        validation_token,
        data.phone,
      ]) as Promise<RowDataPacket[]>)
      const token = jwt.sign(
        { id: JSON.stringify(row.insertId!) },
        '290b0356d3f8fceb65fa998eea2c60b0',
        // process.env.JWT_SECRET!,
      )

      await this.storeToken(row.insertId!, token)

      //   await query.commit()
      return {
        id: row.insertId,
        ...data,
        password: pass,
        token,
        validated: 0,
        validation_token,
      }
    } catch (error: any) {
      console.error(error)
      throw new Error(error.message)
    }
  }

  static async signupLanding(data: IUserDb) {
    let sql = ''
    let info: any[] = []
    if (data.cover && data.cover.length > 3) {
      sql = `INSERT INTO ${UserModel.table}(role_id, fname, lname, email, password, type, cv, cover, validated, validation_token) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    } else {
      sql = `INSERT INTO ${UserModel.table}(role_id, fname, lname, email, password, type, cv, validated, validation_token) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`
    }
    try {
      const result = (await this.findbyEmail(
        data.email,
      )) as unknown as IUserDb[]

      if (result?.length > 0) {
        const { id, token: t, password, ...filteredResult } = result[0]
        await this.updateUser({
          id,
          applied: data.applied,
        } as unknown as any)
        const token = jwt.sign(
          { id: JSON.stringify(id) },
          '290b0356d3f8fceb65fa998eea2c60b0',
          // process.env.JWT_SECRET!,
        )

        await this.storeToken(id!, token)
        return {
          id,
          ...filteredResult,
          updated: true,
        }
      }
      const pass = await this.hashPassword(data.password!)
      const validation_token = uuidv4()

      if (data.cover && data.cover.length > 3) {
        info = [
          2,
          data.fname,
          data.lname,
          data.email,
          pass,
          data.type,
          data.cv,
          data.cover,
          0,
          validation_token,
        ]
      } else {
        info = [
          2,
          data.fname,
          data.lname,
          data.email,
          pass,
          data.type,
          data.cv,
          0,
          validation_token,
        ]
      }

      const [row] = await (query.execute(sql, [...info]) as Promise<
        RowDataPacket[]
      >)
      const token = jwt.sign(
        { id: JSON.stringify(row.insertId!) },
        '290b0356d3f8fceb65fa998eea2c60b0',
        // process.env.JWT_SECRET!,
      )

      await this.storeToken(row.insertId!, token)
      return {
        id: row.insertId,
        ...data,
        password: pass,
        token,
        validated: 0,
        validation_token,
        updated: false,
      }
    } catch (error: any) {
      console.error(error)
      throw new Error(error.message)
    }
  }

  static async signupGoogle(data: IUserDb) {
    const sql = `INSERT INTO ${UserModel.table}(role_id, fname, lname, email, type, picture, validated) VALUES(?, ?, ?, ?, ?, ?, ?)`

    try {
      const result = (await this.findbyEmail(
        data.email,
      )) as unknown as IUserDb[]

      if (result?.length > 0) {
        console.log('error')
        throw new Error('user exists')
      }
      // const pass = await this.hashPassword(data.password!)
      const [row] = await (query.execute(sql, [
        2,
        data.fname,
        data.lname,
        data.email,
        data.type,
        data.picture,
        1,
      ]) as Promise<RowDataPacket[]>)

      const token = jwt.sign(
        { id: JSON.stringify(row.insertId!) },
        '290b0356d3f8fceb65fa998eea2c60b0',
        // process.env.JWT_SECRET!,
      )

      await this.storeToken(row.insertId!, token)

      return { id: row.insertId!, ...data, token, validated: 1, first_time: 1 }
    } catch (error: any) {
      console.error(error)
      throw new Error(error.message)
    }
  }

  static async hashPassword(password: string) {
    const pass = await bcrypt.hash(password, saltRounds)
    return pass
  }

  static async findAll() {
    let sql = `SELECT * FROM ${UserModel.table}`
    try {
      const result = await query.execute({ sql })
      return result
    } catch (error) {
      console.log('error fetching')
    }
  }

  static async deleteOneById(batchId: number) {
    let sql2 = `DELETE FROM ${UserModel.table} WHERE batch_id = ?`
    try {
      await query.execute(sql2, [batchId])
      return {}
    } catch (error) {
      console.error(error)
    }
  }

  static async findAuth(id: number, token: string) {
    const sql = `SELECT * FROM ${UserModel.table} WHERE id = ?`

    try {
      const [result] = await (query.execute(sql, [id]) as Promise<
        RowDataPacket[]
      >)
      let holder = result[0].token!
      holder = JSON.parse(holder)
      const tokenExist = holder.filter((t: any) => t.token === token)
      if (tokenExist.length > 0) {
        return result[0]
      }
    } catch (error) {
      console.error(error)
    }
  }

  static async removeToken(id: number, token: string) {
    const sql = `SELECT * FROM ${UserModel.table}  WHERE id = ?`
    try {
      const [result] = await (query.execute(sql, [id]) as Promise<
        RowDataPacket[]
      >)
      const holder = JSON.parse(result[0].token)
      const tokenList = holder.filter((t: any) => t.token !== token)
      this.replaceToken(id, tokenList)
    } catch (error) {
      console.log(error)
    }
  }

  static async filterUser(
    start: string,
    end: string,
    city: string,
    lga: string,
    st: string,
    path: string[],
  ) {
    const keys: string[] = []
    try {
      // Start building the SQL query
      let sql = `SELECT * FROM ${UserModel.table} WHERE 1`

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

      console.log(sql)

      const [rows] = await (query.execute(sql, [...keys]) as Promise<
        RowDataPacket[]
      >)
      let result =
        rows.length > 0
          ? rows.map((r: IUserDb) => {
              delete r.token
              delete r.password_reset_token
              delete r.password
              delete r.validation_token
              delete r.validated
              delete r.password_reset_expires

              return {
                ...r,
              }
            })
          : []
      if (path?.length > 0) {
        console.log('object')
        result = result.filter((res: IUserDb) => {
          return path.some(p => {
            if (res.path) {
              const pathArray = JSON.parse(res.path)
              return pathArray.includes(p)
            }
            return false
          })
        })
      }

      return result
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  static async addUserBlogLikes(id: number, blog_id: number, process: string) {
    const sql2 = `UPDATE ${UserModel.table} SET blog_likes = ? WHERE id = ?`
    const newToken = JSON.stringify([blog_id])

    try {
      const res = (await this.findbyId(id)) as unknown as IUserDb[]
      let blogLikeList = res[0].blog_likes as unknown as string
      const mblogLikeList = JSON.parse(blogLikeList)

      if (!res[0].blog_likes || mblogLikeList.length < 1) {
        await query.execute(sql2, [newToken, id])
      } else {
        if (mblogLikeList.includes(blog_id)) {
          if (process === 'dec') {
            const n = mblogLikeList.filter((e: any) => e !== blog_id)
            await query.execute(sql2, [JSON.stringify(n), id])
            return {}
          }
        }
        mblogLikeList.push(blog_id)
        await query.execute(sql2, [JSON.stringify(mblogLikeList), id])
        return {}
      }
    } catch (error: any) {
      console.log(error)
      throw new Error(error.message)
    }
  }

  static async addUserBlogComments(id: number, blog_id: number) {
    const sql2 = `UPDATE ${UserModel.table} SET blog_comments = ? WHERE id = ?`
    const newToken = JSON.stringify([blog_id])
    try {
      const res = (await this.findbyId(id)) as unknown as IUserDb[]
      if (!res[0].blog_comments) {
        await query.execute(sql2, [newToken, id])
      } else {
        let blogCommentList = res[0].blog_comments as unknown as string
        const mblogCommentList = JSON.parse(blogCommentList)
        if (mblogCommentList.includes(blog_id)) return {}
        mblogCommentList.push(blog_id)
        await query.execute(sql2, [JSON.stringify(mblogCommentList), id])
        return {}
      }
    } catch (error: any) {
      console.log(error)
      throw new Error(error.message)
    }
  }

  static async addUserCommentLikes(
    id: number,
    comment_id: number,
    process: string,
  ) {
    const sql2 = `UPDATE ${UserModel.table} SET comment_likes = ? WHERE id = ?`
    const newToken = JSON.stringify([comment_id])

    try {
      const res = (await this.findbyId(id)) as unknown as IUserDb[]
      let commentLikeList = res[0].comment_likes as unknown as string
      const mcommentLikeList = JSON.parse(commentLikeList)
      if (!res[0].comment_likes || mcommentLikeList.length < 1) {
        await query.execute(sql2, [newToken, id])
      } else {
        if (mcommentLikeList.includes(comment_id)) {
          if (process === 'dec') {
            const n = mcommentLikeList.filter((e: any) => e !== comment_id)
            await query.execute(sql2, [JSON.stringify(n), id])
            return {}
          }
        }
        mcommentLikeList.push(comment_id)
        await query.execute(sql2, [JSON.stringify(mcommentLikeList), id])
        return {}
      }
    } catch (error: any) {
      console.log(error)
      throw new Error(error.message)
    }
  }

  static async addUserCommentComment(id: number, comment_id: number) {
    const sql2 = `UPDATE ${UserModel.table} SET comment_comment = ? WHERE id = ?`
    const newToken = JSON.stringify([comment_id])
    try {
      const res = (await this.findbyId(id)) as unknown as IUserDb[]
      if (!res[0].comment_comment) {
        await query.execute(sql2, [newToken, id])
      } else {
        let commentCommentList = res[0].comment_comment as unknown as string
        const mCommentCommentList = JSON.parse(commentCommentList)
        if (mCommentCommentList.includes(comment_id)) return {}
        mCommentCommentList.push(comment_id)
        await query.execute(sql2, [JSON.stringify(mCommentCommentList), id])
        return {}
      }
    } catch (error: any) {
      console.log(error)
      throw new Error(error.message)
    }
  }
}
