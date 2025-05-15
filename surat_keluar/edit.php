<?php
include "../config/koneksi.php";

// Tangkap id dari parameter URL
if (!isset($_GET['id'])) {
    echo "<script>alert('ID surat tidak ditemukan'); window.location='daftar_surat_keluar.php';</script>";
    exit;
}

$no_surat = $_GET['id'];

// Ambil data surat berdasarkan No_Surat
$query = "SELECT * FROM tb_surat_keluar WHERE No_Surat = ?";
$stmt = mysqli_prepare($conn, $query);
mysqli_stmt_bind_param($stmt, "s", $no_surat);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);
$data = mysqli_fetch_assoc($result);

if (!$data) {
    echo "<script>alert('Data surat tidak ditemukan'); window.location='daftar_surat_keluar.php';</script>";
    exit;
}

// Proses update data saat form disubmit
if (isset($_POST['submit'])) {
    $tanggal_surat = $_POST['Tgl_Surat'];
    $perihal = $_POST['Perihal'];
    $kepada = $_POST['Kepada'];
    $status = $_POST['Status'];

    // Handle file upload jika ada file baru diupload
    $file_name = $data['File_surat']; // default pakai nama file lama
    if (!empty($_FILES['File_surat']['name'])) {
        $file_tmp = $_FILES['File_surat']['tmp_name'];
        $upload_dir = "../uploads/";

        // Bersihkan nama file dan tambahkan timestamp agar unik
        $new_file_name = time() . "_" . preg_replace("/[^a-zA-Z0-9.]/", "_", $_FILES['File_surat']['name']);
        $target_file = $upload_dir . $new_file_name;

        if (move_uploaded_file($file_tmp, $target_file)) {
            // Jika berhasil upload, hapus file lama jika ada
            if (!empty($file_name) && file_exists($upload_dir . $file_name)) {
                unlink($upload_dir . $file_name);
            }
            $file_name = $new_file_name;
        } else {
            echo "<script>alert('Gagal upload file baru!');</script>";
        }
    }

    // Update query
    $query_update = "UPDATE tb_surat_keluar SET Tgl_Surat = ?, Perihal = ?, Kepada = ?, Status = ?, File_surat = ? WHERE No_Surat = ?";
    $stmt_update = mysqli_prepare($conn, $query_update);
    mysqli_stmt_bind_param($stmt_update, "ssssss", $tanggal_surat, $perihal, $kepada, $status, $file_name, $no_surat);

    if (mysqli_stmt_execute($stmt_update)) {
        echo "<script>alert('Data surat berhasil diupdate'); window.location='daftar_surat_keluar.php';</script>";
        exit;
    } else {
        echo "Error update: " . mysqli_error($conn);
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Edit Surat Keluar</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            padding: 20px;
            background-color:rgb(226, 140, 55) ;
        }
        form {
            background-color: white;
            max-width: 500px;
            margin: auto;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        label {
            display: block;
            margin-top: 15px;
        }
        input[type=text], input[type=date], select, input[type=file] {
            width: 100%;
            padding: 8px;
            margin-top: 5px;
            border-radius: 4px;
            border: 1px solid #ccc;
            box-sizing: border-box;
        }
        button {
            margin-top: 20px;
            padding: 10px;
            background-color: #4CAF50;
            border: none;
            color: white;
            border-radius: 4px;
            cursor: pointer;
            width: 100%;
            font-size: 16px;
        }
        a {
            display: block;
            margin-top: 20px;
            text-align: center;
            color: #555;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
        .current-file {
            margin-top: 5px;
            font-size: 14px;
            color: #333;
        }
    </style>
</head>
<body>

<h2 style="text-align:center; margin-bottom: 20px;">Edit Surat Keluar</h2>

<form method="POST" enctype="multipart/form-data">
    <label>No Surat (tidak bisa diubah)</label>
    <input type="text" name="No_Surat" value="<?= htmlspecialchars($data['No_Surat']) ?>" disabled>

    <label>Tanggal Surat</label>
    <input type="date" name="Tgl_Surat" value="<?= htmlspecialchars($data['Tgl_Surat']) ?>" required>

    <label>Perihal</label>
    <input type="text" name="Perihal" value="<?= htmlspecialchars($data['Perihal']) ?>" required>

    <label>Kepada</label>
    <input type="text" name="Kepada" value="<?= htmlspecialchars($data['Kepada']) ?>" required>

    <label>Status</label>
    <select name="Status" required>
        <option value="">-- Pilih Status --</option>
        <option value="Terkirim" <?= $data['Status'] == 'Terkirim' ? 'selected' : '' ?>>Terkirim</option>
        <option value="Pending" <?= $data['Status'] == 'Pending' ? 'selected' : '' ?>>Pending</option>
    </select>

    <label>File Surat (PDF) - Biarkan kosong jika tidak ingin mengubah file</label>
    <input type="file" name="File_surat" accept=".pdf">
    <?php if (!empty($data['File_surat'])) : ?>
        <div class="current-file">
            File saat ini: <a href="../uploads/<?= htmlspecialchars($data['File_surat']) ?>" target="_blank"><?= htmlspecialchars($data['File_surat']) ?></a>
        </div>
    <?php else : ?>
        <div class="current-file">Tidak ada file saat ini</div>
    <?php endif; ?>

    <button type="submit" name="submit">Update Surat</button>
</form>

<a href="tampil_surat_keluar.php">Kembali</a>

</body>
</html>
