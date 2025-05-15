<?php
include "../config/koneksi.php";

if (isset($_GET['id'])) {
    $id = $_GET['id'];

    // Ambil file surat
    $getFile = mysqli_query($conn, "SELECT File_surat FROM tb_surat_masuk WHERE No_Agenda = '$id'");
    $data = mysqli_fetch_assoc($getFile);
    if ($data && $data['File_surat']) {
        $filePath = "../uploads/" . $data['File_surat'];
        if (file_exists($filePath)) {
            unlink($filePath); // Hapus file dari server
        }
    }

    $query = "DELETE FROM tb_surat_masuk WHERE No_Agenda = '$id'";
    mysqli_query($conn, $query);
}

header("Location: tampil_surat_masuk.php");
?>
