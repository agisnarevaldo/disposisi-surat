# Disposisi Surat

Proyek ini adalah aplikasi dashboard untuk manajemen surat masuk dan keluar, dibangun dengan Laravel (backend) dan React (frontend, menggunakan Inertia.js).

## Persyaratan

pastikan sudah terinstall di komputer:

- PHP >= 8.1
- Composer
- Node.js >= 18 & npm
- MySQL

## Langkah Setup

1. **Clone Repository atau Download manual**

```bash
git clone git@github.com:agisnarevaldo/disposisi-surat.git
cd disposisi-surat
```

atau download diatas pada button code, klik download zip

2. **Install Dependency Backend**

```bash
composer install
```

3. **Install Dependency Frontend**

```bash
npm install
```

4. **Copy File Environment**

```bash
cp .env.example .env
```

5. **Generate Key Aplikasi**

```bash
php artisan key:generate
```

6. **Konfigurasi Database**

Edit file `.env` dan sesuaikan pengaturan database. Contoh untuk MySQL:

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=dp_surat
DB_USERNAME=root
DB_PASSWORD=
```

buat database dp_surat, bisa menggunakan phpMyAdmin

Untuk MySQL/PostgreSQL, sesuaikan host, username, password, dan nama database.

7. **Migrasi Database & Seed Data**

```bash
php artisan migrate --seed
```

8. **Build Frontend**

```bash
npm run build
```

9. **Jalankan Server Lokal**

```bash
composer run dev
```

atau

```bash
php artisan serve
```

10. **Akses Aplikasi**

Buka browser ke `http://localhost:8000`.

## Pengembangan (Opsional)

Untuk development frontend dengan hot reload:

```bash
npm run dev
```

## Catatan

- Pastikan permission folder `storage` dan `bootstrap/cache` dapat ditulis oleh web server.
- Untuk login awal, silakan cek seeder atau buat user manual di database.
- untuk menambah user baru pada link [localhost:8000/register](http://localhost:8000/register)

---

Jika ada kendala, silakan hubungi pengelola proyek.
