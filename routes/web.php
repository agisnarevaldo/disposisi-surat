<?php

use App\Http\Controllers\SuratKeluarController;
use App\Http\Controllers\SuratMasukController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        $user = Auth::user();

        return match ($user->role) {
            'kepala' => redirect('/dashboard/kepala'),
            'pmo' => redirect('/dashboard/pmo'),
            default => redirect('/dashboard/staff'),
        };
    })->name('dashboard');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard/kepala', fn () => Inertia::render('dashboard/kepala'))->name('dashboard.kepala');
    Route::get('/dashboard/pmo', fn () => Inertia::render('dashboard/pmo'))->name('dashboard.pmo');
    Route::get('/dashboard/staff', fn () => Inertia::render('dashboard/staff'))->name('dashboard.staff');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/surat-keluar',  [SuratKeluarController::class, 'index'])->name('surat-keluar.index');
    Route::get('/surat-keluar/create', [SuratKeluarController::class, 'create'])->name('surat-keluar.create');
    Route::post('/surat-keluar', [SuratKeluarController::class, 'store'])->name('surat-keluar.store');
    Route::get('/surat-keluar/{id}', [SuratKeluarController::class, 'show'])->name('surat-keluar.show');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/surat-masuk', [SuratMasukController::class, 'index'])->name('surat-masuk.index');
    Route::get('/surat-masuk/create', [SuratMasukController::class, 'create'])->name('surat-masuk.create');
    Route::post('/surat-masuk', [SuratMasukController::class, 'store'])->name('surat-masuk.store');
    Route::get('/surat-masuk/{id}', [SuratMasukController::class, 'show'])->name('surat-masuk.show');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
