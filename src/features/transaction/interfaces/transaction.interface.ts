export interface ITransactionDb {
  transaction_id?: number
  transaction_user?: number
  transaction_sch?: number
  transaction_job?: number
  transaction_balance?: number
  transaction_amount?: number
  transaction_deducted?: number
  transaction_created_at?: Date
  transaction_updated_at?: Date
}
