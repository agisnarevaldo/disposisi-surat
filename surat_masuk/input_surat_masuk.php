<?php
include "../config/koneksi.php";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $no_agenda      = mysqli_real_escape_string($conn, $_POST['No_Agenda']);
    $no_surat       = mysqli_real_escape_string($conn, $_POST['No_Surat']);
    $tanggal_surat  = mysqli_real_escape_string($conn, $_POST['Tanggal_Surat']);
    $diterima_tgl   = mysqli_real_escape_string($conn, $_POST['Diterima_Tgl']);
    $pengirim       = mysqli_real_escape_string($conn, $_POST['Pengirim']);
    $hal_surat      = mysqli_real_escape_string($conn, $_POST['Hal_Surat']);
    $jenis_surat    = mysqli_real_escape_string($conn, $_POST['Jenis_Surat']);
    $tujuan         = mysqli_real_escape_string($conn, $_POST['Tujuan']);

    $file_to_save = null;
    $upload_dir = "uploads/";


    // Proses file jika diupload
    if (isset($_FILES['File_surat']) && $_FILES['File_surat']['error'] === UPLOAD_ERR_OK) {
        $file_name = $_FILES['File_surat']['name'];
        $tmp_name = $_FILES['File_surat']['tmp_name'];
        $file_ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
        $allowed_ext = ['pdf'];

        if (!in_array($file_ext, $allowed_ext)) {
            echo "<script>alert('Hanya file PDF yang diperbolehkan!'); window.history.back();</script>";
            exit;
        }

        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0755, true);
        }

        $safe_file_name = time() . '_' . preg_replace('/[^a-zA-Z0-9_\-\.]/', '_', $file_name);

        if (move_uploaded_file($tmp_name, $upload_dir . $safe_file_name)) {
            $file_to_save = $safe_file_name;
        } else {
            echo "<script>alert('Gagal mengupload file!'); window.history.back();</script>";
            exit;
        }
    }

    $query = "INSERT INTO tb_surat_masuk 
        (No_Agenda, No_Surat, Tanggal_Surat, Diterima_Tgl, Pengirim, Hal_Surat, Jenis_Surat, File_surat, Tujuan) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

    $stmt = mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt, "sssssssss", 
        $no_agenda, $no_surat, $tanggal_surat, $diterima_tgl, $pengirim, $hal_surat, $jenis_surat, $file_to_save, $tujuan
    );

    if (mysqli_stmt_execute($stmt)) {
        echo "<script>alert('Data berhasil disimpan!'); window.location.href='tampil_surat_masuk.php';</script>";
    } else {
        echo "Gagal menyimpan data: " . mysqli_error($conn);
    }

    mysqli_stmt_close($stmt);
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Input Surat Masuk</title>
    <meta charset="UTF-8">
    <style>
    body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: rgb(226, 140, 55);
        margin: 0;
        padding: 0;
    }

    .container {
        max-width: 700px; /* Lebar form dikurangi sedikit */
        background-color: #fff;
        margin: 40px auto;
        padding: 25px 35px; /* Padding lebih kecil */
        border-radius: 8px;
        box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
    }

    h2 {
        text-align: center;
        color:rgb(0, 0, 0); /* darkslategray */
        margin-bottom: 20px; /* Lebih kecil sedikit */
    }

    form {
        display: flex;
        flex-direction: column;
    }

    label {
        margin-top: 10px; /* Lebih kecil */
        font-weight: 600;
        color: #333;
    }

    input[type="text"],
    input[type="date"],
    select,
    input[type="file"] {
        padding: 8px 10px; /* Padding lebih kecil */
        margin-top: 5px;
        font-size: 14px; /* Ukuran font lebih kecil */
        border: 1px solid #ccc;
        border-radius: 6px;
        outline-color: #4dae4b;
    }

    button[type="submit"] {
        margin-top: 20px; /* Lebih kecil */
        padding: 10px;
        font-size: 15px; /* Ukuran font lebih kecil */
        background-color: #4dae4b;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    button[type="submit"]:hover {
        background-color: #3a8a3a;
    }
</style>
</head>
<body>
    <h2>Form Input Surat Masuk</h2>
    
       <!-- Tombol Kembali -->
      <a href="../beranda.php" class="btn-kembali" title="Kembali ke Beranda">
    <i class="fa fa-arrow-left"></i>
</a>
    <div class="container">
        <form method="POST" enctype="multipart/form-data">
            <label>No Agenda:</label>
            <input type="text" name="No_Agenda" required>

            <label>No Surat:</label>
            <input type="text" name="No_Surat" required>

            <label>Tanggal Surat:</label>
            <input type="date" name="Tanggal_Surat" required>

            <label>Tanggal Diterima:</label>
            <input type="date" name="Diterima_Tgl" required>

            <label>Pengirim:</label>
            <input type="text" name="Pengirim" required>

            <label>Hal Surat:</label>
            <input type="text" name="Hal_Surat" required>

            <label>Jenis Surat:</label>
            <select name="Jenis_Surat" required>
                <option value="">-- Pilih Jenis --</option>
                <option value="Pribadi">Pribadi</option>
                <option value="Resmi">Resmi</option>
                <option value="Internal">Internal</option>
            </select>

            <label>Tujuan:</label>
            <input type="text" name="Tujuan" required>

            <label>File Surat (PDF):</label>
            <input type="file" name="File_surat" accept="application/pdf">

            <button type="submit">Simpan</button>
        </form>
    </div>
</body>
</html>
