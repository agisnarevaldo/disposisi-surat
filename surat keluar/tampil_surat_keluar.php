<?php
include "../config/koneksi.php";

// Proses simpan data surat keluar
if (isset($_POST['submit'])) {
    $no_surat = $_POST['No_Surat'];
    $tanggal_surat = $_POST['Tgl_Surat'];
    $perihal = $_POST['Perihal'];
    $kepada = $_POST['Kepada'];
    $status = $_POST['Status'];

    $file_name = $_FILES['File_surat']['name'];
    $file_tmp = $_FILES['File_surat']['tmp_name'];
    $upload_dir = "../uploads/";

    if (!empty($file_name)) {
        $file_name = time() . "_" . preg_replace("/[^a-zA-Z0-9.]/", "_", $file_name);
        $target_file = $upload_dir . $file_name;
        if (!move_uploaded_file($file_tmp, $target_file)) {
            echo "<script>alert('Gagal upload file!');</script>";
            $file_name = "";
        }
    } else {
        $file_name = "";
    }

    $query_input = "INSERT INTO tb_surat_keluar (No_Surat, Tgl_Surat, Perihal, Kepada, Status, File_surat)
                    VALUES ('$no_surat', '$tanggal_surat', '$perihal', '$kepada', '$status', '$file_name')";

    if (mysqli_query($conn, $query_input)) {
        echo "<script>alert('Surat berhasil disimpan'); window.location='';</script>";
    } else {
        echo "Error: " . mysqli_error($conn);
    }
}

