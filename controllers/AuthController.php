<?php
/**
 * Authentication Controller
 * 
 * Handles user authentication, login, logout, and session management.
 */

// Include common functions
require_once __DIR__ . '/../includes/functions.php';

/**
 * Authenticate a user with username and password
 * 
 * @param string $username The username
 * @param string $password The password
 * @return array|bool User data if authentication is successful, false otherwise
 */
function authenticateUser($username, $password) {
    // Sanitize inputs
    $username = sanitize($username);
    
    // First, check if the user exists
    $user = dbFetchRow(
        "SELECT * FROM tb_user WHERE username = ?",
        [$username]
    );
    
    if (!$user) {
        return false;
    }
    
    // Check if the password is stored as MD5 (legacy)
    if (strlen($user['password_karyawan']) === 32) {
        // Legacy MD5 password
        $passwordMatch = (md5($password) === $user['password_karyawan']);
        
        // If match, update to new password hash for future logins
        if ($passwordMatch) {
            $newHash = hashPassword($password);
            dbUpdate(
                'tb_user',
                ['password_karyawan' => $newHash],
                'id_karyawan = ?',
                [$user['id_karyawan']]
            );
            
            // Update the user data with the new hash
            $user['password_karyawan'] = $newHash;
        }
    } else {
        // Modern password hash
        $passwordMatch = verifyPassword($password, $user['password_karyawan']);
    }
    
    return $passwordMatch ? $user : false;
}

/**
 * Log in a user and create a session
 * 
 * @param array $user The user data
 * @return void
 */
function loginUser($user) {
    // Start session if not already started
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    
    // Set session variables
    $_SESSION['id_user'] = $user['id_karyawan'];
    $_SESSION['username'] = $user['username'];
    $_SESSION['nama_lengkap'] = $user['nama_lengkap'];
    $_SESSION['status'] = $user['Status'];
    
    // Set last activity time
    $_SESSION['last_activity'] = time();
    
    // Regenerate session ID for security
    session_regenerate_id(true);
    
    // Log the login
    logUserActivity($user['id_karyawan'], 'login');
}

/**
 * Log out a user and destroy the session
 * 
 * @return void
 */
function logoutUser() {
    // Start session if not already started
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    
    // Log the logout if user is logged in
    if (isset($_SESSION['id_user'])) {
        logUserActivity($_SESSION['id_user'], 'logout');
    }
    
    // Unset all session variables
    $_SESSION = [];
    
    // Destroy the session cookie
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(
            session_name(),
            '',
            time() - 42000,
            $params["path"],
            $params["domain"],
            $params["secure"],
            $params["httponly"]
        );
    }
    
    // Destroy the session
    session_destroy();
}

/**
 * Check if the session is valid and not expired
 * 
 * @return bool True if the session is valid, false otherwise
 */
function validateSession() {
    // Start session if not already started
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    
    // Check if user is logged in
    if (!isLoggedIn()) {
        return false;
    }
    
    // Check if session has expired
    if (isset($_SESSION['last_activity']) && (time() - $_SESSION['last_activity'] > SESSION_LIFETIME)) {
        // Session expired, log out the user
        logoutUser();
        return false;
    }
    
    // Update last activity time
    $_SESSION['last_activity'] = time();
    
    return true;
}

/**
 * Log user activity
 * 
 * @param string $userId The user ID
 * @param string $action The action performed
 * @return void
 */
function logUserActivity($userId, $action) {
    // This is a placeholder for a more comprehensive logging system
    // In a real application, you might log to a database or file
    $logMessage = date('Y-m-d H:i:s') . " - User ID: $userId - Action: $action" . PHP_EOL;
    
    // For now, just append to a log file
    $logFile = __DIR__ . '/../logs/user_activity.log';
    
    // Create logs directory if it doesn't exist
    if (!is_dir(dirname($logFile))) {
        mkdir(dirname($logFile), 0755, true);
    }
    
    file_put_contents($logFile, $logMessage, FILE_APPEND);
}

/**
 * Process login form submission
 * 
 * @return array Result of the login attempt
 */
function processLogin() {
    $result = [
        'success' => false,
        'message' => '',
        'redirect' => ''
    ];
    
    // Check if form was submitted
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        $result['message'] = 'Invalid request method';
        return $result;
    }
    
    // Validate CSRF token
    if (!isset($_POST['csrf_token']) || !verifyCsrfToken($_POST['csrf_token'])) {
        $result['message'] = 'Invalid security token';
        return $result;
    }
    
    // Get form data
    $username = $_POST['username'] ?? '';
    $password = $_POST['password_karyawan'] ?? '';
    
    // Validate form data
    if (empty($username) || empty($password)) {
        $result['message'] = 'Username and password are required';
        return $result;
    }
    
    // Authenticate user
    $user = authenticateUser($username, $password);
    
    if ($user) {
        // Login successful
        loginUser($user);
        
        $result['success'] = true;
        $result['message'] = 'Login successful';
        $result['redirect'] = 'beranda.php';
        
        // Set flash message
        setFlashMessage('success', 'Welcome back, ' . $user['nama_lengkap'] . '!');
    } else {
        // Login failed
        $result['message'] = 'Invalid username or password';
        
        // Set flash message
        setFlashMessage('error', 'Invalid username or password');
    }
    
    return $result;
}