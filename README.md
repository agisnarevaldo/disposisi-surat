# Disposisi Surat (Letter Disposition System)

A clean, modular, and secure PHP application for managing letter dispositions.

## Project Overview

This application is designed to manage incoming and outgoing letters for an organization, with support for different user roles (staff, kepala/head, and PMO). It includes features for tracking letters, managing users, and handling dispositions.

## Features

- Secure user authentication with modern password hashing
- Role-based access control (staff, kepala, PMO)
- Incoming and outgoing letter management
- Clean, responsive UI using Bootstrap
- Secure database operations with prepared statements
- Flash messaging system for user feedback
- Session management with security features

## Project Structure

The project follows a modular structure for better organization and maintainability:

```
Disposisi_surat/
├── assets/             # Static assets (CSS, JS, images)
├── config/             # Configuration files
├── controllers/        # Business logic
├── includes/           # Common functions and utilities
├── logs/               # Application logs
├── views/              # UI templates
├── beranda.php         # Dashboard entry point
├── index.php           # Application entry point
├── login.php           # Login entry point
├── logout.php          # Logout handler
└── README.md           # This file
```

## Installation

1. Clone the repository to your web server directory
2. Import the database schema from `config/disposisi_surat.sql`
3. Configure your database connection in `config/config.php`
4. Ensure your web server has write permissions for the `logs` directory
5. Access the application through your web browser

## Configuration

The application can be configured by editing the `config/config.php` file:

- Set the application environment (`development` or `production`)
- Configure database connection details for each environment
- Adjust session lifetime and other application settings

## User Roles

The application supports three user roles:

1. **Staff**: Basic access to view and manage letters
2. **Kepala (Head)**: Additional access to dispositions
3. **PMO**: Access to monitoring features

## Security Features

- Password hashing using bcrypt (with automatic upgrade from MD5)
- Prepared statements for all database operations
- CSRF protection for forms
- Input sanitization to prevent XSS attacks
- Secure session management

## Development

### Adding New Features

1. Create controller functions in the appropriate controller file
2. Create view templates in the `views` directory
3. Update routes in the main entry point files

### Database Operations

Use the provided database helper functions in `includes/functions.php`:

- `dbQuery()`: Execute a prepared statement
- `dbFetchRow()`: Fetch a single row
- `dbFetchAll()`: Fetch multiple rows
- `dbInsert()`: Insert a new record
- `dbUpdate()`: Update existing records
- `dbDelete()`: Delete records

## License

This project is licensed under the MIT License.