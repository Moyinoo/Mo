export type IXpert = string[]

export interface IXpertDb {
  xpert_subject: string
  xpert_class: IXpert
  xpert_id?: number
  xpert_user: number
}
