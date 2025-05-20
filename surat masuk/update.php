<?php
include "../config/koneksi.php";

$No_Agenda = $_POST['No_Agenda'];
$No_Surat = $_POST['No_Surat'];
$Tanggal_Surat = $_POST['Tanggal_Surat'];
$Diterima_Tgl = $_POST['Diterima_Tgl'];
$Pengirim = $_POST['Pengirim'];
$Hal_Surat = $_POST['Hal_Surat'];
$Jenis_Surat = $_POST['Jenis_Surat'];
$Tujuan = $_POST['Tujuan'];

$fileName = $_FILES['File_surat']['name'];

if ($fileName != "") {
    $targetDir = "../uploads/";
    $targetFile = $targetDir . basename($fileName);
    move_uploaded_file($_FILES['File_surat']['tmp_name'], $targetFile);

    $query = "UPDATE tb_surat_masuk SET 
        No_Surat='$No_Surat',
        Tanggal_Surat='$Tanggal_Surat',
        Diterima_Tgl='$Diterima_Tgl',
        Pengirim='$Pengirim',
        Hal_Surat='$Hal_Surat',
        Jenis_Surat='$Jenis_Surat',
        Tujuan='$Tujuan',
        File_surat='$fileName'
        WHERE No_Agenda='$No_Agenda'";
} else {
    $query = "UPDATE tb_surat_masuk SET 
        No_Surat='$No_Surat',
        Tanggal_Surat='$Tanggal_Surat',     
        Diterima_Tgl='$Diterima_Tgl',
        Pengirim='$Pengirim',
        Hal_Surat='$Hal_Surat',
        Jenis_Surat='$Jenis_Surat',
        Tujuan='$Tujuan'
        WHERE No_Agenda='$No_Agenda'";
}

mysqli_query($conn, $query);

header("Location: tampil_surat_masuk.php");
?>
