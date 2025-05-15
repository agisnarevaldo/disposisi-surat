<?php
/**
 * Common functions for the Disposisi Surat application
 * 
 * This file contains utility functions, authentication helpers,
 * and other shared functionality used throughout the application.
 */

// Include configuration
$conn = require_once __DIR__ . '/../config/config.php';

/**
 * Redirect to a specified URL
 * 
 * @param string $url The URL to redirect to
 * @return void
 */
function redirect($url) {
    header("Location: " . BASE_URL . ltrim($url, '/'));
    exit;
}

/**
 * Sanitize user input to prevent XSS attacks
 * 
 * @param string $input The input to sanitize
 * @return string The sanitized input
 */
function sanitize($input) {
    return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
}

/**
 * Check if a user is logged in
 * 
 * @return bool True if the user is logged in, false otherwise
 */
function isLoggedIn() {
    return isset($_SESSION['id_user']) && !empty($_SESSION['username']);
}

/**
 * Check if a user has a specific role
 * 
 * @param string|array $roles The role(s) to check
 * @return bool True if the user has the specified role, false otherwise
 */
function hasRole($roles) {
    if (!isLoggedIn()) {
        return false;
    }
    
    if (!is_array($roles)) {
        $roles = [$roles];
    }
    
    return in_array($_SESSION['status'], $roles);
}

/**
 * Require authentication to access a page
 * 
 * @param string|array $roles Optional. The role(s) required to access the page
 * @return void
 */
function requireLogin($roles = null) {
    if (!isLoggedIn()) {
        $_SESSION['error'] = 'You must be logged in to access this page.';
        redirect('login.php');
    }
    
    if ($roles !== null && !hasRole($roles)) {
        $_SESSION['error'] = 'You do not have permission to access this page.';
        redirect('beranda.php');
    }
}

/**
 * Display a flash message
 * 
 * @param string $type The type of message (success, error, warning, info)
 * @param string $message The message to display
 * @return void
 */
function setFlashMessage($type, $message) {
    $_SESSION['flash'] = [
        'type' => $type,
        'message' => $message
    ];
}

/**
 * Get and clear flash message
 * 
 * @return array|null The flash message or null if none exists
 */
function getFlashMessage() {
    if (isset($_SESSION['flash'])) {
        $flash = $_SESSION['flash'];
        unset($_SESSION['flash']);
        return $flash;
    }
    return null;
}

/**
 * Execute a database query with prepared statements
 * 
 * @param string $sql The SQL query to execute
 * @param array $params The parameters to bind to the query
 * @param string $types The types of the parameters (i=integer, s=string, d=double, b=blob)
 * @return mysqli_stmt The prepared statement
 */
function dbQuery($sql, $params = [], $types = '') {
    global $conn;
    
    $stmt = mysqli_prepare($conn, $sql);
    
    if (!empty($params)) {
        // Generate types string if not provided
        if (empty($types)) {
            $types = str_repeat('s', count($params));
        }
        
        mysqli_stmt_bind_param($stmt, $types, ...$params);
    }
    
    mysqli_stmt_execute($stmt);
    
    return $stmt;
}

/**
 * Fetch a single row from a database query
 * 
 * @param string $sql The SQL query to execute
 * @param array $params The parameters to bind to the query
 * @param string $types The types of the parameters
 * @return array|null The fetched row or null if none exists
 */
function dbFetchRow($sql, $params = [], $types = '') {
    $stmt = dbQuery($sql, $params, $types);
    $result = mysqli_stmt_get_result($stmt);
    $row = mysqli_fetch_assoc($result);
    mysqli_stmt_close($stmt);
    
    return $row;
}

/**
 * Fetch all rows from a database query
 * 
 * @param string $sql The SQL query to execute
 * @param array $params The parameters to bind to the query
 * @param string $types The types of the parameters
 * @return array The fetched rows
 */
function dbFetchAll($sql, $params = [], $types = '') {
    $stmt = dbQuery($sql, $params, $types);
    $result = mysqli_stmt_get_result($stmt);
    $rows = [];
    
    while ($row = mysqli_fetch_assoc($result)) {
        $rows[] = $row;
    }
    
    mysqli_stmt_close($stmt);
    
    return $rows;
}

/**
 * Insert a row into a database table
 * 
 * @param string $table The table to insert into
 * @param array $data The data to insert (column => value)
 * @return int|bool The inserted ID or false on failure
 */
function dbInsert($table, $data) {
    global $conn;
    
    $columns = implode(', ', array_keys($data));
    $placeholders = implode(', ', array_fill(0, count($data), '?'));
    $values = array_values($data);
    
    $sql = "INSERT INTO $table ($columns) VALUES ($placeholders)";
    $stmt = dbQuery($sql, $values);
    
    $result = mysqli_stmt_affected_rows($stmt) > 0;
    $insertId = $result ? mysqli_insert_id($conn) : false;
    
    mysqli_stmt_close($stmt);
    
    return $insertId;
}

/**
 * Update a row in a database table
 * 
 * @param string $table The table to update
 * @param array $data The data to update (column => value)
 * @param string $where The WHERE clause
 * @param array $whereParams The parameters for the WHERE clause
 * @return bool True on success, false on failure
 */
function dbUpdate($table, $data, $where, $whereParams = []) {
    $set = [];
    foreach (array_keys($data) as $column) {
        $set[] = "$column = ?";
    }
    
    $sql = "UPDATE $table SET " . implode(', ', $set) . " WHERE $where";
    $params = array_merge(array_values($data), $whereParams);
    
    $stmt = dbQuery($sql, $params);
    $result = mysqli_stmt_affected_rows($stmt) > 0;
    
    mysqli_stmt_close($stmt);
    
    return $result;
}

/**
 * Delete a row from a database table
 * 
 * @param string $table The table to delete from
 * @param string $where The WHERE clause
 * @param array $params The parameters for the WHERE clause
 * @return bool True on success, false on failure
 */
function dbDelete($table, $where, $params = []) {
    $sql = "DELETE FROM $table WHERE $where";
    $stmt = dbQuery($sql, $params);
    $result = mysqli_stmt_affected_rows($stmt) > 0;
    
    mysqli_stmt_close($stmt);
    
    return $result;
}

/**
 * Hash a password using bcrypt
 * 
 * @param string $password The password to hash
 * @return string The hashed password
 */
function hashPassword($password) {
    return password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
}

/**
 * Verify a password against a hash
 * 
 * @param string $password The password to verify
 * @param string $hash The hash to verify against
 * @return bool True if the password is correct, false otherwise
 */
function verifyPassword($password, $hash) {
    return password_verify($password, $hash);
}

/**
 * Generate a CSRF token
 * 
 * @return string The CSRF token
 */
function generateCsrfToken() {
    if (!isset($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    
    return $_SESSION['csrf_token'];
}

/**
 * Verify a CSRF token
 * 
 * @param string $token The token to verify
 * @return bool True if the token is valid, false otherwise
 */
function verifyCsrfToken($token) {
    return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
}