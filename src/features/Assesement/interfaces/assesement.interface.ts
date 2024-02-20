export interface IQuestion {
  id: string
  question: string
  type: 'checkbox' | 'radio' | 'slider' | 'input'
  options?: string[]
  answer?: any
  input_type?: string
  input_placeholder?: string
  min?: number
  max?: number
  required?: boolean
  score?: number
}

export type IAssessmentEntryWithoutTotal = {
  [receiverType: string]: IQuestion[] | number
}

export interface IAssesementDb {
  a_id?: string
  a_name: string
  a_email: string
  taken: number
  path: string
  result: string
}

export interface IAssessmentEntry extends IAssessmentEntryWithoutTotal {
  total: number
}

type IAssessmentData = IAssessmentEntry[]

export default IAssessmentData