// Pencarian berdasarkan tanggal
$tanggal_cari = isset($_GET['tanggal']) ? $_GET['tanggal'] : '';
if (!empty($tanggal_cari)) {
    $query = "SELECT * FROM tb_surat_keluar WHERE Tgl_Surat = '$tanggal_cari' ORDER BY No_Surat DESC";
} else {
    $query = "SELECT * FROM tb_surat_keluar ORDER BY No_Surat DESC";
}
$result = mysqli_query($conn, $query);
?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Daftar Surat Keluar</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: rgb(226, 140, 55);
            padding: 20px;
        }

        .container {
            max-width: 1000px;
            margin: auto;
            background: rgb(243, 243, 243);
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }

        h2 {
            text-align: center;
        }

        .logo {
            display: block;
            margin: 0 auto 20px;
            width: 100px;
            height: auto;
        }

        .top-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            margin-bottom: 20px;
        }

        .btn-kembali, .btn-tambah {
            padding: 10px 20px;
            border-radius: 4px;
            color: white;
            text-decoration: none;
            font-weight: bold;
        }

        .btn-kembali {
            background-color: #6c757d;
        }

        .btn-kembali:hover {
            background-color: #5a6268;
        }

        .btn-tambah {
            background-color: rgb(77, 174, 75);
        }

        .btn-tambah i {
            margin-right: 8px;
        }

        .btn-tambah:hover {
            background-color: rgb(64, 150, 62);
        }

        .form-cari {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-top: 10px;
        }

        .form-cari input[type="date"] {
            padding: 6px 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
        }

        .form-cari button {
            padding: 6px 12px;
            background-color: #2196F3;
            color: white;
            border: none;
            border-radius: 4px;
        }

        .form-cari button:hover {
            background-color: #1976D2;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }

        th, td {
            padding: 12px;
            border-bottom: 1px solid #ccc;
            text-align: left;
        }

        th {
            background-color: rgb(77, 174, 75);
            color: white;
        }

        tr:hover {
            background-color: rgb(193, 190, 190);
        }

        .btn {
            padding: 4px 8px;
            font-size: 12px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            text-decoration: none;
            color: white;
        }

        .btn-edit {
            background-color: #2196F3;
        }

        .btn-hapus {
            background-color: #f44336;
        }

        .btn-edit:hover {
            background-color: #1976D2;
        }

        .btn-hapus:hover {
            background-color: #d32f2f;
        }

        .aksi-buttons {
            display: flex;
            gap: 10px;
        }

        .modal {
            display: none;
            position: fixed;
            z-index: 100;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgba(0,0,0,0.4);
        }

        .modal-content {
            background-color: #fff;
            margin: 5% auto;
            padding: 20px;
            border-radius: 8px;
            width: 400px;
            position: relative;
        }

        .modal-content input,
        .modal-content select {
            width: 100%;
            padding: 8px;
            margin-bottom: 15px;
            border: 1px solid #ccc;
            border-radius: 4px;
        }

        .modal-content button {
            width: 100%;
            background-color: #4CAF50;
            color: white;
            padding: 10px;
            border: none;
            border-radius: 4px;
        }

        .close {
            color: #aaa;
            position: absolute;
            right: 15px;
            top: 10px;
            font-size: 24px;
            cursor: pointer;
        }
    </style>

    <script>
        function confirmDelete(judul) {
            return confirm("Apakah Anda yakin ingin menghapus surat: " + judul + "?");
        }

        window.onload = function() {
            const modal = document.getElementById("modalForm");
            const btn = document.getElementById("btnOpenModal");
            const span = document.getElementsByClassName("close")[0];

            btn.onclick = () => modal.style.display = "block";
            span.onclick = () => modal.style.display = "none";
            window.onclick = (event) => {
                if (event.target === modal) modal.style.display = "none";
            };
        };
    </script>
</head>
<body>
<div class="container">
    <img src="../images/logobps.png" class="logo">
    <h2>Daftar Surat Keluar</h2>

    <!-- Tambahan Fitur -->
    <div class="top-bar">
        <a href="../dashboard.php" class="btn-kembali"><i class="fa fa-arrow-left"></i></a>

        <form method="GET" class="form-cari">
            <label for="tanggal">Cari Tanggal:</label>
            <input type="date" name="tanggal" id="tanggal" value="<?= htmlspecialchars($tanggal_cari) ?>">
            <button type="submit"><i class="fa fa-search"></i> Cari</button>
        </form>
    </div>

    <!-- Tombol buka modal -->
    <a href="#" id="btnOpenModal" class="btn-tambah">
        <i class="fa-solid fa-cloud-arrow-up"></i> Upload Surat
    </a>

    <!-- Tabel Surat -->
    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>No Surat</th>
                <th>Tanggal Surat</th>
                <th>Perihal</th>
                <th>Kepada</th>
                <th>Status</th>
                <th>File</th>
                <th>Aksi</th>
            </tr>
        </thead>
        <tbody>
            <?php $no = 1; while ($data = mysqli_fetch_assoc($result)) : ?>
            <tr>
                <td><?= $no++ ?></td>
                <td><?= htmlspecialchars($data['No_Surat']) ?></td>
                <td><?= htmlspecialchars($data['Tgl_Surat']) ?></td>
                <td><?= htmlspecialchars($data['Perihal']) ?></td>
                <td><?= htmlspecialchars($data['Kepada']) ?></td>
                <td><?= htmlspecialchars($data['Status']) ?></td>
                <td>
                    <?php if (!empty($data['File_surat'])) : ?>
                        <a href="../uploads/<?= htmlspecialchars($data['File_surat']) ?>" target="_blank">View</a>
                    <?php else : ?>
                        Tidak Ada File
                    <?php endif; ?>
                </td>
                <td>
                    <div class="aksi-buttons">
                      <a href="edit.php?id=<?= urlencode($data['No_Surat']) ?>" class="btn btn-edit">Edit</a>
<a href="hapus_keluar.php?id=<?= urlencode($data['No_Surat']) ?>" class="btn btn-hapus" onclick="return confirmDelete('<?= htmlspecialchars($data['Perihal']) ?>')">Hapus</a>

                    </div>
                </td>
            </tr>
            <?php endwhile; ?>
        </tbody>
    </table>
</div>

<!-- Modal Upload -->
<div id="modalForm" class="modal">
    <div class="modal-content">
        <span class="close">&times;</span>
        <h3>Upload Surat Keluar</h3>
        <form method="POST" enctype="multipart/form-data">
            <label>No Surat</label>
            <input type="text" name="No_Surat" required>

            <label>Tanggal Surat</label>
            <input type="date" name="Tgl_Surat" required>

            <label>Perihal</label>
            <input type="text" name="Perihal" required>

            <label>Kepada</label>
            <input type="text" name="Kepada" required>

            <label>Status</label>
            <select name="Status" required>
                <option value="">-- Pilih Status --</option>
                <option value="Terkirim">Terkirim</option>
                <option value="Pending">Pending</option>
            </select>

            <label>File Surat (PDF)</label>
            <input type="file" name="File_surat" accept=".pdf">

            <button type="submit" name="submit">Simpan</button>
        </form>
    </div>
</div>
</body>
</html>
