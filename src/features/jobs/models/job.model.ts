import { RowDataPacket } from 'mysql2'
import { query } from '../../../db/con'
import { IJobSchDb, IinvitedDb } from '../interfaces/jobs.interface'
import { AppliedModel } from '../../applied/models/applied.model'
import { ISelectedDb } from '../../selected/interfaces/selected.interface'
import { UserModel } from '../../users/models/user.models'
import { EducationModel } from '../../education/models/education.model'
import { ExperienceModel } from '../../experience/models/experience.model'
import { CertificationModel } from '../../certification/models/certification.model'
import { ExpertiseModel } from '../../expertise/models/expertise.model'
import { SkilzModel } from '../../skilz/models/skilz.model'
import { TestimonialModel } from '../../testimonial/models/testimonial.model'

export class JobModel {
  public static table = 'jobs'

  static async findbyId(id: number) {
    const sql = `SELECT * FROM ${JobModel.table} WHERE job_sch_user = ?`
    try {
      const [result] = await query.execute(sql, [id])
      return result
    } catch (error: any) {
      console.error(error)
      throw new Error(error.message)
    }
  }
  static async getByJobTitle(data: { sch_id: number; title: string }) {
    const sql = `
    SELECT job_title
    FROM ${JobModel.table}
    WHERE job_title LIKE ? AND job_sch_user = ?;
  `
    try {
      const [result] = await query.execute(sql, [
        `%${data.title}%`,
        data.sch_id,
      ])
      return result
    } catch (error: any) {
      console.error(error)
      throw new Error(error.message)
    }
  }
  static async findbyJobId(id: number) {
    const sql = `SELECT * FROM ${JobModel.table} WHERE job_id = ?`
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
  static async findSelectedJob(user: ISelectedDb[]) {
    const sql = `SELECT * FROM ${JobModel.table} WHERE job_id = ?`
    const userSelectedJob: IinvitedDb[] = []
    try {
      for (const u of user) {
        const [result] = await (query.execute(sql, [u.sel_job_id]) as Promise<
          RowDataPacket[]
        >)
        if (result.length > 0) {
          const values = {
            ...u,
            job: result[0],
          }
          userSelectedJob.push({ ...values })
        } else {
          // Handle the case where the result is empty or not as expected.
          console.error(
            `No data found for user with sel_job_id: ${u.sel_job_id}`,
          )
        }
      }

      return userSelectedJob
    } catch (error: any) {
      console.error(error)
      throw new Error(error.message)
    }
  }
  static async get(id: number) {
    try {
      const result = (await this.findbyId(id)) as unknown as IJobSchDb[]
      const promises = result.map(async (u: IJobSchDb) => {
        const applied_count = AppliedModel.findAppliedJobCount(u.job_id)

        return {
          ...u,
          applied_count: await applied_count,
        }
      })
      const results = await Promise.all(promises)

      return results
    } catch (error: any) {
      console.error(error)
      throw new Error(error.message)
    }
  }
  static async getActive() {
    const sql = `SELECT *, ${JobModel.table}.created_at AS job_created_at
    FROM ${JobModel.table}
    INNER JOIN schools ON ${JobModel.table}.job_sch_user = schools.sch_id
    WHERE schools.sch_verified = 1`
    try {
      const [result] = await query.execute(sql)

      return result
    } catch (error: any) {
      console.error(error)
      throw new Error(error.message)
    }
  }

  static async getActiveMatchJob(id: number) {
    try {
      const jobQuery = `
        SELECT *, ${JobModel.table}.created_at AS job_created_at
        FROM ${JobModel.table}
        INNER JOIN
          schools ON ${JobModel.table}.job_sch_user = schools.sch_id
        WHERE
          schools.sch_verified = 1`

      const [jobResult] = await query.execute(jobQuery)

      const userPromise = UserModel.getUser(id)
      const educationPromise = EducationModel.findbyId(id)
      const experiencePromise = ExperienceModel.findbyId(id)
      const certificationPromise = CertificationModel.findbyId(id)
      const expertisePromise = ExpertiseModel.findbyId(id)
      const skilzPromise = SkilzModel.findbyId(id)

      const [user, education, experience, certification, expertise, skilz] =
        await Promise.all([
          userPromise,
          educationPromise,
          experiencePromise,
          certificationPromise,
          expertisePromise,
          skilzPromise,
        ])

      const profile = {
        user: user ? this.omitUserFields(user) : null,
        education,
        experience,
        certification,
        expertise,
        skilz,
      }

      return { job: jobResult, profile }
    } catch (error: any) {
      console.error(error)
      throw new Error(error.message)
    }
  }

  static omitUserFields(user: any) {
    const fieldsToDelete = [
      'path',
      'available',
      'created_at',
      'validated',
      'otp',
      'applied',
    ]

    fieldsToDelete.forEach(field => delete user[field])
    return user
  }

  static async create(data: IJobSchDb) {
    let sql2 = `INSERT INTO ${JobModel.table}(`
    let val = `VALUES(`
    const updateList = Object.keys(data)
    const update = [
      'job_user',
      'job_sch_user',
      'job_title',
      'job_desc',
      'job_city',
      'job_state',
      'job_lga',
      'job_address',
      'job_min_sal',
      'job_max_sal',
      'job_qual',
      'job_exp',
      'job_exp_length',
      'job_res',
      'job_req',
      'job_skills',
      'job_xpertise',
      'job_deadline',
      'job_no_hires',
      'job_submit_cover',
      'job_screen_ques',
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
        if (list === 'job_deadline') {
          console.log(list)
          console.log((data as any)[list])
          let timestamp = (data as any)[list].slice(0, 10)
          console.log(timestamp)

          keys.push(timestamp)
        } else {
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

  static async update(data: IJobSchDb) {
    let sql2 = `UPDATE ${JobModel.table} SET `
    const updateList = Object.keys(data)
    const update = [
      'job_title',
      'job_desc',
      'job_city',
      'job_state',
      'job_lga',
      'job_address',
      'job_min_sal',
      'job_max_sal',
      'job_qual',
      'job_exp',
      'job_exp_length',
      'job_res',
      'job_req',
      'job_skills',
      'job_xpertise',
      'job_deadline',
      'job_no_hires',
      'job_submit_cover',
      'job_screen_ques',
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

    sql2 += `WHERE job_user = ? AND job_id = ?`
    console.error(sql2)
    console.log(keys)

    try {
      const [result] = await (query.execute(sql2, [
        ...keys,
        data.job_user,
        data.job_id,
      ]) as Promise<RowDataPacket[]>)

      return { id: result.insertId }
    } catch (error: any) {
      console.log(error.message)
      throw new Error(error.message)
    }
  }

  static async delete(id: number) {
    let sql2 = `DELETE FROM ${JobModel.table} WHERE job_id = ?`
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
