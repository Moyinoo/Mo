CREATE TABLE `tayture3`.`applied` (
  `ap_id` int(11) NOT NULL,
  `ap_user` int(11) DEFAULT NULL,
  `ap_sch` int(11) DEFAULT NULL,
  `ap_job_id` int(11) DEFAULT NULL,
  `ap_sample_answer` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
ALTER TABLE `tayture3`.`applied` ADD PRIMARY KEY (`ap_id`), ADD KEY `ap_user` (`ap_user`), ADD KEY `ap_sch` (`ap_sch`), ADD KEY `ap_job_id` (`ap_job_id`);
ALTER TABLE `tayture3`.`applied` MODIFY `ap_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15 ;
CREATE TABLE `tayture3`.`assesement` (
  `a_id` int(11) NOT NULL,
  `a_name` varchar(255) NOT NULL,
  `a_email` varchar(255) NOT NULL,
  `taken` int(255) NOT NULL,
  `path` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`path`)),
  `result` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
ALTER TABLE `tayture3`.`assesement` ADD PRIMARY KEY (`a_id`);
ALTER TABLE `tayture3`.`assesement` MODIFY `a_id` int(11) NOT NULL AUTO_INCREMENT;
CREATE TABLE `tayture3`.`certification` (
  `cert_id` int(11) NOT NULL,
  `cert_user` int(11) DEFAULT NULL,
  `cert_name` varchar(255) DEFAULT NULL,
  `cert_company` varchar(255) DEFAULT NULL,
  `cert_month_issued` varchar(30) DEFAULT NULL,
  `cert_year_issued` varchar(30) DEFAULT NULL,
  `cert_month_exp` varchar(30) DEFAULT NULL,
  `cert_year_exp` varchar(30) DEFAULT NULL,
  `cert_skills` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
ALTER TABLE `tayture3`.`certification` ADD PRIMARY KEY (`cert_id`), ADD KEY `certification_ibfk_1` (`cert_user`);
ALTER TABLE `tayture3`.`certification` MODIFY `cert_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7 ;
CREATE TABLE `tayture3`.`education` (
  `edu_id` int(11) NOT NULL,
  `edu_user` int(11) DEFAULT NULL,
  `edu_school` varchar(255) DEFAULT NULL,
  `edu_degree` varchar(255) DEFAULT NULL,
  `edu_field` varchar(255) DEFAULT NULL,
  `edu_startMonth` varchar(30) DEFAULT NULL,
  `edu_startYear` varchar(30) DEFAULT NULL,
  `edu_endMonth` varchar(30) DEFAULT NULL,
  `edu_endYear` varchar(30) DEFAULT NULL,
  `grade` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
ALTER TABLE `tayture3`.`education` ADD PRIMARY KEY (`edu_id`), ADD KEY `education_ibfk_1` (`edu_user`);
ALTER TABLE `tayture3`.`education` MODIFY `edu_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9 ;
CREATE TABLE `tayture3`.`experience` (
  `exp_id` int(11) NOT NULL,
  `exp_user` int(11) DEFAULT NULL,
  `exp_title` varchar(255) DEFAULT NULL,
  `exp_company` varchar(255) DEFAULT NULL,
  `exp_city` varchar(255) DEFAULT NULL,
  `exp_lga` varchar(255) DEFAULT NULL,
  `exp_state` varchar(255) DEFAULT NULL,
  `exp_responsibilities` varchar(1000) DEFAULT NULL,
  `exp_startMonth` varchar(30) DEFAULT NULL,
  `exp_startYear` varchar(30) DEFAULT NULL,
  `exp_endMonth` varchar(30) DEFAULT NULL,
  `exp_endYear` varchar(30) DEFAULT NULL,
  `exp_endDate` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
ALTER TABLE `tayture3`.`experience` ADD PRIMARY KEY (`exp_id`), ADD KEY `experience_ibfk_1` (`exp_user`);
ALTER TABLE `tayture3`.`experience` MODIFY `exp_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6 ;
CREATE TABLE `tayture3`.`expertise` (
  `xpert_id` int(11) NOT NULL,
  `xpert_user` int(11) DEFAULT NULL,
  `xpert_subject` varchar(50) DEFAULT NULL,
  `xpert_class` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
ALTER TABLE `tayture3`.`expertise` ADD PRIMARY KEY (`xpert_id`), ADD KEY `xpert_user` (`xpert_user`);
ALTER TABLE `tayture3`.`expertise` MODIFY `xpert_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7 ;
CREATE TABLE `tayture3`.`jobs` (
  `job_id` int(11) NOT NULL,
  `job_user` int(11) DEFAULT NULL,
  `job_sch_user` int(11) DEFAULT NULL,
  `job_title` varchar(200) DEFAULT NULL,
  `job_desc` varchar(500) DEFAULT NULL,
  `job_city` varchar(255) DEFAULT NULL,
  `job_state` varchar(255) DEFAULT NULL,
  `job_lga` varchar(255) DEFAULT NULL,
  `job_address` varchar(255) DEFAULT NULL,
  `job_min_sal` varchar(255) DEFAULT NULL,
  `job_max_sal` varchar(255) DEFAULT NULL,
  `job_qual` varchar(30) DEFAULT NULL,
  `job_exp` varchar(30) DEFAULT NULL,
  `job_exp_length` varchar(20) DEFAULT NULL,
  `job_res` varchar(2000) DEFAULT NULL,
  `job_req` varchar(2000) DEFAULT NULL,
  `job_skills` varchar(255) DEFAULT NULL,
  `job_xpertise` varchar(255) DEFAULT NULL,
  `job_deadline` date DEFAULT NULL,
  `job_no_hires` int(11) DEFAULT NULL,
  `job_submit_cover` tinyint(1) DEFAULT 0,
  `job_screen_ques` varchar(500) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
ALTER TABLE `tayture3`.`jobs` ADD PRIMARY KEY (`job_id`), ADD KEY `job_sch_user` (`job_sch_user`), ADD KEY `job_user` (`job_user`), ADD KEY `job_title` (`job_title`);
ALTER TABLE `tayture3`.`jobs` MODIFY `job_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6 ;
CREATE TABLE `tayture3`.`job_application` (
  `ja_id` int(11) NOT NULL,
  `ja_user` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
ALTER TABLE `tayture3`.`job_application` ADD PRIMARY KEY (`ja_id`), ADD KEY `ja_user` (`ja_user`);
ALTER TABLE `tayture3`.`job_application` MODIFY `ja_id` int(11) NOT NULL AUTO_INCREMENT;
CREATE TABLE `tayture3`.`matched` (
  `match_id` int(11) NOT NULL,
  `sch_id` int(11) DEFAULT NULL,
  `job_id` int(11) DEFAULT NULL,
  `matchedIds` int(11) DEFAULT NULL,
  `deadline` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
ALTER TABLE `tayture3`.`matched` ADD PRIMARY KEY (`match_id`), ADD KEY `sch_id` (`sch_id`), ADD KEY `job_id` (`job_id`), ADD KEY `matchedIds` (`matchedIds`);
ALTER TABLE `tayture3`.`matched` MODIFY `match_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5 ;
CREATE TABLE `tayture3`.`notifications` (
  `notification_id` int(11) NOT NULL,
  `notification_user` int(11) DEFAULT NULL,
  `notification_caption` varchar(50) DEFAULT NULL,
  `notification_msg` varchar(255) DEFAULT NULL,
  `notification_status` tinyint(1) DEFAULT 0,
  `notification_created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
ALTER TABLE `tayture3`.`notifications` ADD PRIMARY KEY (`notification_id`), ADD KEY `notification_user` (`notification_user`);
ALTER TABLE `tayture3`.`notifications` MODIFY `notification_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41 ;
CREATE TABLE `tayture3`.`roles` (
  `role_id` int(11) NOT NULL,
  `role_name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
ALTER TABLE `tayture3`.`roles` ADD PRIMARY KEY (`role_id`);
ALTER TABLE `tayture3`.`roles` MODIFY `role_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3 ;
CREATE TABLE `tayture3`.`schools` (
  `sch_id` int(11) NOT NULL,
  `sch_user` int(11) DEFAULT NULL,
  `sch_logo` varchar(400) DEFAULT NULL,
  `sch_name` varchar(30) DEFAULT NULL,
  `sch_no_emp` varchar(30) DEFAULT NULL,
  `sch_address` varchar(30) DEFAULT NULL,
  `sch_url` varchar(100) DEFAULT NULL,
  `sch_phone` varchar(20) DEFAULT NULL,
  `sch_verified` tinyint(1) DEFAULT 0,
  `sch_admins_str` longtext DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `wallet` longtext DEFAULT NULL,
  `sch_city` varchar(100) DEFAULT NULL,
  `sch_state` varchar(100) DEFAULT NULL,
  `sch_lga` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
ALTER TABLE `tayture3`.`schools` ADD PRIMARY KEY (`sch_id`), ADD KEY `sch_user` (`sch_user`);
ALTER TABLE `tayture3`.`schools` MODIFY `sch_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3 ;
CREATE TABLE `tayture3`.`selected` (
  `sel_id` int(11) NOT NULL,
  `sel_sch_id` int(11) DEFAULT NULL,
  `sel_job_id` int(11) DEFAULT NULL,
  `sel_user_id` int(11) DEFAULT NULL,
  `sel_interview_date` date DEFAULT NULL,
  `sel_interview_time` datetime DEFAULT NULL,
  `sel_interview_status` varchar(30) DEFAULT 'pending',
  `sel_interview_state` varchar(50) DEFAULT NULL,
  `sel_interview_city` varchar(50) DEFAULT NULL,
  `sel_interview_lga` varchar(50) DEFAULT NULL,
  `sel_interview_reason` varchar(255) DEFAULT NULL,
  `sel_interview_address` varchar(255) DEFAULT NULL,
  `sel_interview_mode` varchar(30) DEFAULT NULL,
  `sel_interview_link` varchar(255) DEFAULT NULL,
  `assesement` varchar(255) DEFAULT NULL,
  `remainder` tinyint(1) DEFAULT 0,
  `sch_hired` tinyint(4) DEFAULT 0,
  `user_hired` tinyint(4) DEFAULT 0,
  `trigger_payment` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
ALTER TABLE `tayture3`.`selected` ADD PRIMARY KEY (`sel_id`), ADD KEY `sel_sch_id` (`sel_sch_id`), ADD KEY `sel_job_id` (`sel_job_id`), ADD KEY `sel_user_id` (`sel_user_id`);
ALTER TABLE `tayture3`.`selected` MODIFY `sel_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18 ;
CREATE TABLE `tayture3`.`skilz` (
  `skilz_id` int(11) NOT NULL,
  `skilz_user` int(11) DEFAULT NULL,
  `skills` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
ALTER TABLE `tayture3`.`skilz` ADD PRIMARY KEY (`skilz_id`), ADD KEY `skilz_ibfk_1` (`skilz_user`);
ALTER TABLE `tayture3`.`skilz` MODIFY `skilz_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6 ;
CREATE TABLE `tayture3`.`testimonial` (
  `ts_id` int(11) NOT NULL,
  `ts_user` int(11) DEFAULT NULL,
  `ts_name` varchar(255) DEFAULT NULL,
  `ts_position` varchar(255) DEFAULT NULL,
  `ts_role_supervised` varchar(255) DEFAULT NULL,
  `ts_description` varchar(1000) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
ALTER TABLE `tayture3`.`testimonial` ADD PRIMARY KEY (`ts_id`), ADD KEY `ts_user` (`ts_user`);
ALTER TABLE `tayture3`.`testimonial` MODIFY `ts_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6 ;
CREATE TABLE `tayture3`.`transactions` (
  `transaction_id` int(11) NOT NULL,
  `transaction_user` int(11) DEFAULT NULL,
  `transaction_job` int(11) DEFAULT NULL,
  `transaction_sch` int(11) DEFAULT NULL,
  `transaction_amount` int(11) DEFAULT NULL,
  `transaction_deducted` tinyint(1) DEFAULT 0,
  `transaction_created_at` datetime DEFAULT current_timestamp(),
  `transaction_updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
ALTER TABLE `tayture3`.`transactions` ADD PRIMARY KEY (`transaction_id`), ADD KEY `transaction_user` (`transaction_user`), ADD KEY `transaction_sch` (`transaction_sch`), ADD KEY `transaction_job` (`transaction_job`);
ALTER TABLE `tayture3`.`transactions` MODIFY `transaction_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2 ;
CREATE TABLE `tayture3`.`users` (
  `id` int(11) NOT NULL,
  `role_id` int(11) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `cv` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `picture` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `path` longtext DEFAULT NULL,
  `available` tinyint(1) DEFAULT 0,
  `token` longtext DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `fname` varchar(255) DEFAULT NULL,
  `lname` varchar(255) DEFAULT NULL,
  `password_reset_token` varchar(255) DEFAULT NULL,
  `password_reset_expires` int(11) DEFAULT 0,
  `validation_token` varchar(255) DEFAULT NULL,
  `validated` tinyint(1) DEFAULT 0,
  `otp` varchar(10) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `lga` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `open_to_work` tinyint(1) DEFAULT 0,
  `description` varchar(300) DEFAULT NULL,
  `workplace` varchar(255) DEFAULT NULL,
  `job_location` varchar(400) DEFAULT NULL,
  `job_preference` varchar(400) DEFAULT NULL,
  `cover` varchar(255) DEFAULT NULL,
  `applied` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
ALTER TABLE `tayture3`.`users` ADD PRIMARY KEY (`id`), ADD KEY `role_id` (`role_id`);
ALTER TABLE `tayture3`.`users` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9 ;
CREATE TABLE `tayture3`.`waiting` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
ALTER TABLE `tayture3`.`waiting` ADD PRIMARY KEY (`id`), ADD KEY `email` (`email`);
ALTER TABLE `tayture3`.`waiting` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
CREATE TABLE `tayture3`.`wallets` (
  `wallet_id` int(11) NOT NULL,
  `wallet_user` int(11) DEFAULT NULL,
  `wallet_sch` int(11) DEFAULT NULL,
  `wallet_balance` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
ALTER TABLE `tayture3`.`wallets` ADD PRIMARY KEY (`wallet_id`), ADD KEY `wallet_user` (`wallet_user`), ADD KEY `wallet_sch` (`wallet_sch`);
ALTER TABLE `tayture3`.`wallets` MODIFY `wallet_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2 ;