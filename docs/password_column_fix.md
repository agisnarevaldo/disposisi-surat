# Password Column Length Fix

## Issue

The application was encountering the following error during login:

```
Fatal error: Uncaught mysqli_sql_exception: Data too long for column 'password_karyawan' at row 1 in /home/gis/Development/LARAVEL/Disposisi_surat/includes/functions.php:128
```

This error occurred because:

1. The `password_karyawan` column in the `tb_user` table was defined as `VARCHAR(50)`
2. The application was using bcrypt password hashing, which produces 60-character hashes
3. When a user logged in with a legacy MD5 password, the system attempted to upgrade it to a bcrypt hash
4. The bcrypt hash was too long for the column, causing the SQL error

## Solution

The solution was to increase the length of the `password_karyawan` column to accommodate bcrypt hashes:

1. Created an SQL script (`update_password_column.sql`) to alter the table:
   ```sql
   ALTER TABLE `tb_user` 
   MODIFY COLUMN `password_karyawan` VARCHAR(255) NOT NULL;
   ```

2. Updated the database schema file (`config/disposisi_surat.sql`) to use `VARCHAR(255)` for future installations

## Implementation

To apply this fix to an existing database:

1. Run the SQL script:
   ```
   mysql -u [username] -p [database_name] < update_password_column.sql
   ```
   
   Or execute the ALTER TABLE statement directly in your database management tool.

2. The application should now be able to store bcrypt password hashes without errors.

## Why VARCHAR(255)?

We chose `VARCHAR(255)` instead of just `VARCHAR(60)` to:

1. Future-proof the database for potential changes in password hashing algorithms
2. Follow the common practice for password hash storage
3. Ensure compatibility with other PHP password hashing functions

## Related Files

- `/includes/functions.php` - Contains the `hashPassword()` function
- `/controllers/AuthController.php` - Contains the password upgrade logic
- `/config/disposisi_surat.sql` - Database schema