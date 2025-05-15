<?php
include "../config/koneksi.php";

// Inisialisasi filter bulan dan tahun
$filterBulan = $_GET['bulan'] ?? '';
$filterTahun = $_GET['tahun'] ?? '';

// Query data surat
$query = "SELECT * FROM tb_surat_masuk";
if (!empty($filterBulan) && !empty($filterTahun)) {
    $query .= " WHERE MONTH(Tanggal_Surat) = '$filterBulan' AND YEAR(Tanggal_Surat) = '$filterTahun'";
}
$query .= " ORDER BY No_Agenda DESC";

$result = mysqli_query($conn, $query);
?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Daftar Surat Masuk</title>
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

        .btn-tambah,
        .btn-kembali {
            display: inline-block;
            margin-bottom: 20px;
            padding: 10px 20px;
            background-color: rgb(77, 174, 75);
            color: white;
            text-decoration: none;
            border-radius: 4px;
            font-weight: bold;
        }

       .btn-kembali {
    display: inline-block;
    margin-bottom: 10px;
    padding: 4px 8px;       /* Ukuran tombol lebih kecil */
    background-color: #555;
    color: white;
    text-decoration: none;
    border-radius: 4px;
    font-weight: bold;
    font-size: 11px;        /* Ukuran font lebih kecil */
}


        .btn-kembali:hover {
            background-color: #333;
        }

        .btn-tambah i,
        .btn-kembali i {
            margin-right: 8px;
            color: white;
        }

        .btn-tambah:hover {
            background-color: rgb(60, 150, 60);
        }

        .filter-form {
            margin-bottom: 20px;
            display: flex;
            gap: 10px;
            align-items: center;
            flex-wrap: wrap;
        }

        .filter-form label {
            font-weight: bold;
        }

        .filter-form select,
        .filter-form input[type="submit"] {
            padding: 8px;
            border-radius: 4px;
            border: 1px solid #ccc;
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
    </style>

    <script>
        function confirmDelete(judul) {
            return confirm("Apakah Anda yakin ingin menghapus surat: " + judul + "?");
        }
    </script>
</head>
<body>
    <div class="container">
        <img src="../images/logobps.png" class="logo">
        <h2>Daftar Surat Masuk</h2>

        <!-- Tombol Kembali -->
      <a href="../beranda.php" class="btn-kembali" title="Kembali ke Beranda">
    <i class="fa fa-arrow-left"></i>
</a>



        <!-- Form Filter -->
        <form method="GET" class="filter-form">
            <label for="bulan">Bulan:</label>
            <select name="bulan" id="bulan" required>
                <option value="">-- Pilih Bulan --</option>
                <?php 
                for ($i = 1; $i <= 12; $i++) {
                    $selected = ($i == $filterBulan) ? 'selected' : '';
                    echo "<option value='$i' $selected>" . date('F', mktime(0, 0, 0, $i, 10)) . "</option>";
                }
                ?>
            </select>

            <label for="tahun">Tahun:</label>
            <select name="tahun" id="tahun" required>
                <option value="">-- Pilih Tahun --</option>
                <?php 
                $tahunSekarang = date('Y');
                for ($t = $tahunSekarang; $t >= $tahunSekarang - 10; $t--) {
                    $selected = ($t == $filterTahun) ? 'selected' : '';
                    echo "<option value='$t' $selected>$t</option>";
                }
                ?>
            </select>

            <input type="submit" value="Cari">
        </form>

        <!-- Tombol Upload -->
        <a href="input_surat_masuk.php" class="btn-tambah">
            <i class="fa-solid fa-cloud-arrow-up"></i> Upload Surat
        </a>

        <!-- Tabel Surat -->
        <table>
            <thead>
                <tr>
                    <th>No Agenda</th>
                    <th>No Surat</th>
                    <th>Tanggal Surat</th>
                    <th>Diterima Tgl</th>
                    <th>Pengirim</th>
                    <th>Hal Surat</th>
                    <th>Jenis Surat</th>
                    <th>File</th>
                    <th>Tujuan</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody>
                <?php if (mysqli_num_rows($result) > 0): ?>
                    <?php while ($data = mysqli_fetch_assoc($result)) : ?>
                    <tr>
                        <td><?= $data['No_Agenda'] ?></td>
                        <td><?= $data['No_Surat'] ?></td>
                        <td><?= $data['Tanggal_Surat'] ?></td>
                        <td><?= $data['Diterima_Tgl'] ?></td>
                        <td><?= $data['Pengirim'] ?></td>
                        <td><?= $data['Hal_Surat'] ?></td>
                        <td><?= $data['Jenis_Surat'] ?></td>
                        <td>
                            <?php if ($data['File_surat']) : ?>
                                <a href="../uploads/<?= $data['File_surat'] ?>" target="_blank">View</a>
                            <?php else : ?>
                                Tidak Ada File
                            <?php endif; ?>
                        </td>
                        <td><?= $data['Tujuan'] ?></td>
                        <td>
                            <div class="aksi-buttons">
                                <a href="edit.php?id=<?= $data['No_Agenda'] ?>" class="btn btn-edit">Edit</a>
                                <a href="hapus.php?id=<?= $data['No_Agenda'] ?>" class="btn btn-hapus" onclick="return confirmDelete('<?= $data['Hal_Surat'] ?>')">Hapus</a>
                            </div>
                        </td>
                    </tr>
                    <?php endwhile; ?>
                <?php else: ?>
                    <tr>
                        <td colspan="10" style="text-align:center;">Tidak ada data surat untuk bulan dan tahun yang dipilih.</td>
                    </tr>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
</body>
</html>
