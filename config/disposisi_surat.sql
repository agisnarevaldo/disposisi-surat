-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 15 Bulan Mei 2025 pada 08.53
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `disposisi_surat`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `tb_surat_keluar`
--

CREATE TABLE `tb_surat_keluar` (
  `No.` int(50) NOT NULL,
  `Tgl_Surat` date NOT NULL,
  `No_Surat` varchar(50) NOT NULL,
  `Perihal` varchar(50) NOT NULL,
  `Kepada` varchar(50) NOT NULL,
  `Status` varchar(50) NOT NULL,
  `File_surat` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `tb_surat_masuk`
--

CREATE TABLE `tb_surat_masuk` (
  `No_Agenda` varchar(50) NOT NULL,
  `No_Surat` varchar(50) NOT NULL,
  `Tanggal_Surat` date NOT NULL,
  `Diterima_Tgl` date NOT NULL,
  `Pengirim` varchar(50) NOT NULL,
  `Hal_Surat` varchar(50) NOT NULL,
  `Jenis_Surat` varchar(50) NOT NULL,
  `File_surat` varchar(50) NOT NULL,
  `Tujuan` varchar(50) NOT NULL,
  `perihal` varchar(50) NOT NULL,
  `status_baca` varchar(50) NOT NULL,
  `status_tindak_lanjut` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data untuk tabel `tb_surat_masuk`
--

INSERT INTO `tb_surat_masuk` (`No_Agenda`, `No_Surat`, `Tanggal_Surat`, `Diterima_Tgl`, `Pengirim`, `Hal_Surat`, `Jenis_Surat`, `File_surat`, `Tujuan`, `perihal`, `status_baca`, `status_tindak_lanjut`) VALUES
('555', '1234', '2025-09-23', '2025-10-12', 'Badan Pusat Statistika', 'Daftar Pemasukan Tamu', 'Resmi', '1747284119_LAPORAN_IMK.pdf', 'Gedung DPRD', '', '', '');

-- --------------------------------------------------------

--
-- Struktur dari tabel `tb_user`
--

CREATE TABLE `tb_user` (
  `id_karyawan` varchar(50) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password_karyawan` varchar(50) NOT NULL,
  `nama_lengkap` varchar(50) NOT NULL,
  `Status` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `tb_user`
--

INSERT INTO `tb_user` (`id_karyawan`, `username`, `password_karyawan`, `nama_lengkap`, `Status`) VALUES
('123123', 'bunga ', '202cb962ac59075b964b07152d234b70', 'Bunga Salsabila', 'staff'),
('12345', 'aziz', '202cb962ac59075b964b07152d234b70', 'Aziz Maulana', 'kepala');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `tb_surat_keluar`
--
ALTER TABLE `tb_surat_keluar`
  ADD PRIMARY KEY (`No_Surat`);

--
-- Indeks untuk tabel `tb_surat_masuk`
--
ALTER TABLE `tb_surat_masuk`
  ADD PRIMARY KEY (`No_Agenda`);

--
-- Indeks untuk tabel `tb_user`
--
ALTER TABLE `tb_user`
  ADD PRIMARY KEY (`id_karyawan`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
