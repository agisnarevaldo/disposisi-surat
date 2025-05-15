<?php
include "../config/koneksi.php";

if (!isset($_GET['id'])) {
    echo "ID tidak ditemukan!";
    exit;
}

$id = $_GET['id'];
$query = "SELECT * FROM tb_surat_masuk WHERE No_Agenda = '$id'";
$result = mysqli_query($conn, $query);
$data = mysqli_fetch_assoc($result);

if (!$data) {
    echo "Data tidak ditemukan!";
    exit;
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Edit Surat Masuk</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: rgb(226, 140, 55);
            padding: 20px;
        }

        .container {
            max-width: 500px;
            margin: auto;
            background: #f3f3f3;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }

        h2 {
            text-align: center;
            margin-bottom: 20px;
            color: rgb(0, 0, 0);
        }

        label {
            display: block;
            margin-top: 10px;
            font-weight: bold;
        }

        input, select {
            width: 100%;
            padding: 8px;
            margin-top: 4px;
            border-radius: 5px;
            border: 1px solid #ccc;
            box-sizing: border-box;
        }

        button {
            margin-top: 20px;
            width: 100%;
            padding: 10px;
            background-color: rgb(77, 174, 75);
            color: white;
            border: none;
            border-radius: 5px;
            font-weight: bold;
            cursor: pointer;
        }

        button:hover {
            background-color: rgb(64, 150, 62);
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Edit Surat Masuk</h2>
        <form action="update.php" method="POST" enctype="multipart/form-data">
            <input type="hidden" name="No_Agenda" value="<?= $data['No_Agenda'] ?>">

            <label>No Surat</label>
            <input type="text" name="No_Surat" value="<?= $data['No_Surat'] ?>" required>

            <label>Tanggal Surat</label>
            <input type="date" name="Tanggal_Surat" value="<?= $data['Tanggal_Surat'] ?>" required>

            <label>Diterima Tanggal</label>
            <input type="date" name="Diterima_Tgl" value="<?= $data['Diterima_Tgl'] ?>" required>

            <label>Pengirim</label>
            <input type="text" name="Pengirim" value="<?= $data['Pengirim'] ?>" required>

            <label>Hal Surat</label>
            <input type="text" name="Hal_Surat" value="<?= $data['Hal_Surat'] ?>" required>

            <label>Jenis Surat</label>
            <select name="Jenis_Surat" required>
                <option <?= ($data['Jenis_Surat'] == 'Undangan') ? 'selected' : '' ?>>Undangan</option>
                <option <?= ($data['Jenis_Surat'] == 'Pengumuman') ? 'selected' : '' ?>>Pengumuman</option>
                <option <?= ($data['Jenis_Surat'] == 'Nota Dinas') ? 'selected' : '' ?>>Nota Dinas</option>
                <option <?= ($data['Jenis_Surat'] == 'Pemberitahuan') ? 'selected' : '' ?>>Pemberitahuan</option>
            </select>

            <label>Tujuan</label>
            <input type="text" name="Tujuan" value="<?= $data['Tujuan'] ?>" required>

            <label>File Surat (kosongkan jika tidak diganti)</label>
            <input type="file" name="File_surat">

            <button type="submit">Update Surat</button>
        </form>
    </div>
</body>
</html>
