export interface IJobSchDb {
  job_id: number
  job_user: number
  job_sch_user: number
  job_title: string
  job_desc: string
  job_city: string
  job_state: string
  job_lga: string
  job_address: string
  job_min_sal: string
  job_max_sal: string
  job_qual: string
  job_exp: string
  job_exp_length: string
  job_res: string
  job_req: string
  job_skills: string
  job_xpertise: string
  job_deadline: string
  job_no_hires: number
  job_submit_cover: number
  job_screen_ques: string
  created_at: Date
}

export interface IinvitedDb {
  sel_interview_address?: string
  sel_interview_city?: string
  sel_interview_date?: Date
  sel_interview_lga?: string
  sel_interview_reason?: string
  sel_interview_state?: string
  sel_interview_status?: string
  sel_interview_time?: Date
  sel_interview_mode?: string
  job?: IJobSchDb
}
