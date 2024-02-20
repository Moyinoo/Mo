export const env_dev = {
  MAIL_HOST: process.env.HOST_DEV!,
  MAIL_PORT: process.env.PORT_DEV!,
  MAIL_USER: process.env.USER_DEV!,
  MAIL_PASS: process.env.PASS_DEV!,
  MYSQL_USER: process.env.MYSQL_USER_DEV!,
  MYSQL_PASS: process.env.MYSQL_PASS_DEV || '',
  MYSQL_DB: process.env.MYSQL_DB_DEV!,
  MYSQL_HOST: process.env.MYSQL_HOST_DEV!,
  SECRET: process.env.SECRET!,
  SECRET2: process.env.SECRET2!,
  JWT_SECRET: process.env.JWT_SECRET!,
}
