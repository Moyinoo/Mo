import { Response, Request, NextFunction } from 'express'
import { BaseError } from '../errors/base-error'

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (Error instanceof BaseError) {
    return res
      .status(BaseError.prototype.statusCode)
      .send(BaseError.prototype.serializeErrors())
  }
  res.status(400).send({ message: err.message })
}

export { errorHandler }
