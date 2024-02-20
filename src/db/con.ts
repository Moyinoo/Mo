import { createPool, PoolConnection } from 'mysql2/promise'
import console from '../utils/logger'
// import { env } from '../config';

const pool = createPool({
  /* localhost */
  // host: 'localhost',
  // user: 'root',
  // password: 'Rootuserpassword@1992',
  // database: 'tayture',
  // connectionLimit: 10,
  /* dev */
  // host: 'localhost',
  // user: 'taytyfcj_david',
  // password: 'changePassword1234567890',
  // database: 'taytyfcj_tayture',
  // connectionLimit: 10,
  /* prod */
  host: 'localhost',
  user: 'taytyfcj_david',
  password: 'changePassword1234567890',
  database: 'taytyfcj_test',
  connectionLimit: 10,
})

export let con: PoolConnection

export async function establishDatabaseConnection() {
  try {
    const connection: PoolConnection = await pool.getConnection()
    con = connection
    console.log('Database connection established!')
    connection.release()
  } catch (err) {
    console.error(err)
    console.error('Error establishing database connection:', err)
  }
}

const query = pool

export { query }
// host: env.MYSQL_HOST,
// user: env.MYSQL_USER,
// password: env.MYSQL_PASS,
// database: env.MYSQL_DB,
// host:"localhost",
// user: "taytyfcj_david",
// password: "changePassword1234567890",
// database: "taytyfcj_test",
// connectionLimit: 10,
