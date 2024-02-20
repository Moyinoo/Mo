import { RowDataPacket } from 'mysql2'
import { query } from '../../../db/con'
import { IMatchedDb } from '../interfaces/matched.interface'

export class MatchedModel {
  public static table = 'matched'

  static async findBySchAndJob(sch_id: number, job_id: number) {
    const sql = `SELECT * FROM ${MatchedModel.table} WHERE sch_id = ? AND job_id = ?`
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

  static async insertMatched(
    sch_id: number,
    job_id: number,
    matchedIds: number,
  ) {
    let sql = `INSERT INTO ${MatchedModel.table}(sch_id, job_id, matchedIds, deadline)
            VALUES(?, ?, ?, DATE_ADD(NOW(), INTERVAL 24 HOUR))`
    try {
      await query.execute(sql, [sch_id, job_id, matchedIds])
      console.log('success')
    } catch (error: any) {
      console.log('error inserting into data', error)
      throw new Error(error.message)
    }
  }

  static async create(data: IMatchedDb) {
    try {
      const existingMatches = await this.findBySchAndJob(
        data.sch_id,
        data.job_id,
      )
      const holder: number[] = []
      const condition = data.noOfHires * 2

      if (existingMatches.length < 1) {
        console.log('no matches')
        const matchedIdsToInsert = data.matchedIds.slice(0, condition)
        for (const matchedId of matchedIdsToInsert) {
          await this.insertMatched(data.sch_id, data.job_id, matchedId)
          holder.push(matchedId)
        }
        return holder
      } else {
        const existingMatchedIds = existingMatches.map(
          (match: IMatchedDb) => match.matchedIds,
        )
        const validExistingMatches = existingMatches.filter(
          (match: IMatchedDb) => Date.now() < match.deadline!.getTime(),
        )
        const validExistingMatchedIds = validExistingMatches.map(
          (match: IMatchedDb) => match.matchedIds,
        )

        if (validExistingMatches.length === 0) {
          // all match has expired
          const newMatchedIds = data.matchedIds.filter(
            mId => !existingMatchedIds.includes(mId),
          )

          if (newMatchedIds.length === 0) {
            const matchedIdsToInsert = existingMatchedIds.slice(0, condition)
            return matchedIdsToInsert
          } else if (newMatchedIds.length < condition) {
            const matchedIdsToInsert = existingMatchedIds.slice(
              0,
              condition - newMatchedIds.length,
            )

            for (const matchedId of newMatchedIds) {
              await this.insertMatched(data.sch_id, data.job_id, matchedId)
              holder.push(matchedId)
            }

            return [...holder, ...matchedIdsToInsert]
          } else {
            const matchedIdsToInsert = newMatchedIds.slice(0, condition)

            for (const matchedId of matchedIdsToInsert) {
              await this.insertMatched(data.sch_id, data.job_id, matchedId)
              holder.push(matchedId)
            }

            return holder
          }
        } else if (validExistingMatches.length < condition) {
          const newMatchedIds = data.matchedIds.filter(
            mId => !existingMatchedIds.includes(mId),
          )
          const matchedIdsToInsert = newMatchedIds.slice(
            0,
            condition - validExistingMatches.length,
          )

          for (const matchedId of matchedIdsToInsert) {
            await this.insertMatched(data.sch_id, data.job_id, matchedId)
            holder.push(matchedId)
          }

          for (const match of validExistingMatches) {
            holder.push(match.matchedIds)
          }

          return holder
        } else {
          const matchedIdsToInsert = validExistingMatchedIds.slice(0, condition)

          for (const matchedId of matchedIdsToInsert) {
            await this.insertMatched(data.sch_id, data.job_id, matchedId)
            holder.push(matchedId)
          }

          return holder
        }
      }
    } catch (error: any) {
      console.log(error.message)
      throw new Error(error.message)
    }
  }
}
