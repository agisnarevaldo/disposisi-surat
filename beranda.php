<?php
/**
 * Dashboard page
 * 
 * This is the main dashboard page for the application.
 * It displays the user's available menu items based on their role.
 */

// Include required files
require_once 'includes/functions.php';
require_once 'controllers/DashboardController.php';

// Start session
session_start();

// Check if user is logged in
if (!isLoggedIn()) {
    // Redirect to login page
    redirect('login.php');
}

// Load dashboard data
$dashboard = loadDashboard();

// Include the dashboard view template
require_once 'views/dashboard.php';
?>
