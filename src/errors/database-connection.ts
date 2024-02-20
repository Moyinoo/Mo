import { BaseError } from './base-error'

export class DatabaseConnectionError extends BaseError {
  statusCode = 500
  reason = 'Error connecting to database'
  constructor() {
    super()

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype)
  }
  serializeErrors() {
    return { message: this.reason }
  }
}
