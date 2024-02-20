import { RowDataPacket } from 'mysql2'
import { query } from '../../../db/con'
import { IAppliedDb } from '../interfaces/applied.interface'
import { EducationModel } from '../../education/models/education.model'
import { ExperienceModel } from '../../experience/models/experience.model'
import { CertificationModel } from '../../certification/models/certification.model'
import { ExpertiseModel } from '../../expertise/models/expertise.model'
import { SkilzModel } from '../../skilz/models/skilz.model'
import { TestimonialModel } from '../../testimonial/models/testimonial.model'
import { UserModel } from '../../users/models/user.models'
import { ISelectedDb } from '../../selected/interfaces/selected.interface'

export class AppliedModel {
  public static table = 'applied'

  static async findbyId(id: number) {
    const sql = `SELECT * FROM ${AppliedModel.table} WHERE ap_user = ?`
    try {
      const [result] = await query.execute(sql, [id])
      return result
    } catch (error: any) {
      console.error(error)
      throw new Error(error.message)
    }
  }
  static async findAppliedJobCount(id: number) {
    const sql = `SELECT * FROM ${AppliedModel.table} WHERE ap_job_id = ?`
    try {
      const [result] = await (query.execute(sql, [id]) as Promise<
        RowDataPacket[]
      >)
      return result.length
    } catch (error: any) {
      console.error(error)
      throw new Error(error.message)
    }
  }

  static async findbySchoolId(id: number): Promise<{ [key: number]: any[] }> {
    const sql = `SELECT * FROM ${AppliedModel.table} WHERE ap_sch = ?`

    try {
      const [result] = await (query.execute(sql, [id]) as Promise<
        RowDataPacket[]
      >)

      const jobApplications: { [key: number]: any[] } = {}

      const promises = result.map(async (u: IAppliedDb) => {
        try {
          const [
            education,
            experience,
            certification,
            expertise,
            skilz,
            testimonial,
            user,
          ] = await Promise.all([
            EducationModel.findbyId(u.ap_user),
            ExperienceModel.findbyId(u.ap_user),
            CertificationModel.findbyId(u.ap_user),
            ExpertiseModel.findbyId(u.ap_user),
            SkilzModel.findbyId(u.ap_user),
            TestimonialModel.findbyId(u.ap_user),
            UserModel.getUser(u.ap_user),
          ])

          // Delete specific fields from the user object
          if (user) {
            ;[
              'path',
              'available',
              'created_at',
              'validated',
              'otp',
              'applied',
            ].forEach(
              //@ts-ignore
              field => delete user[field],
            )
          }

          const values = {
            education,
            experience,
            certification,
            expertise,
            skilz,
            testimonial,
            user,
          }

          const newObj = {
            ap_sample_answer: u.ap_sample_answer,
            ap_job_id: u.ap_job_id,
            ...values,
          }

          if (!jobApplications[u.ap_job_id]) {
            jobApplications[u.ap_job_id] = []
          }

          jobApplications[u.ap_job_id].push(newObj)
        } catch (error: any) {
          // Handle specific errors if needed
          console.error(`Error processing user ${u.ap_user}: ${error.message}`)
        }
      })

      await Promise.all(promises)
      console.log(jobApplications)

      return jobApplications
    } catch (error: any) {
      console.error(error.message, 'signed')
      console.log('signed')
      throw new Error(error.message)
    }
  }

