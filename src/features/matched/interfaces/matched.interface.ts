export interface IMatchedDb {
  match_id?: number
  sch_id: number
  job_id: number
  matchedIds: number[]
  noOfHires: number
  deadline?: Date
}
