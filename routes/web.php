<?php

use App\Http\Controllers\SuratKeluarController;
use App\Http\Controllers\SuratMasukController;
use App\Http\Controllers\DashboardKepalaController;
use App\Http\Controllers\DashboardPMOController;
use App\Http\Controllers\DashboardStaffController;
use App\Http\Controllers\AdminDashboardController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('home');

// Dashboard untuk user non-admin
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Route untuk admin
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

    // Route untuk surat masuk admin
    Route::get('/surat-masuk', [SuratMasukController::class, 'adminIndex'])->name('surat-masuk.index');
    Route::get('/surat-masuk/create', [SuratMasukController::class, 'create'])->name('surat-masuk.create');
    Route::post('/surat-masuk', [SuratMasukController::class, 'store'])->name('surat-masuk.store');
    Route::get('/surat-masuk/{id}', [SuratMasukController::class, 'show'])->name('surat-masuk.show');
    Route::get('/surat-masuk/{id}/edit', [SuratMasukController::class, 'edit'])->name('surat-masuk.edit');
    Route::put('/surat-masuk/{id}', [SuratMasukController::class, 'update'])->name('surat-masuk.update');
    Route::delete('/surat-masuk/{id}', [SuratMasukController::class, 'destroy'])->name('surat-masuk.destroy');
    
    // Route untuk workflow - pengajuan surat ke user dengan privilege
    Route::get('/surat-masuk/{id}/ajukan', [SuratMasukController::class, 'showAjukan'])->name('surat-masuk.ajukan');
    Route::post('/surat-masuk/{id}/ajukan-ke-user', [SuratMasukController::class, 'ajukanKeUser'])->name('surat-masuk.ajukan-ke-user');
    Route::post('/surat-masuk/{id}/mark-as-read', [SuratMasukController::class, 'markAsRead'])->name('surat-masuk.mark-as-read');
    Route::post('/surat-masuk/{id}/mark-as-unread', [SuratMasukController::class, 'markAsUnread'])->name('surat-masuk.mark-as-unread');
    Route::get('/surat-masuk/{id}/download', [SuratMasukController::class, 'downloadFile'])->name('surat-masuk.download');

    // Route untuk manajemen user
    Route::resource('users', App\Http\Controllers\UserManagementController::class);
    Route::post('/users/{id}/toggle-privilege', [App\Http\Controllers\UserManagementController::class, 'togglePrivilege'])->name('users.toggle-privilege');
});

// Route untuk kepala
Route::middleware(['auth', 'kepala'])->prefix('kepala')->name('kepala.')->group(function () {
    Route::get('/dashboard', [App\Http\Controllers\DisposisiController::class, 'dashboardKepala'])->name('dashboard');

    // Route untuk disposisi surat masuk
    Route::get('/disposisi', [App\Http\Controllers\DisposisiController::class, 'indexKepala'])->name('disposisi.index');
    Route::get('/disposisi/{id}', [App\Http\Controllers\DisposisiController::class, 'showKepala'])->name('disposisi.show');
    Route::post('/disposisi/{id}/to-user', [App\Http\Controllers\DisposisiController::class, 'disposisiKeUser'])->name('disposisi.to-user');

    // Route untuk riwayat disposisi
    Route::get('/riwayat', [App\Http\Controllers\DisposisiController::class, 'riwayatKepala'])->name('riwayat.index');
});

// Route untuk PMO
Route::middleware(['auth', 'pmo'])->prefix('pmo')->name('pmo.')->group(function () {
    Route::get('/dashboard', [App\Http\Controllers\DisposisiController::class, 'dashboardPmo'])->name('dashboard');

    // Route untuk disposisi surat masuk
    Route::get('/disposisi', [App\Http\Controllers\DisposisiController::class, 'indexPmo'])->name('disposisi.index');
    Route::get('/disposisi/{id}', [App\Http\Controllers\DisposisiController::class, 'showPmo'])->name('disposisi.show');
    Route::post('/disposisi/{id}/to-pegawai', [App\Http\Controllers\DisposisiController::class, 'disposisiToPegawai'])->name('disposisi.to-pegawai');
    
    // Route untuk delegasi ke pegawai tanpa privilege
    Route::get('/disposisi/{id}/delegasi', [App\Http\Controllers\DisposisiController::class, 'showDelegasi'])->name('disposisi.delegasi');
    Route::post('/disposisi/{id}/delegasi-ke-non-privilege', [App\Http\Controllers\DisposisiController::class, 'delegasiKeNonPrivilege'])->name('disposisi.delegasi-ke-non-privilege');

    // Route untuk laporan dan monitoring
    Route::get('/laporan', function () {
        return Inertia::render('pmo/laporan/index');
    })->name('laporan.index');
});

// Route untuk Pegawai
Route::middleware(['auth', 'pegawai'])->prefix('pegawai')->name('pegawai.')->group(function () {
    Route::get('/dashboard', [App\Http\Controllers\DisposisiController::class, 'dashboardPegawai'])->name('dashboard');

    // Route untuk tugas disposisi (privileged pegawai)
    Route::get('/tugas', [App\Http\Controllers\DisposisiController::class, 'indexPegawai'])->name('tugas.index');
    Route::get('/tugas/{id}', [App\Http\Controllers\DisposisiController::class, 'showPegawai'])->name('tugas.show');
    Route::post('/tugas/{id}/selesaikan', [App\Http\Controllers\DisposisiController::class, 'selesaikanTugas'])->name('tugas.selesaikan');
    Route::post('/tugas/{id}/delegasi', [App\Http\Controllers\DisposisiController::class, 'delegasiTugasPegawai'])->name('tugas.delegasi');

    // Route untuk cetak dan laporan
    Route::get('/tugas/{id}/cetak', [App\Http\Controllers\DisposisiController::class, 'cetakPegawai'])->name('tugas.cetak');
});

// Route untuk semua user yang authenticated (untuk pegawai tanpa privilege)
Route::middleware(['auth'])->group(function () {
    // Route untuk pegawai tanpa privilege melihat tugas yang diberikan
    Route::get('/tugas-saya', [App\Http\Controllers\DisposisiController::class, 'indexTugasSaya'])->name('tugas-saya.index');
    Route::get('/tugas-saya/{id}', [App\Http\Controllers\DisposisiController::class, 'showTugas'])->name('tugas-saya.show');
    Route::post('/tugas-saya/{id}/selesaikan', [App\Http\Controllers\DisposisiController::class, 'selesaikanTugas'])->name('tugas-saya.selesaikan');
    Route::get('/tugas-saya/{id}/cetak', [App\Http\Controllers\DisposisiController::class, 'cetakDisposisi'])->name('tugas-saya.cetak');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
