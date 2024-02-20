import { RowDataPacket } from 'mysql2'
import { query } from '../../../db/con'
import { ISelectedDb } from '../interfaces/selected.interface'
import {
  compareTimes,
  isDateEqual,
  mergeDateAndTime,
  scheduleMessage,
} from '../../../utils/helpers'
import { UserModel } from '../../users/models/user.models'
import { JobModel } from '../../jobs/models/job.model'
import { SchoolModel } from '../../school/models/school.model'
import sendScheduleMail from '../../../mail/sendScheduleMail'
import nodeCron from 'node-cron'
import moment from 'moment-timezone'
import { NotificationModel } from '../../notification/models/notification.model'
import { ioh } from '../../..'
import sendRemainderMail from '../../../mail/sendRemainderMail'
import { INotificationDb } from '../../notification/interfaces/notification.interface'

export class SelectedModel {
  public static table = 'selected'

  static async findBySchAndJob(sch_id: number, job_id: number) {
    const sql = `
    SELECT *, DATE_FORMAT(sel_interview_time, '%Y-%m-%d %H:%i:%s') as sel_interview_time,
    DATE_FORMAT(sel_interview_date, '%Y-%m-%d %H:%i:%s') as sel_interview_date 
    FROM ${SelectedModel.table} 
    WHERE sel_sch_id = ? AND sel_job_id = ?;
  `
    try {
      const [result] = await (query.execute(sql, [sch_id, job_id]) as Promise<
        RowDataPacket[]
      >)
      return result
    } catch (error: any) {
      console.error(error)
      throw new Error(error.message)
    }
  }
  static async get(sel_sch_id: number, sel_job_id: number) {
    try {
      const result = (await this.findBySchAndJob(
        sel_sch_id,
        sel_job_id,
      )) as unknown as ISelectedDb[]
      return result
    } catch (error: any) {
      console.error(error)
      throw new Error(error.message)
    }
  }
  static async getInvited(id: number) {
    const sql = `SELECT * FROM ${SelectedModel.table} WHERE sel_user_id = ? AND sel_interview_date IS NOT NULL`
    try {
      const [result] = await (query.execute(sql, [id]) as Promise<
        RowDataPacket[]
      >)
      return result as unknown as ISelectedDb[]
    } catch (error: any) {
      console.error(error)
      throw new Error(error.message)
    }
  }

  static async insertSelected(
    sel_sch_id: number,
    sel_job_id: number,
    sel_user_id: number,
  ) {
    let sql = `INSERT INTO ${SelectedModel.table}(sel_sch_id, sel_job_id, sel_user_id)
            VALUES(?, ?, ?)`
    try {
      await query.execute(sql, [sel_sch_id, sel_job_id, sel_user_id])
      console.log('success')
    } catch (error: any) {
      console.log('error inserting into data', error)
      throw new Error(error.message)
    }
  }

  static async create(data: ISelectedDb) {
    try {
      const result = (await this.insertSelected(
        data.sel_sch_id,
        data.sel_job_id,
        data.sel_user_id,
      )) as unknown as ISelectedDb[]
      return result
    } catch (error: any) {
      console.error(error)
      throw new Error(error.message)
    }
  }

