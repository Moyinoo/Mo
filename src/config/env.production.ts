export const env_prod = {
  MAIL_HOST: process.env.HOST_PROD!,
  MAIL_PORT: process.env.PORT_PROD!,
  MAIL_USER: process.env.USER_PROD!,
  MAIL_PASS: process.env.PASS_PROD!,
  MYSQL_USER: process.env.MYSQL_USER_PROD!,
  MYSQL_PASS: process.env.MYSQL_PASS_PROD || '',
  MYSQL_DB: process.env.MYSQL_DB_PROD!,
  MYSQL_HOST: process.env.MYSQL_HOST_PROD!,
  SECRET: process.env.SECRET!,
  SECRET2: process.env.SECRET2!,
  JWT_SECRET: process.env.JWT_SECRET!,
}
