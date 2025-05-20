<?php
session_start();
if (
    !empty($_SESSION['username']) and
    !empty($_SESSION['password_karyawan'])
) {
    header("location:login.php");
} else {
    ?>
    <!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Disposisi Tugas</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

            body {
                background: linear-gradient(135deg, rgb(201, 121, 87), rgb(223, 111, 63));
                font-family: 'Roboto', sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                color: #000;
            }

            .login-card {
                background: rgb(243, 243, 243);
                padding: 40px;
                border-radius: 10px;
                box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
                width: 100%;
                max-width: 400px;
                text-align: center;
                color: #000;
            }

            .login-card h4 {
                margin-bottom: 20px;
                font-weight: bold;
            }

            .login-card .form-control {
                border: 1px solid rgb(95, 142, 223);
                border-radius: 5px;
                padding: 10px;
                font-size: 1rem;
                margin-bottom: 20px;
                background: #fff;
                color: #000;
                transition: all 0.3s ease;
            }

            .login-card .form-control:focus {
                border-color: rgb(95, 142, 223);
                box-shadow: 0 0 10px rgba(95, 142, 223, 0.5);
                background-color: #fff;
                color: #000;
            }

            .login-card .btn-primary {
                border: none;
                background: linear-gradient(135deg, rgba(34, 40, 238, 0.73), rgba(34, 40, 238, 0.73));
                padding: 12px;
                border-radius: 5px;
                font-size: 1.1rem;
                color: white;
                transition: all 0.3s ease;
                width: 100%;
            }

            .login-card .btn-primary:hover {
                background: linear-gradient(135deg, #6a11cb, #2575fc);
                box-shadow: 0 5px 15px rgba(232, 123, 46);
            }

            .login-card .form-label {
                font-size: 1rem;
                font-weight: 600;
            }

            .login-card p {
                margin-top: 20px;
                font-size: 0.9rem;
            }

            .login-card a {
                color: #000;
                text-decoration: none;
            }

            .login-card a:hover {
                color: rgb(50, 232, 62);
                text-decoration: underline;
            }
        </style>
    </head>

    <body>
        <div class="login-card">
            <img src="images/logobps.png"
                alt="Logo BPS" 
                style="width: 100px; margin-bottom: 20px;">
            <h4>Badan Pusat Statistika</h4>
            <form method="POST" action="cek_login.php">
                <div class="mb-3">
                    <label for="username" class="form-label">Username:</label>
                    <input type="text" name="username" class="form-control" id="username"
                        placeholder="Masukkan Username" required>
                </div>
                <div class="mb-3">
                    <label for="password_karyawan" class="form-label">Password:</label>
                    <input type="password" name="password_karyawan" class="form-control" id="password_karyawan"
                        placeholder="Masukkan Password" required>
                </div>
                <div class="mb-3">
                    <button type="submit" class="btn btn-primary">Login</button>
                </div>
                
            </form>
        </div>
    </body>

    </html>
<?php
}
?>
