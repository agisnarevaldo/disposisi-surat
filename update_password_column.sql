-- SQL script to update the password_karyawan column length
-- This fixes the "Data too long for column 'password_karyawan'" error

-- Alter the tb_user table to increase the password_karyawan column length
ALTER TABLE `tb_user` 
MODIFY COLUMN `password_karyawan` VARCHAR(255) NOT NULL;

-- Confirm the change
DESCRIBE `tb_user`;