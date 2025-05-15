<?php
include "../config/koneksi.php";

// Cek apakah parameter ID ada
if (!isset($_GET['id'])) {
    echo "<script>alert('ID surat tidak ditemukan'); window.location='daftar_surat_keluar.php';</script>";
    exit;
}

$no_surat = $_GET['id'];

// Ambil data untuk menghapus file jika ada
$query_select = "SELECT File_surat FROM tb_surat_keluar WHERE No_Surat = ?";
$stmt = mysqli_prepare($conn, $query_select);
mysqli_stmt_bind_param($stmt, "s", $no_surat);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);
$data = mysqli_fetch_assoc($result);

if (!$data) {
    echo "<script>alert('Data surat tidak ditemukan'); window.location='daftar_surat_keluar.php';</script>";
    exit;
}

// Hapus file jika ada
if (!empty($data['File_surat'])) {
    $file_path = "../uploads/" . $data['File_surat'];
    if (file_exists($file_path)) {
        unlink($file_path);
    }
}

// Hapus data dari database
$query_delete = "DELETE FROM tb_surat_keluar WHERE No_Surat = ?";
$stmt_delete = mysqli_prepare($conn, $query_delete);
mysqli_stmt_bind_param($stmt_delete, "s", $no_surat);

if (mysqli_stmt_execute($stmt_delete)) {
    echo "<script>alert('Surat berhasil dihapus'); window.location='daftar_surat_keluar.php';</script>";
} else {
    echo "<script>alert('Gagal menghapus surat'); window.location='daftar_surat_keluar.php';</script>";
}
?>