  static async update(data: ISelectedDb) {
    console.log(data?.sel_id)
    console.log(data)
    try {
      if (!data?.sel_id) {
        console.log('here')
        let sql2 = `UPDATE ${SelectedModel.table} SET `
        const updateList = Object.keys(data)
        const update = [
          'sel_interview_date',
          'sel_interview_time',
          'sel_interview_status',
          'sel_interview_state',
          'sel_interview_city',
          'sel_interview_lga',
          'sel_interview_reason',
          'sel_interview_mode',
          'sel_interview_link',
          'sel_interview_address',
          'assesement',
          'remainder',
        ]

        const keys: any[] = []
        console.log('squery end')
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

        sql2 += `WHERE sel_job_id = ? AND sel_user_id = ? AND sel_sch_id = ?`
        sql2 = sql2.replace(/,\s*WHERE/, ' WHERE')

        const [result] = await query.execute(sql2, [
          ...keys,
          data.sel_job_id,
          data.sel_user_id,
          data.sel_sch_id,
        ])
        const time = new Date()

        if (
          data.sel_interview_status &&
          data.sel_interview_status === 'accept'
        ) {
          const id = await NotificationModel.create({
            notification_caption: 'Successful Accept Interview Invitation',
            notification_user: data.sel_user_id,
            notification_msg:
              "You've accepted the interview invitation. Good luck.🎉",
            notification_created_at: time,
          })
          ioh.emit('Accept or Decline Interview', {
            notification_id: id.id,
            notification_caption: 'Successful Accept Interview Invitation',
            notification_user: data.sel_user_id,
            notification_msg:
              "You've accepted the interview invitation. Good luck.🎉",
            notification_status: 0,
            notification_created_at: time,
          })
        } else if (
          data.sel_interview_status &&
          data.sel_interview_status === 'decline'
        ) {
          const id = await NotificationModel.create({
            notification_caption: 'Successful Decline Interview Invitation',
            notification_user: data.sel_user_id,
            notification_msg: "You've declined the interview invitation.",
            notification_created_at: time,
          })
          ioh.emit('Accept or Decline Interview', {
            notification_id: id.id,
            notification_caption: 'Successful Decline Interview Invitation',
            notification_user: data.sel_user_id,
            notification_msg: "You've declined the interview invitation.",
            notification_status: 0,
            notification_created_at: time,
          })
        }

        //@ts-ignore
        return { id: result.insertId }
      }
      console.log('seconf')
      const existingData = await this.getExistingData(data.sel_id!)
      const user = await UserModel.getUser(data.sel_user_id)
      const job = await JobModel.findbyJobId(data.sel_job_id)
      const school = await SchoolModel.findbySchId(data.sel_sch_id)
      const schoolUser = await UserModel.getUser(school.sch_user)

      const isDateChanged =
        !isDateEqual(
          data?.sel_interview_date as unknown as string,
          existingData.sel_interview_date,
        ) ||
        !compareTimes(
          data?.sel_interview_time as unknown as string,
          existingData.sel_interview_time,
        )

      let sql2 = `UPDATE ${SelectedModel.table} SET `
      const updateList = Object.keys(data)
      const update = [
        'sel_interview_date',
        'sel_interview_time',
        'sel_interview_status',
        'sel_interview_state',
        'sel_interview_city',
        'sel_interview_lga',
        'sel_interview_reason',
        'sel_interview_mode',
        'sel_interview_link',
        'sel_interview_address',
        'assesement',
        'remainder',
      ]
      const keys: any[] = []
      console.log('squery end')
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

      sql2 += `WHERE sel_job_id = ? AND sel_user_id = ? AND sel_sch_id = ?`
      sql2 = sql2.replace(/,\s*WHERE/, ' WHERE')

      console.error(sql2)
      console.log(keys)

      const [result] = await query.execute(sql2, [
        ...keys,
        data.sel_job_id,
        data.sel_user_id,
        data.sel_sch_id,
      ])

      console.log(existingData.sel_interview_date)

      if (isDateChanged || !existingData.sel_interview_date) {
        sendScheduleMail({
          email: user?.email!,
          firstName: user?.fname!,
          company: school.sch_name!,
          job_title: job.job_title,
          link: 'https://tayture.com/dashboard/jobs/all',
        })
        const time = new Date()
        const id = await NotificationModel.create({
          notification_caption: 'Successful Scheduling of Interview',
          notification_user: user?.id,
          notification_msg:
            'Great news! You have been scheduled for an interview. Be prepared to shine!',
          notification_created_at: time,
        })

        ioh.emit('scheduled Interview', {
          notification_id: id.id,
          notification_caption: 'Successful Scheduling of Interview',
          notification_user: user?.id,
          notification_msg:
            'Great news! You have been scheduled for an interview. Be prepared to shine!',
          notification_status: 0,
          notification_created_at: time,
        })
      }

      const nTime = mergeDateAndTime(
        data!.sel_interview_time as unknown as string,
        data.sel_interview_date! as unknown as string,
      )

      if (data?.remainder) {
        console.log('here')
        const targetDateTime = moment
          .tz(nTime, 'Africa/Lagos')
          .set({ hours: +nTime.split(':')[0], minutes: +nTime!.split(':')[1] })
          .subtract(90, 'minutes')

        const task = nodeCron.schedule(
          targetDateTime.format('m H D M d'),
          () => {
            sendRemainderMail({
              email: schoolUser?.email!,
              user: user?.fname!,
              firstName: schoolUser?.fname!,
              job_title: job.job_title,
            })

            task.stop()
          },
        )
      }
      //@ts-ignore
      return { id: result.insertId }
    } catch (error: any) {
      console.error(error.message)
      throw new Error(error.message)
    }
  }

