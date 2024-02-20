import { env_dev } from './env.development'
import { env_prod } from './env.production'

let env = env_dev

if (process.env.NODE_ENV === 'prod') {
  env = env_prod
}

export { env }
