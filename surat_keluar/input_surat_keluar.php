<?php
include "../config/koneksi.php";

$message = ''; // untuk pesan sukses atau error

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Ambil data dari form
    $no_surat = $_POST['No_Surat'];
    $tanggal_surat = $_POST['Tanggal_Surat'];
    $perihal = $_POST['Perihal'];
    $kepada = $_POST['Kepada'];
    $status = $_POST['Status'];

    // File upload handling
    $file_name = $_FILES['File_surat']['name'];
    $file_tmp = $_FILES['File_surat']['tmp_name'];
    $upload_dir = "../uploads/";

    // Simpan file jika ada
    if (!empty($file_name)) {
        // Membuat nama file unik untuk menghindari konflik
        $file_name = time() . "_" . preg_replace("/[^a-zA-Z0-9.]/", "_", $file_name);
        $target_file = $upload_dir . $file_name;

        // Pindahkan file ke direktori uploads
        if (!move_uploaded_file($file_tmp, $target_file)) {
            $message = "Gagal upload file!";
            $file_name = ""; // Reset jika file gagal diupload
        }
    } else {
        $file_name = ""; // Jika tidak ada file yang diupload
    }

    // Pastikan semua kolom diisi
    if (empty($no_surat) || empty($tanggal_surat) || empty($perihal) || empty($kepada) || empty($status)) {
        $message = "Semua kolom harus diisi!";
    } elseif ($message == '') { // lanjut jika tidak ada error upload
        // Menyiapkan query SQL untuk menyimpan data surat_keluar
        $query = "INSERT INTO tb_surat_keluar (No_Surat, Tanggal_Surat, Perihal, Kepada, Status, File_surat)
                  VALUES ('$no_surat', '$tanggal_surat', '$perihal', '$kepada', '$status', '$file_name')";

        // Menjalankan query dan cek apakah berhasil
        if (mysqli_query($conn, $query)) {
            $message = "Surat berhasil disimpan.";
            // Bersihkan form jika perlu, atau redirect manual
            // Bisa juga redirect setelah beberapa detik pakai header refresh
        } else {
            $message = "Error: " . mysqli_error($conn);
        }
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Input Surat Keluar</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #ececec;
            padding: 20px;
        }

        .container {
            max-width: 600px;
            margin: auto;
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }

        h2 {
            text-align: center;
        }

        label {
            font-weight: bold;
        }

        input, select {
            width: 100%;
            padding: 10px;
            margin: 10px 0 20px;
            border: 1px solid #ccc;
            border-radius: 4px;
        }

        button {
            background-color: #4CAF50;
            color: white;
            padding: 12px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            width: 100%;
            font-weight: bold;
        }

        button:hover {
            background-color: #45a049;
        }

        a.back-link {
            display: inline-block;
            margin-top: 10px;
            color: #333;
            text-decoration: none;
        }

        a.back-link:hover {
            text-decoration: underline;
        }

        .message {
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 5px;
        }

        .message.error {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }

        .message.success {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
    </style>
</head>
<body>
<div class="container">
    <h2>Form Input Surat Keluar</h2>

    <?php if (!empty($message)): ?>
        <div class="message <?php echo strpos($message, 'berhasil') !== false ? 'success' : 'error'; ?>">
            <?php echo $message; ?>
        </div>
    <?php endif; ?>

    <form method="POST" enctype="multipart/form-data">
        <label>No Surat</label>
        <input type="text" name="No_Surat" required value="<?php echo isset($_POST['No_Surat']) ? htmlspecialchars($_POST['No_Surat']) : ''; ?>">

        <label>Tanggal Surat</label>
        <input type="date" name="Tanggal_Surat" required value="<?php echo isset($_POST['Tanggal_Surat']) ? htmlspecialchars($_POST['Tanggal_Surat']) : ''; ?>">

        <label>Perihal</label>
        <input type="text" name="Perihal" required value="<?php echo isset($_POST['Perihal']) ? htmlspecialchars($_POST['Perihal']) : ''; ?>">

        <label>Kepada</label>
        <input type="text" name="Kepada" required value="<?php echo isset($_POST['Kepada']) ? htmlspecialchars($_POST['Kepada']) : ''; ?>">

        <label>Status</label>
        <select name="Status" required>
            <option value="">-- Pilih Status --</option>
            <option value="Terkirim" <?php if(isset($_POST['Status']) && $_POST['Status'] == 'Terkirim') echo 'selected'; ?>>Terkirim</option>
            <option value="Pending" <?php if(isset($_POST['Status']) && $_POST['Status'] == 'Pending') echo 'selected'; ?>>Pending</option>
        </select>

        <label>Upload File (PDF)</label>
        <input type="file" name="File_surat" accept=".pdf">

        <button type="submit">Simpan Surat</button>
    </form>
    <a href="daftar_surat_keluar.php" class="back-link">← Kembali ke daftar surat</a>
</div>
</body>
</html>
