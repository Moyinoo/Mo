import { Request, Response } from 'express'
import { MatchedModel } from '../models/matched.model'
import { UserModel } from '../../users/models/user.models'
import { AppliedModel } from '../../applied/models/applied.model'

export class MatchedController {
  async createMatched(req: Request, res: Response) {
    const { sch_id, job_id, matchedIds, noOfHires } = req.body
    try {
      const user = await MatchedModel.create({
        sch_id,
        job_id,
        matchedIds,
        noOfHires,
      })

      const matched = await AppliedModel.findByUserId(user)

      res
        .status(200)
        .send({ message: 'Matched added successfully', data: matched })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: {} })
    }
  }
}
