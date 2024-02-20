export interface ICertDb {
  cert_id?: number
  cert_user?: number
  cert_name: string
  cert_company: string
  cert_month_issued: string
  cert_year_issued: string
  cert_month_exp: string
  cert_year_exp: string
  cert_skills: string[]
}