  static async updateHiredStatus(data: ISelectedDb) {
    const sql = `
    UPDATE ${SelectedModel.table} SET sch_hired = ? 
    WHERE sel_id = ?;
  `
    try {
      const [result] = await (query.execute(sql, [
        data.sch_hired,
        data.sel_id,
      ]) as Promise<RowDataPacket[]>)
      const time = new Date()
      if (data.sch_hired === 1) {
        const id = await NotificationModel.create({
          notification_caption: 'Succesfully Hired',
          notification_status: 0,
          notification_user: data.sel_user_id,
          notification_msg:
            '🎉 Congratulations, You have been hired, go to your job portal and complete profile by setting hired status',
          notification_created_at: time,
        })
        const id2 = await NotificationModel.create({
          notification_caption: 'Succesfully Hired',
          notification_status: 0,
          notification_user: data.id,
          notification_msg:
            '🎉 Hurray!!! , you have succesfully completed your hiring process',
          notification_created_at: time,
        })
        ioh.emit('Succesful Hired', {
          notification_id: id2.id,
          notification_caption: 'Succesfully Hired',
          notification_status: 0,
          notification_user: data.id,
          notification_msg:
            '🎉 Hurray!!!, you have succesfully completed your hiring process',
          notification_created_at: time,
        })
        ioh.emit('Hired', {
          notification_id: id.id,
          notification_caption: 'Succesfully Hired',
          notification_status: 0,
          notification_user: data.sel_user_id,
          notification_msg:
            '🎉 Congratulations, You have been hired, go to your job portal and complete profile by setting hired status',
          notification_created_at: time,
        })
      }
      return result[0]
    } catch (error: any) {
      console.error(error)
      throw new Error(error.message)
    }
  }

  static async updateHiredStatusUser(data: ISelectedDb) {
    const sql = `
    UPDATE ${SelectedModel.table} SET user_hired = ? 
    WHERE sel_id = ?;
  `
    try {
      const [result] = await (query.execute(sql, [
        data.user_hired,
        data.sel_id,
      ]) as Promise<RowDataPacket[]>)
      return result[0]
    } catch (error: any) {
      console.error(error)
      throw new Error(error.message)
    }
  }
  static async updateTrigger(id: number) {
    const sql = `
    UPDATE ${SelectedModel.table} SET trigger_payment = ? 
    WHERE sel_id = ?;
  `
    try {
      const [result] = await (query.execute(sql, [1, id]) as Promise<
        RowDataPacket[]
      >)
      return result[0]
    } catch (error: any) {
      console.error(error)
      throw new Error(error.message)
    }
  }

  static async getExistingData(selId: number) {
    const sql = `
    SELECT *, DATE_FORMAT(sel_interview_time, '%Y-%m-%d %H:%i:%s') as sel_interview_time
    FROM ${SelectedModel.table} 
    WHERE sel_id = ?;
  `
    try {
      const [result] = await (query.execute(sql, [selId]) as Promise<
        RowDataPacket[]
      >)
      return result[0]
    } catch (error: any) {
      console.error(error)
      throw new Error(error.message)
    }
  }
}
