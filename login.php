<?php
/**
 * Login page
 * 
 * This is the main entry point for the login process.
 * It handles both the display of the login form and the processing of login attempts.
 */

// Include required files
require_once 'includes/functions.php';
require_once 'controllers/AuthController.php';

// Start session
session_start();

// Check if user is already logged in
if (isLoggedIn()) {
    // Redirect to dashboard
    redirect('beranda.php');
}

// Process login form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $result = processLogin();

    if ($result['success']) {
        // Redirect to dashboard on successful login
        redirect($result['redirect']);
    } else {
        // Set error message for display in the view
        $error = $result['message'];
    }
}

// Move logo to assets directory if it doesn't exist
$sourceLogoPath = 'images/logobps.png';
$targetLogoPath = 'assets/images/logobps.png';

if (file_exists($sourceLogoPath) && !file_exists($targetLogoPath)) {
    // Create directory if it doesn't exist
    if (!is_dir(dirname($targetLogoPath))) {
        mkdir(dirname($targetLogoPath), 0755, true);
    }

    // Copy the logo file
    copy($sourceLogoPath, $targetLogoPath);
}

// Include the login view template
require_once 'views/login.php';
?>
