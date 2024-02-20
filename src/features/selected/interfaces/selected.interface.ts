export interface ISelectedDb {
  id?: number
  sel_id?: number
  sel_sch_id: number
  sel_job_id: number
  sel_user_id: number
  sel_interview_date?: Date
  sel_interview_time?: Date
  sel_interview_status?: string
  sel_interview_state?: string
  sel_interview_city?: string
  sel_interview_lga?: string
  sel_interview_reason?: string
  sel_interview_mode?: string
  sel_interview_link?: string
  sch_hired?: number
  user_hired?: number
  remainder?: string
  assesement?: string
  scale?: boolean
}
