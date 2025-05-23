<?php

namespace App\Http\Controllers;

use App\Models\SuratKeluar;
use App\Models\SuratMasuk;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardStaffController extends Controller
{
    //
    public function index()
    {
        // Surat Masuk
        $totalSuratMasuk = SuratMasuk::count();


        // Surat Keluar
        $totalSuratKeluar = SuratKeluar::count();
        $perluTindakLanjut = SuratKeluar::where('status', 'Ditindaklanjuti')->count();
        $selesai = SuratKeluar::where('status', 'selesai')->count();

        return Inertia::render('dashboard/staff', [
            'stats' => [
                'totalSuratMasuk' => $totalSuratMasuk,
                'totalSuratKeluar' => $totalSuratKeluar,
                'perluTindakLanjut' => $perluTindakLanjut,
                'selesai' => $selesai,
            ],
        ]);
    }
}
