<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\SuratMasuk;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index()
    {
        // Calculate user statistics
        $userStats = [
            'total' => User::count(),
            'admin' => User::where('role', 'admin')->count(),
            'kepala' => User::where('role', 'kepala')->count(),
            'pmo' => User::where('role', 'pmo')->count(),
            'pegawai' => User::where('role', 'pegawai')->count(),
            'can_dispose' => User::where('can_dispose', true)->count(),
        ];

        // Calculate surat statistics based on status_disposisi
        $suratStats = [
            'total' => SuratMasuk::count(),
            'draft' => SuratMasuk::where('status_disposisi', 'draft')->count(),
            'diajukan' => SuratMasuk::whereIn('status_disposisi', ['diajukan', 'kepala', 'pmo', 'pegawai'])->count(),
            'selesai' => SuratMasuk::where('status_disposisi', 'selesai')->count(),
        ];

        return Inertia::render('admin/dashboard', [
            'userStats' => $userStats,
            'suratStats' => $suratStats,
        ]);
    }
}
