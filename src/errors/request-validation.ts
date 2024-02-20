import { BaseError } from './base-error'

export class RequestValidationError extends BaseError {
  statusCode = 400
  reason = 'Error connecting to database'
  constructor() {
    super()

    Object.setPrototypeOf(this, RequestValidationError.prototype)
  }
  serializeErrors() {
    return { message: this.reason }
  }
}
