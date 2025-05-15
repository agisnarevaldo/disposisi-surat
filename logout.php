<?php
/**
 * Logout page
 * 
 * This file handles user logout and session termination.
 */

// Include required files
require_once 'includes/functions.php';
require_once 'controllers/AuthController.php';

// Log out the user
logoutUser();

// Set flash message
setFlashMessage('success', 'You have been successfully logged out.');

// Redirect to login page
redirect('login.php');
?>
