<?php
session_start();
include "config/koneksi.php";

// Ambil username dan password dari form login
$username = $_POST['username'];
$password_karyawan = md5($_POST['password_karyawan']);

// Query untuk mengecek username dan password
$cari = mysqli_query($conn, "SELECT * FROM tb_user WHERE username='$username' AND password_karyawan='$password_karyawan'");

$data = mysqli_fetch_array($cari);

// Jika data ditemukan, maka pengguna berhasil login
if (!empty($data['username'])) {
    $_SESSION['id_user'] = $data['id_user'];
    $_SESSION['username'] = $data['username'];
    $_SESSION['password_karyawan'] = $data['password_karyawan'];
    $_SESSION['nama_lengkap'] = $data['nama_lengkap'];
    $_SESSION['status'] = $data['status']; // Menyimpan level (admin atau user)

    echo "<script>alert('Berhasil Login'); window.location='beranda.php';</script>";
} else {
    echo "<script>alert('Gagal Login'); window.location='login.php';</script>";
}
?>