export interface IUserDb {
  id?: number
  role_id?: number
  fname: string
  lname: string
  email: string
  phone?: string
  cover?: string
  description?: string
  address?: string
  lga?: string
  state?: string
  city?: string
  open_to_work?: boolean
  cv?: string
  type: string
  validated?: boolean
  applied?: string
  blog_likes?: string
  blog_comments?: string
  comment_likes?: string
  comment_comment?: string
  picture?: string
  password?: string
  path?: string
  available?: boolean
  token?: Itoken
  school_name?: string
  password_reset_token?: string
  password_reset_expires?: number
  validation_token?: string
  otp?: string
  workplace?: string
  job_description?: string
  job_location?: string
  created_at?: string
}

export type Itoken = { token: string }[]
