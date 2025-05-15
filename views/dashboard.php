<?php
/**
 * Dashboard view template
 * 
 * This file contains the HTML for the dashboard page.
 */

// Ensure $dashboard variable is available
if (!isset($dashboard)) {
    die('Dashboard data not available');
}

// Extract dashboard data
$userInfo = $dashboard['userInfo'];
$menuItems = $dashboard['menuItems'];
$stats = $dashboard['stats'];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= APP_NAME ?> - Dashboard</title>
    <!-- Bootstrap CSS CDN -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        :root {
            --primary-color: rgb(0, 9, 171, 0.78);
            --secondary-color: rgb(67, 80, 121);
            --accent-color: rgb(255, 0, 47);
            --danger-color: rgb(254, 0, 0);
            --background-color: rgb(226, 140, 55);
            --green-color:rgb(69, 160, 73); /* Hijau */
            --blue-color: #0000FF;  /* Biru */
            --red-color: #FF0000;   /* Merah */
            --purple-color: #800080; /* Purple */
            --orange-color: #FFA500; /* Orange */
        }

        body {
            background: linear-gradient(135deg, var(--background-color) 0%, rgb(223, 111, 63) 100%);
            min-height: 100vh;
            font-family: 'Poppins', sans-serif;
        }

        .navbar {
            background: var(--green-color); /* Background navbar menjadi hijau */
            padding: 1rem 0;
            box-shadow: 0 2px 15px rgba(0, 0, 0, 0.78);
        }

        .navbar-brand {
            font-weight: 700;
            font-size: 1.5rem;
            color: white !important;
            text-transform: uppercase;
            letter-spacing: 1px;
            display: flex;
            align-items: center;
        }

        .navbar-brand img {
            width: 30px;
            height: auto;
            margin-right: 10px;
        }

        .navbar-nav .nav-link {
            color: rgba(0, 0, 0, 0.9) !important;
            font-weight: 500;
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            transition: all 0.3s ease;
        }

        .navbar-nav .nav-link:hover {
            background-color: rgba(219, 219, 219, 0.92);
            transform: translateY(-2px);
        }

        .navbar-text {
            color: white !important;
            font-weight: 500;
            background: rgba(5, 5, 5, 0.91);
            padding: 0.3rem 0.8rem;
            border-radius: 0.5rem;
            margin-right: 1rem;
            font-size: 0.9rem;
        }

        .btn-danger {
            background-color: var(--danger-color);
            border: none;
            padding: 0.4rem 1.2rem;
            font-weight: 500;
            font-size: 0.8rem;
            transition: all 0.3s ease;
        }

        .btn-danger:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.96);
        }

        .btn-sm {
            font-size: 0.8rem;
            padding: 0.3rem 0.8rem;
        }

        .dashboard-content {
            padding: 2rem 0;
        }

        .dashboard-content h2 {
            color: var(--primary-color);
            font-weight: 700;
            margin-bottom: 2rem;
            position: relative;
            padding-bottom: 0.5rem;
        }

        .dashboard-content h2:after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 50px;
            height: 3px;
            background: var(--primary-color);
            border-radius: 2px;
        }

        .card {
            border: none;
            background: white;
            border-radius: 1rem;
            padding: 2rem;
            text-align: center;
            transition: all 0.3s ease;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.78);
            height: 100%;
            min-height: 200px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background-image: url('https://cdn.pixabay.com/photo/2021/02/26/04/28/anime-6050721_960_720.png');
            background-size: cover;
            color: white;
        }

        .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 15px rgba(0, 0, 0, 0.85);
        }

        .card i {
            font-size: 3.5rem;
            margin-bottom: 1.5rem;
            transition: all 0.3s ease;
        }

        .card:hover i {
            transform: scale(1.1);
        }

        .card h5 {
            color: black;
            font-weight: 600;
            margin-top: 1rem;
            font-size: 1.25rem;
        }

        /* Custom Icon Colors */
        .card i.blue-color {
            color: var(--blue-color);
        }

        .card i.red-color {
            color: var(--red-color);
        }
        
        .card i.green-color {
            color: var(--green-color);
        }
        
        .card i.purple-color {
            color: var(--purple-color);
        }
        
        .card i.orange-color {
            color: var(--orange-color);
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
            .navbar-text {
                margin: 0.5rem 0;
            }

            .card {
                margin-bottom: 1rem;
                min-height: 180px;
            }
        }

        /* Animation for cards */
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }

            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .col-md-4 {
            animation: fadeInUp 0.5s ease forwards;
        }

        .col-md-4:nth-child(1) {
            animation-delay: 0.1s;
        }

        .col-md-4:nth-child(2) {
            animation-delay: 0.2s;
        }

        .col-md-4:nth-child(3) {
            animation-delay: 0.3s;
        }
        
        .col-md-4:nth-child(4) {
            animation-delay: 0.4s;
        }
        
        /* Flash message styling */
        .alert {
            margin-bottom: 20px;
            padding: 10px 15px;
            border-radius: 5px;
        }
        
        .alert-success {
            background-color: #d4edda;
            border-color: #c3e6cb;
            color: #155724;
        }
        
        .alert-danger {
            background-color: #f8d7da;
            border-color: #f5c6cb;
            color: #721c24;
        }
    </style>
</head>
<body>
    <nav class="navbar navbar-expand-lg navbar-dark">
        <div class="container">
            <a class="navbar-brand" href="beranda.php">
                <img src="assets/images/logobps.png" style="width: 30px; height: auto; margin-right: 10px;">
                <?= APP_NAME ?>
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <?php if ($userInfo['role'] === 'Admin'): ?>
                        <li class="nav-item">
                            <a class="nav-link" href="data_user.php">
                                <i class="fas fa-users me-1"></i> Data User
                            </a>
                        </li>
                    <?php endif; ?>
                </ul>

                <span class="navbar-text">
                    <i class="fas fa-user-circle fa-sm me-1"></i> <?= htmlspecialchars($userInfo['username']) ?>
                </span>

                <a class="btn btn-danger btn-sm" onclick="return confirm('Apakah Anda yakin ingin keluar?')"
                    href="logout.php">
                    <i class="fas fa-sign-out-alt me-1"></i> 
                </a>
            </div>
        </div>
    </nav>

    <div class="container dashboard-content">
        <?php
        // Display flash message if exists
        $flash = getFlashMessage();
        if ($flash): 
        ?>
            <div class="alert alert-<?= $flash['type'] === 'error' ? 'danger' : $flash['type'] ?>">
                <?= $flash['message'] ?>
            </div>
        <?php endif; ?>
        
        <div class="row g-6 justify-content-center mt-5">
            <?php foreach ($menuItems as $item): ?>
                <div class="col-md-4 mb-4">
                    <a href="<?= $item['url'] ?>" class="card text-decoration-none">
                        <i class="<?= $item['icon'] ?> fa-3x <?= $item['color'] ?>"></i>
                        <h5><?= $item['title'] ?></h5>
                    </a>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
    
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>