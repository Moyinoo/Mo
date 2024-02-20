import { Socket } from 'socket.io'
import { server, io } from './app'
import { con, query } from './db/con'
import { RowDataPacket } from 'mysql2'
import { ISelectedDb } from './features/selected/interfaces/selected.interface'
import { WalletModel } from './features/wallet/models/wallet.model'
import { TransactionModel } from './features/transaction/models/transaction.model'
import { SelectedModel } from './features/selected/models/selected.model'
import { monitor } from './cron'
import { JobModel } from './features/jobs/models/job.model'
import nodeCron from 'node-cron'
import { IJobSchDb } from './features/jobs/interfaces/jobs.interface'
import { UserModel } from './features/users/models/user.models'
import axios from 'axios'
import { IUserDb } from './features/users/interfaces/user.interface'
const PORT = 3000
export let ioh: Socket
io.on('connect', socket => {
  ioh = socket
  socket.on('hello', () => {})
})

const data = async () => {
  monitor.ping({ state: 'run' })
  const sql = `SELECT * FROM selected WHERE sch_hired = ? AND trigger_payment = ?`
  try {
    const [req] = await (query.execute(sql, [0, 0]) as Promise<RowDataPacket[]>)
    const selected = req as unknown as ISelectedDb[]

    const nList = selected.filter(async sel => {
      console.log(sel)
      const j = (await JobModel.findbyJobId(sel.sel_job_id)) as IJobSchDb
      const t = new Date(j.job_deadline)
      t.setUTCHours(24)
      console.log(Date.now() > t.getTime())
      return Date.now() > t.getTime()
    })

    if (nList.length > 0) {
      const updatePromises = nList.map(async job => {
        await WalletModel.updateBySchId({
          wallet_sch: job.sel_sch_id,
          wallet_balance: 1000,
        })

        await TransactionModel.updateDeduction({
          transaction_sch: job.sel_sch_id,
          transaction_user: job.sel_user_id,
          transaction_job: job.sel_job_id,
        })

        await SelectedModel.updateTrigger(+job.sel_id!)
      })

      await Promise.all(updatePromises)
      console.error(
        `crone job completed succesfully at ${Date.now().toLocaleString()}`,
      )
    } else {
      console.error('No records to process.')
    }
    monitor.ping({ state: 'complete' })
  } catch (error: any) {
    console.error(error.message, 'index', 'nodecrone schedule', 'POST')
    monitor.ping({ state: 'fail', reason: error?.message })
    throw new Error(error.message)
  }
}

nodeCron.schedule('0 1 * * *', async () => {
  try {
    await data()
  } catch (error: any) {
    console.log(error)
  }
})

const sendMessages = async () => {
  try {
    monitor.ping({ state: 'run' })

    const usersQuery = 'SELECT * FROM users WHERE phone IS NOT NULL'
    const [usersResult] = await (query.execute(usersQuery) as Promise<
      RowDataPacket[]
    >)

    const jobsQuery = `
      SELECT *
      FROM your_table_name
      WHERE job_deadline >= CURDATE()
    `
    const [jobsResult] = await (query.execute(jobsQuery) as Promise<
      RowDataPacket[]
    >)

    if (jobsResult.length > 0) {
      const messages = usersResult.map(async (user: IUserDb) => {
        await axios.post('https://api.ng.termii.com/api/sms/send', {
          api_key:
            'TLiWvkZknZAmLu9Gb9s6xQwg8NoQqJNkCmZ9DJdif2MHcvBZktWbFbMpfdaXRK',
          to: user.phone,
          from: 'Tayture',
          channel: 'generic',
          type: 'plain',
          sms: `Hello ${user.fname}, Jobs are now available on our platform! Don't miss out on great opportunities, visit www.tayture.com/jobs.`,
        })
      })

      await Promise.all(messages)
    }

    monitor.ping({ state: 'complete' })
  } catch (error: any) {
    console.error(error.message, 'index', 'nodecrone', 'POST')
    monitor.ping({ state: 'fail', reason: error?.message })
    throw new Error(error.message)
  }
}

nodeCron.schedule('0 19 * * 4', async () => {
  try {
    await sendMessages()
  } catch (error: any) {
    console.log(error)
  }
})

server.listen(PORT, () => {
  console.log(`server is running on ${PORT}`)
})
