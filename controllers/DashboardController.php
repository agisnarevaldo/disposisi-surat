<?php
/**
 * Dashboard Controller
 * 
 * Handles dashboard functionality and user-specific content.
 */

// Include common functions
require_once __DIR__ . '/../includes/functions.php';

/**
 * Get user information for the dashboard
 * 
 * @return array User information
 */
function getUserInfo() {
    // Check if user is logged in
    if (!isLoggedIn()) {
        return [
            'username' => 'Guest',
            'role' => '',
            'fullName' => 'Guest User'
        ];
    }
    
    // Return user information from session
    return [
        'username' => $_SESSION['username'],
        'role' => $_SESSION['status'],
        'fullName' => $_SESSION['nama_lengkap']
    ];
}

/**
 * Get available menu items based on user role
 * 
 * @param string $role User role
 * @return array Menu items
 */
function getMenuItems($role) {
    $menuItems = [];
    
    // Common menu items for all roles
    $menuItems[] = [
        'title' => 'Surat Masuk',
        'icon' => 'fas fa-inbox',
        'url' => 'surat_masuk/tampil_surat_masuk.php',
        'color' => 'blue-color'
    ];
    
    $menuItems[] = [
        'title' => 'Surat Keluar',
        'icon' => 'fas fa-paper-plane',
        'url' => 'surat_keluar/tampil_surat_keluar.php',
        'color' => 'red-color'
    ];
    
    // Role-specific menu items
    if ($role === ROLE_KEPALA || $role === 'Admin') {
        $menuItems[] = [
            'title' => 'Disposisi',
            'icon' => 'fas fa-tasks',
            'url' => 'disposisi/index.php',
            'color' => 'green-color'
        ];
    }
    
    if ($role === 'Admin') {
        $menuItems[] = [
            'title' => 'Data User',
            'icon' => 'fas fa-users',
            'url' => 'data_user.php',
            'color' => 'purple-color'
        ];
    }
    
    if ($role === ROLE_PMO) {
        $menuItems[] = [
            'title' => 'Monitoring',
            'icon' => 'fas fa-chart-line',
            'url' => 'monitoring/index.php',
            'color' => 'orange-color'
        ];
    }
    
    return $menuItems;
}

/**
 * Get dashboard statistics
 * 
 * @return array Dashboard statistics
 */
function getDashboardStats() {
    // Get counts from database
    $incomingCount = dbFetchRow("SELECT COUNT(*) as count FROM tb_surat_masuk");
    $outgoingCount = dbFetchRow("SELECT COUNT(*) as count FROM tb_surat_keluar");
    
    return [
        'incomingCount' => $incomingCount ? $incomingCount['count'] : 0,
        'outgoingCount' => $outgoingCount ? $outgoingCount['count'] : 0
    ];
}

/**
 * Load dashboard data
 * 
 * @return array Dashboard data
 */
function loadDashboard() {
    // Require login to access dashboard
    requireLogin();
    
    // Get user information
    $userInfo = getUserInfo();
    
    // Get menu items based on user role
    $menuItems = getMenuItems($userInfo['role']);
    
    // Get dashboard statistics
    $stats = getDashboardStats();
    
    return [
        'userInfo' => $userInfo,
        'menuItems' => $menuItems,
        'stats' => $stats
    ];
}