import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { IUserDb } from '../features/users/interfaces/user.interface'
import { UserModel } from '../features/users/models/user.models'

declare global {
  namespace Express {
    interface Request {
      authUser?: IUserDb
    }
  }
}

const auth = async (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers['authorization']

  if (header) {
    const token = header.replace('Bearer ', '')

    const decoded = jwt.verify(
      token,
      // process.env.JWT_SECRET!
      '290b0356d3f8fceb65fa998eea2c60b0',
    ) as {
      id: number
      iat: number
    }

    if (!decoded) return res.status(401).send({ message: 'Unauthorized' })

    const result = (await UserModel.findAuth(+decoded.id!, token)) as IUserDb
    if (!result) return res.status(401).send({ message: 'Unauthorized' })

    req.authUser = result
    next()
  } else {
    res.status(401).send({ message: 'Unauthorized' })
  }
}

const signOut = async (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers['authorization']
  const token = header?.replace('Bearer ', '')

  try {
    await UserModel.removeToken(req.authUser?.id!, token!)
    next()
  } catch (error) {
    console.log(error)
    res.status(400).send({ message: 'An error occured' })
  }
}

export { auth, signOut }
