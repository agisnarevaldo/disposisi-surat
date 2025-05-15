<?php
/**
 * Main configuration file for the Disposisi Surat application
 * 
 * This file contains all the configuration settings for the application,
 * including database connection settings, application paths, and other
 * environment-specific settings.
 */

// Define application environment
define('APP_ENV', 'development'); // Options: development, production

// Define base URL and paths
define('BASE_URL', '/'); // Base URL for the application
define('ROOT_PATH', dirname(__DIR__)); // Root path of the application

// Database configuration
$db_config = [
    'development' => [
        'host' => 'localhost',
        'user' => 'root',
        'pass' => 'root',
        'name' => 'disposisi_surat',
        'charset' => 'utf8mb4'
    ],
    'production' => [
        'host' => 'localhost',
        'user' => 'production_user',
        'pass' => 'secure_password',
        'name' => 'disposisi_surat',
        'charset' => 'utf8mb4'
    ]
];

// Get current environment configuration
$current_db_config = $db_config[APP_ENV];

// Create database connection
$conn = mysqli_connect(
    $current_db_config['host'],
    $current_db_config['user'],
    $current_db_config['pass'],
    $current_db_config['name']
);

// Check connection
if (!$conn) {
    die("Database connection failed: " . mysqli_connect_error());
}

// Set character set
mysqli_set_charset($conn, $current_db_config['charset']);

// User roles
define('ROLE_STAFF', 'staff');
define('ROLE_KEPALA', 'kepala');
define('ROLE_PMO', 'pmo');

// Application settings
define('APP_NAME', 'Disposisi Surat');
define('APP_VERSION', '1.0.0');

// Session settings
define('SESSION_LIFETIME', 3600); // 1 hour in seconds

// Error reporting
if (APP_ENV === 'development') {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
} else {
    error_reporting(0);
    ini_set('display_errors', 0);
}

// Return database connection
return $conn;
?>