  static async findByUserId(data: number[]): Promise<{ [key: number]: any[] }> {
    const jobApplications: { [key: number]: any[] } = {}

    await Promise.all(
      data.map(async userId => {
        const sql = `SELECT * FROM ${AppliedModel.table} WHERE ap_user = ?`
        try {
          const [result] = (await query.execute(sql, [userId])) as unknown as [
            RowDataPacket[],
          ]

          for (const u of result) {
            const [
              education,
              experience,
              certification,
              expertise,
              skilz,
              testimonial,
              user,
            ] = await Promise.all([
              EducationModel.findbyId(u.ap_user),
              ExperienceModel.findbyId(u.ap_user),
              CertificationModel.findbyId(u.ap_user),
              ExpertiseModel.findbyId(u.ap_user),
              SkilzModel.findbyId(u.ap_user),
              TestimonialModel.findbyId(u.ap_user),
              UserModel.getUser(u.ap_user),
            ])

            // Delete specific fields from the user object
            if (user) {
              delete user.path
              delete user.available
              delete user.created_at
              delete user.validated
              delete user.otp
              delete user.applied
            }

            const values = {
              education,
              experience,
              certification,
              expertise,
              skilz,
              testimonial,
              user,
            }

            const newObj = {
              ap_sample_answer: u.ap_sample_answer,
              ap_job_id: u.ap_job_id,
              ...values,
            }

            if (!jobApplications[u.ap_job_id]) {
              jobApplications[u.ap_job_id] = []
            }

            jobApplications[u.ap_job_id].push(newObj)
          }
        } catch (error: any) {
          console.error(error)
          throw new Error(error.message)
        }
      }),
    )

    return jobApplications
  }
  static async findByUserIdSelected(
    data: ISelectedDb[],
  ): Promise<{ [key: number]: any[] }> {
    const jobApplications: { [key: number]: any[] } = {}

    await Promise.all(
      data.map(async res => {
        const sql = `SELECT * FROM ${AppliedModel.table} WHERE ap_user = ?`

        try {
          const [result] = (await query.execute(sql, [
            res.sel_user_id,
          ])) as unknown as [RowDataPacket[]]

          for (const u of result) {
            const [
              education,
              experience,
              certification,
              expertise,
              skilz,
              testimonial,
              user,
            ] = await Promise.all([
              EducationModel.findbyId(u.ap_user),
              ExperienceModel.findbyId(u.ap_user),
              CertificationModel.findbyId(u.ap_user),
              ExpertiseModel.findbyId(u.ap_user),
              SkilzModel.findbyId(u.ap_user),
              TestimonialModel.findbyId(u.ap_user),
              UserModel.getUser(u.ap_user),
            ])

            // Delete specific fields from the user object
            if (user) {
              delete user.path
              delete user.available
              delete user.created_at
              delete user.validated
              delete user.otp
              delete user.applied
            }

            const values = {
              ...res,
              education,
              experience,
              certification,
              expertise,
              skilz,
              testimonial,
              user,
            }

            const newObj = {
              ap_sample_answer: u.ap_sample_answer,
              ap_job_id: u.ap_job_id,
              ...values,
            }

            if (!jobApplications[u.ap_job_id]) {
              jobApplications[u.ap_job_id] = []
            }

            jobApplications[u.ap_job_id].push(newObj)
          }
        } catch (error: any) {
          console.error(error)
          throw new Error(error.message)
        }
      }),
    )

    return jobApplications
  }

  static async findbyJobId(id: number) {
    const sql = `SELECT * FROM ${AppliedModel.table} WHERE ap_job_id = ?`
    try {
      const [result] = await query.execute(sql, [id])
      return result
    } catch (error: any) {
      console.error(error)
      throw new Error(error.message)
    }
  }
  static async getAppliedUser(id: number) {
    try {
      const result = (await this.findbyId(id)) as unknown as IAppliedDb[]
      return result
    } catch (error: any) {
      console.error(error)
      throw new Error(error.message)
    }
  }
  static async getAppliedSchool(id: number) {
    try {
      const result = (await this.findbySchoolId(id)) as unknown as IAppliedDb[]
      return result
    } catch (error: any) {
      console.error(error)
      throw new Error(error.message)
    }
  }
  static async getAppliedJob(id: number) {
    try {
      const result = (await this.findbyJobId(id)) as unknown as IAppliedDb[]
      return result
    } catch (error: any) {
      console.error(error)
      throw new Error(error.message)
    }
  }

  static async create(data: IAppliedDb) {
    let sql2 = `INSERT INTO ${AppliedModel.table}(`
    let val = `VALUES(`
    const updateList = Object.keys(data)
    const update = ['ap_user', 'ap_job_id', 'ap_sch', 'ap_sample_answer']
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
    // console.log(keys)

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

  static async delete(id: number) {
    let sql2 = `DELETE FROM ${AppliedModel.table} WHERE ap_id = ?`
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
