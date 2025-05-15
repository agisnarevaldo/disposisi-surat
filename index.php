<?php
/**
 * Index page
 * 
 * This is the main entry point for the application.
 * It redirects to the login page if the user is not logged in,
 * or to the dashboard if the user is already logged in.
 */

// Include required files
require_once 'includes/functions.php';

// Start session
session_start();

// Check if user is logged in
if (isLoggedIn()) {
    // Redirect to dashboard
    redirect('beranda.php');
} else {
    // Redirect to login page
    redirect('login.php');
}
?>
