const mysql = require('mysql2/promise')

// Replace with your MySQL database connection details
const connectionConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'tayture3',
  connectionLimit: 10,
}

async function createTables() {
  try {
    // Create a connection to the MySQL database
    const connection = await mysql.createConnection(connectionConfig)

    // Create the 'roles' table
    await connection.query(`
            CREATE TABLE IF NOT EXISTS roles (
              role_id INT AUTO_INCREMENT PRIMARY KEY,
              role_name VARCHAR(255)
            )
          `)

    // Create the 'users' table (changed from 'user')
    await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
              id INT AUTO_INCREMENT PRIMARY KEY,
              role_id INT,
              email VARCHAR(255),
              phone VARCHAR(255),
              cv VARCHAR(255) DEFAULT NULL,
              type VARCHAR(255),
              picture VARCHAR(255) DEFAULT NULL,
              password VARCHAR(255) DEFAULT NULL,
              path LONGTEXT DEFAULT NULL,
              available TINYINT(1) DEFAULT 0,
              token LONGTEXT DEFAULT NULL,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (role_id) REFERENCES roles(role_id)
            )
          `)

    // Create the 'school' table
    // await connection.query(`
    //         CREATE TABLE IF NOT EXISTS school (
    //           school_id INT AUTO_INCREMENT PRIMARY KEY,
    //           school_user INT,
    //           school_name VARCHAR(255),
    //           school_address VARCHAR(255),
    //           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    //           FOREIGN KEY (school_user) REFERENCES users(id)
    //         )
    //       `)
    // await connection.query(`
    // DROP TABLE school
    // `)

    await connection.query(`
          CREATE TABLE IF NOT EXISTS schools (
            sch_id INT AUTO_INCREMENT PRIMARY KEY,
            sch_user INT,
            sch_logo VARCHAR(400),
            sch_name VARCHAR(30),
            sch_no_emp VARCHAR(30),
            sch_address VARCHAR(30),
            sch_url VARCHAR(100),
            sch_phone VARCHAR(20),
            sch_verified TINYINT(1) DEFAULT 0,
            sch_admins_str LONGTEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (sch_user) REFERENCES users(id)
            )
          `)

    // Create the 'job_post' table
    // await connection.query(`
    //         CREATE TABLE IF NOT EXISTS job_post (
    //           jp_id INT AUTO_INCREMENT PRIMARY KEY,
    //           jp_school INT,
    //           jp_title VARCHAR(255),
    //           jp_description VARCHAR(255),
    //           jp_location VARCHAR(255),
    //           jp_timeline_start DATE,
    //           jp_timeline_end DATE,
    //           jp_status TINYINT(1) DEFAULT 0,
    //           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    //           FOREIGN KEY (jp_school) REFERENCES school(school_id)
    //         )
    //       `)
    await connection.query(`
          CREATE TABLE IF NOT EXISTS jobs (
            job_id INT AUTO_INCREMENT PRIMARY KEY,
            job_user INT,
            job_sch_user INT,
            job_title VARCHAR(200),
            job_desc VARCHAR(500),
            job_city VARCHAR(255),
            job_state VARCHAR(255),
            job_lga VARCHAR(255),
            job_address VARCHAR(255),
            job_min_sal VARCHAR(255),
            job_max_sal VARCHAR(255),
            job_qual VARCHAR(30),
            job_exp VARCHAR(30),
            job_exp_length VARCHAR(20),
            job_res VARCHAR(2000),
            job_req VARCHAR(2000),
            job_skills VARCHAR(255),
            job_xpertise VARCHAR(255),
            job_deadline DATE,
            job_no_hires INT,
            job_submit_cover TINYINT(1) DEFAULT 0,
            job_screen_ques VARCHAR(500),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (job_sch_user) REFERENCES schools(sch_id),
            FOREIGN KEY (job_user) REFERENCES users(id)
          )
        `)

    // Create the 'job_application' table
    await connection.query(`
            CREATE TABLE IF NOT EXISTS job_application (
              ja_id INT AUTO_INCREMENT PRIMARY KEY,
              ja_user INT,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (ja_user) REFERENCES users(id)
            )
          `)

    //  await connection.query(`
    //   DROP TABLE education
    // `)

    await connection.query(`
            CREATE TABLE IF NOT EXISTS education (
              edu_id INT AUTO_INCREMENT PRIMARY KEY,
              edu_user INT,
              edu_school VARCHAR(255),
              edu_degree VARCHAR(255),
              edu_field VARCHAR(255),
              edu_startMonth VARCHAR(30),
              edu_startYear VARCHAR(30),
              edu_endMonth VARCHAR(30),
              edu_endYear VARCHAR(30),
              grade VARCHAR(255),
              FOREIGN KEY (edu_user) REFERENCES users(id)
            )
          `)

    await connection.query(`
            CREATE TABLE IF NOT EXISTS experience (
              exp_id INT AUTO_INCREMENT PRIMARY KEY,
              exp_user INT,
              exp_title VARCHAR(255),
              exp_company VARCHAR(255),
              exp_city VARCHAR(255),
              exp_lga VARCHAR(255),
              exp_state VARCHAR(255),
              exp_responsibilities VARCHAR(255),
              exp_startMonth VARCHAR(30),
              exp_startYear VARCHAR(30),
              exp_endMonth VARCHAR(30),
              exp_endYear VARCHAR(30),
              exp_endDate VARCHAR(30),
              FOREIGN KEY (exp_user) REFERENCES users(id)
            )
          `)

    // await connection.query(`
    //         CREATE TABLE IF NOT EXISTS certification (
    //           cert_id INT AUTO_INCREMENT PRIMARY KEY,
    //           cert_user INT,
    //           cert_name VARCHAR(255),
    //           cert_company VARCHAR(255),
    //           cert_month_issued VARCHAR(30),
    //           cert_year_issued VARCHAR(30),
    //           cert_month_exp VARCHAR(30),
    //           cert_year_exp VARCHAR(30),
    //           cert_skills LONGTEXT DEFAULT NULL,
    //           FOREIGN KEY (cert_user) REFERENCES users(id)
    //         )
    //       `)

    // await connection.query(`
    //   CREATE TABLE IF NOT EXISTS expertise (
    //     xpert_id INT AUTO_INCREMENT PRIMARY KEY,
    //     xpert_user INT,
    //     skills LONGTEXT DEFAULT NULL,
    //     FOREIGN KEY (xpert_user) REFERENCES users(id)
    //   )
    // `)

    await connection.query(`
            CREATE TABLE IF NOT EXISTS skilz (
              skilz_id INT AUTO_INCREMENT PRIMARY KEY,
              skilz_user INT,
              skills LONGTEXT DEFAULT NULL,
              FOREIGN KEY (skilz_user) REFERENCES users(id)
            )
          `)
    await connection.query(`
          DROP TABLE notifications
          `)
    await connection.query(`
            CREATE TABLE IF NOT EXISTS notifications (
              notification_id INT AUTO_INCREMENT PRIMARY KEY,
              notification_user INT,
              notification_caption VARCHAR(50),
              notification_msg VARCHAR(255),
              notification_status TINYINT(1) DEFAULT 0,
              notification_created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
              FOREIGN KEY (notification_user) REFERENCES users(id)
            )
          `)
    await connection.query(`
            CREATE TABLE IF NOT EXISTS testimonial (
              ts_id INT AUTO_INCREMENT PRIMARY KEY,
              ts_user INT,
              ts_name VARCHAR(255),
              ts_position VARCHAR(255),
              ts_role_supervised VARCHAR(255),
              ts_description VARCHAR(1000),
              FOREIGN KEY (ts_user) REFERENCES users(id)
            )
          `)
    await connection.query(`
            CREATE TABLE IF NOT EXISTS transactions (
              transaction_id INT AUTO_INCREMENT PRIMARY KEY,
              transaction_user INT,
              transaction_job INT,
              transaction_sch INT,
              transaction_amount INT,
              transaction_deducted TINYINT(1) DEFAULT 0,
              transaction_created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
              transaction_updated_at DATETIME DEFAULT NULL, 
              FOREIGN KEY (transaction_user) REFERENCES users(id),
              FOREIGN KEY (transaction_sch) REFERENCES schools(sch_id),
              FOREIGN KEY (transaction_job) REFERENCES jobs(job_id)
            )
          `)
    await connection.query(`
            CREATE TABLE IF NOT EXISTS wallets (
              wallet_id INT AUTO_INCREMENT PRIMARY KEY,
              wallet_user INT,
              wallet_sch INT,
              wallet_balance INT DEFAULT 0,
              FOREIGN KEY (wallet_user) REFERENCES users(id),
              FOREIGN KEY (wallet_sch) REFERENCES schools(sch_id)
            )
          `)

    // await connection.query(`
    //     ALTER TABLE users
    //     ADD COLUMN job_location VARCHAR(400),
    //     ADD COLUMN job_preference VARCHAR(400)
    //   `)

    // await connection.query(`
    //     ALTER TABLE users
    //     DROP COLUMN name,
    //     ADD COLUMN fname VARCHAR(255),
    //     ADD COLUMN lname VARCHAR(255),
    //     ADD COLUMN password_reset_token VARCHAR(255) DEFAULT NULL,
    //     ADD COLUMN password_reset_expires INT DEFAULT 0,
    //     ADD COLUMN validation_token VARCHAR(255) DEFAULT NULL,
    //     ADD COLUMN validated TINYINT(1) DEFAULT 0
    //   `)

    // await connection.query(`
    //   ALTER TABLE users
    //   ADD COLUMN otp VARCHAR(10) DEFAULT NULL
    // `)
    // await connection.query(`
    //   ALTER TABLE experience
    //   MODIFY COLUMN exp_responsibilities VARCHAR(1000)
    // `);
    // await connection.query(`
    //   ALTER TABLE users
    //   MODIFY COLUMN description VARCHAR(300)
    // `);

    // await connection.query(`
    //   ALTER TABLE users
    //   ADD COLUMN state VARCHAR(255) DEFAULT NULL,
    //   ADD COLUMN city VARCHAR(255) DEFAULT NULL,
    //   ADD COLUMN lga VARCHAR(255) DEFAULT NULL,
    //   ADD COLUMN address VARCHAR(255) DEFAULT NULL,
    //   ADD COLUMN description VARCHAR(255) DEFAULT NULL,
    //   ADD COLUMN open_to_work TINYINT(1) DEFAULT 0,
    //    ADD COLUMN cover VARCHAR(255) DEFAULT NULL,
    //   ADD COLUMN applied LONGTEXT DEFAULT NULL
    //   ADD COLUMN workplace VARCHAR(255) DEFAULT NULL
    // `)

    // await connection.query(`
    //   ALTER TABLE selected
    //   ADD COLUMN assesement VARCHAR(255) DEFAULT NULL
    // `)
    // await connection.query(`
    //   ALTER TABLE users
    //   DROP COLUMN description,
    //   ADD COLUMN description VARCHAR(255) DEFAULT NULL
    // `)
    // await connection.query(`
    //   ALTER TABLE users
    //   ADD COLUMN workplace VARCHAR(255) DEFAULT NULL
    // `)

    // await connection.query(`
    //   ALTER TABLE certification
    //   DROP FOREIGN KEY certification_ibfk_1
    // `)
    // await connection.query(`
    //   ALTER TABLE experience
    //   DROP FOREIGN KEY experience_ibfk_1
    // `)
    // await connection.query(`
    //   ALTER TABLE education
    //   DROP FOREIGN KEY education_ibfk_1
    // `)
    // await connection.query(`
    //   ALTER TABLE expertise
    //   DROP FOREIGN KEY expertise_ibfk_1
    // `)
    // await connection.query(`
    //   ALTER TABLE skilz
    //   DROP FOREIGN KEY skilz_ibfk_1
    // `)
    // await connection.query(`
    //   ALTER TABLE certification
    //   ADD CONSTRAINT certification_ibfk_1
    //   FOREIGN KEY (cert_user)
    //   REFERENCES users(id)
    //   ON DELETE CASCADE
    //   ON UPDATE CASCADE
    // `)
    // await connection.query(`
    //   ALTER TABLE experience
    //   ADD CONSTRAINT experience_ibfk_1
    //   FOREIGN KEY (exp_user)
    //   REFERENCES users(id)
    //   ON DELETE CASCADE
    // `)
    // await connection.query(`
    //   ALTER TABLE education
    //   ADD CONSTRAINT education_ibfk_1
    //   FOREIGN KEY (edu_user)
    //   REFERENCES users(id)
    //   ON DELETE CASCADE
    // `)
    // await connection.query(`
    //   ALTER TABLE expertise
    //   ADD CONSTRAINT expertise_ibfk_1
    //   FOREIGN KEY (xpert_user)
    //   REFERENCES users(id)
    //   ON DELETE CASCADE
    // `)
    // await connection.query(`
    //   ALTER TABLE skilz
    //   ADD CONSTRAINT skilz_ibfk_1
    //   FOREIGN KEY (skilz_user)
    //   REFERENCES users(id)
    //   ON DELETE CASCADE
    // `)
    // await connection.query(`
    // ALTER TABLE school
    // DROP FOREIGN KEY school_ibfk_1;
    // `)
    // await connection.query(`
    // ALTER TABLE users
    // ADD COLUMN cover VARCHAR(255) DEFAULT NULL
    // `)
    // await connection.query(`
    // ALTER TABLE users
    // ADD COLUMN applied LONGTEXT DEFAULT NULL
    // `)
    // await connection.query(`
    // DROP TABLE applied
    // `)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS applied (
        ap_id INT AUTO_INCREMENT PRIMARY KEY,
        ap_user INT,
        ap_sch INT,
        ap_job_id INT,
        ap_sample_answer VARCHAR(255),
        FOREIGN KEY (ap_user) REFERENCES users(id),
        FOREIGN KEY (ap_sch) REFERENCES schools(sch_id),
        FOREIGN KEY (ap_job_id) REFERENCES jobs(job_id)
      )
    `)
    await connection.query(`
    CREATE TABLE IF NOT EXISTS matched (
      match_id INT AUTO_INCREMENT PRIMARY KEY,
      sch_id INT,
      job_id INT,
      matchedIds INT,
      deadline DATETIME,
      FOREIGN KEY (sch_id) REFERENCES schools(sch_id),
      FOREIGN KEY (job_id) REFERENCES jobs(job_id),
      FOREIGN KEY (matchedIds) REFERENCES users(id)
    )
  `)
    await connection.query(`
    CREATE TABLE IF NOT EXISTS selected (
      sel_id INT AUTO_INCREMENT PRIMARY KEY,
      sel_sch_id INT,
      sel_job_id INT,
      sel_user_id INT,
      sel_interview_date DATE DEFAULT NULL,
      sel_interview_time DATETIME DEFAULT NULL,
      sel_interview_status VARCHAR(30) DEFAULT 'pending',
      sel_interview_state VARCHAR(50) DEFAULT NULL,
      sel_interview_city VARCHAR(50) DEFAULT NULL,
      sel_interview_lga VARCHAR(50) DEFAULT NULL,
      sel_interview_reason VARCHAR(255) DEFAULT NULL,
      sel_interview_address VARCHAR(255),
      FOREIGN KEY (sel_sch_id) REFERENCES schools(sch_id),
      FOREIGN KEY (sel_job_id) REFERENCES jobs(job_id),
      FOREIGN KEY (sel_user_id) REFERENCES users(id)
    )
  `)
    // await connection.query(`
    //       ALTER TABLE selected
    //       ADD COLUMN sch_hired TINYINT DEFAULT 0,
    //       ADD COLUMN user_hired TINYINT DEFAULT 0,
    //       ADD COLUMN trigger_payment TINYINT DEFAULT 0
    //     `)
    // await connection.query(`
    //     ALTER TABLE schools
    //     ADD COLUMN sch_city VARCHAR(100) DEFAULT NULL,
    //     ADD COLUMN sch_state VARCHAR(100) DEFAULT NULL,
    //     ADD COLUMN sch_lga VARCHAR(100) DEFAULT NULL
    //   `)

    // await connection.query(`
    // ALTER TABLE school
    // ADD CONSTRAINT school_new_fk
    // FOREIGN KEY (school_user)
    // REFERENCES users(id)
    // ON DELETE CASCADE
    // `)
    // await connection.query(`
    // ALTER TABLE selected
    // MODIFY COLUMN sel_interview  CONSTRAINT school_new_fk
    // FOREIGN KEY (school_user)
    // REFERENCES users(id)
    // ON DELETE CASCADE
    // `)
    // ALTER TABLE school
    // ADD CONSTRAINT school_new_fk
    // FOREIGN KEY (school_user)
    // REFERENCES users(id)
    // ON DELETE CASCADE
    // `)
    // ALTER TABLE school
    // ADD CONSTRAINT school_new_fk
    // FOREIGN KEY (school_user)
    // REFERENCES users(id)
    // ON DELETE CASCADE
    // `)

    // await connection.query(`
    // ALTER TABLE schools
    // ADD COLUMN wallet INT DEFAULT 0
    // `)

    // await connection.query(`
    // ALTER TABLE schools
    // MODIFY COLUMN wallet LONGTEXT DEFAULT NULL
    // `)
    // await connection.query(`
    // DROP TABLE expertise
    // `)
    //  await connection.query(`
    //         CREATE TABLE IF NOT EXISTS expertise (
    //           xpert_id INT AUTO_INCREMENT PRIMARY KEY,
    //           xpert_user INT,
    //           xpert_subject VARCHAR(50),
    //           xpert_class LONGTEXT DEFAULT NULL,
    //           FOREIGN KEY (xpert_user) REFERENCES users(id)
    //         )
    //       `)
    //   await connection.query(`
    //   ALTER TABLE selected
    //   ADD COLUMN remainder TINYINT(1) DEFAULT 0
    // `);
    await connection.query(`
      ALTER TABLE testimonial
      ADD COLUMN ts_email VARCHAR(30) DEFAULT NULL
    `)

    console.log('Tables created successfully.')

    // Close the database connection
    await connection.end()
  } catch (error) {
    console.error('Error creating tables:', error)
  }
}

// Call the function to create the tables
createTables()
