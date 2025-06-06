<?php

namespace App\Http\Controllers;

use App\Models\SuratMasuk;
use App\Models\SuratKeluar;
use Inertia\Inertia;

class DashboardKepalaController extends Controller
{
    public function index()
    {
        // Surat Masuk
        $totalSuratMasuk = SuratMasuk::count();
        $dibaca = SuratMasuk::where('status_baca', 'dibaca')->count();
        $belumDibaca = SuratMasuk::where('status_baca', '!=', 'dibaca')->count();
        $tindakLanjut = SuratMasuk::where('status_tindak_lanjut', 'ditindaklanjuti')->count();
        $belumTindakLanjut = SuratMasuk::where('status_tindak_lanjut', '!=', 'ditindaklanjuti')->count();

        // Surat Keluar
        $totalSuratKeluar = SuratKeluar::count();
        $statusKeluar = SuratKeluar::selectRaw('status, COUNT(*) as count')->groupBy('status')->pluck('count', 'status');

        return Inertia::render('dashboard/kepala', [
            'stats' => [
                'totalSuratMasuk' => $totalSuratMasuk,
                'dibaca' => $dibaca,
                'belumDibaca' => $belumDibaca,
                'tindakLanjut' => $tindakLanjut,
                'belumTindakLanjut' => $belumTindakLanjut,
                'totalSuratKeluar' => $totalSuratKeluar,
                'statusKeluar' => $statusKeluar,
            ],
        ]);
    }
}
