<?php

namespace App\Http\Controllers;

use App\Models\SuratMasuk;
use App\Models\DisposisiLog;
use App\Models\User;
use App\Models\SuratAssignment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DisposisiController extends Controller
{
    // Halaman daftar surat untuk disposisi (untuk kepala)
    public function indexKepala()
    {
        /** @var User $user */
        $user = Auth::user();
        
        // Tampilkan surat yang diajukan ke kepala ini dan belum didisposisi
        $suratMasuk = SuratMasuk::with(['admin', 'kepala', 'pmo', 'pegawai'])
            ->where('status_disposisi', 'diajukan')
            ->where('kepala_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('kepala/disposisi/index', [
            'suratMasuk' => $suratMasuk
        ]);
    }

    // Halaman detail surat untuk disposisi kepala
    public function showKepala($id)
    {
        $surat = SuratMasuk::with(['admin', 'kepala', 'pmo', 'pegawai', 'assignedUser'])
            ->findOrFail($id);

        // Pastikan surat diajukan ke kepala ini dan masih dalam status diajukan
        if ($surat->status_disposisi !== 'diajukan' || $surat->kepala_id !== Auth::id()) {
            return back()->withErrors(['error' => 'Surat tidak dapat diakses atau sudah didisposisi.']);
        }

        // Ambil daftar user dengan privilege disposisi (PMO dan Pegawai)
        $availableUsers = User::whereIn('role', ['pmo', 'pegawai'])
            ->where('can_dispose', true)
            ->get();

        // Ambil riwayat disposisi
        $disposisiLogs = DisposisiLog::with(['changedBy', 'disposisiKeUser'])
            ->where('surat_masuk_id', $id)
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('kepala/disposisi/show', [
            'surat' => $surat,
            'availableUsers' => $availableUsers,
            'disposisiLogs' => $disposisiLogs,
            'auth' => [
                'user' => [
                    'id' => Auth::id(),
                    'name' => Auth::user()->name,
                    'role' => Auth::user()->role,
                    'can_dispose' => true,
                ]
            ]
        ]);
    }

    // Proses disposisi dari kepala ke user dengan privilege
    public function disposisiKeUser(Request $request, $id)
    {
        $request->validate([
            'user_ids' => 'required|array|min:1',
            'user_ids.*' => 'exists:users,id',
            'catatan' => 'nullable|string|max:1000'
        ]);

        $surat = SuratMasuk::findOrFail($id);
        $targetUserIds = $request->user_ids;

        // Validasi dasar
        if ($surat->status_disposisi !== 'diajukan' || $surat->kepala_id !== Auth::id()) {
            return back()->withErrors(['error' => 'Tidak dapat melakukan disposisi pada surat ini.']);
        }

        // Validasi semua target user
        $targetUsers = User::whereIn('id', $targetUserIds)->get();
        
        foreach ($targetUsers as $targetUser) {
            // Pastikan target user memiliki privilege disposisi dan bukan admin/kepala
            if (!$targetUser->canDispose() || in_array($targetUser->role, ['admin', 'kepala'])) {
                return back()->withErrors(['error' => "User {$targetUser->name} tidak dapat menerima disposisi."]);
            }
        }

        // Untuk kepala, bisa disposisi ke multiple role (PMO dan Pegawai)
        // Status akan ditentukan berdasarkan role majority atau default ke 'pmo'
        $roles = $targetUsers->pluck('role')->unique();
        $pmoCount = $targetUsers->where('role', 'pmo')->count();
        $pegawaiCount = $targetUsers->where('role', 'pegawai')->count();
        
        // Prioritas status: jika ada PMO, gunakan 'pmo', jika tidak ada 'pegawai'
        $newStatus = $pmoCount > 0 ? 'pmo' : 'pegawai';
        
        // Update status surat dengan user pertama sebagai primary
        $statusLama = $surat->status_disposisi;
        $primaryUser = $targetUsers->first();
        $updateData = [
            'status_disposisi' => $newStatus,
            'assigned_user_id' => $primaryUser->id,
            'disposisi_at' => now()
        ];

        // Update field spesifik berdasarkan role primary user
        if ($primaryUser->role === 'pmo') {
            $updateData['pmo_id'] = $primaryUser->id;
        } elseif ($primaryUser->role === 'pegawai') {
            $updateData['pegawai_id'] = $primaryUser->id;
        }

        $surat->update($updateData);

        // Buat assignment untuk semua user yang dipilih
        foreach ($targetUsers as $targetUser) {
            SuratAssignment::create([
                'surat_masuk_id' => $surat->id,
                'user_id' => $targetUser->id,
                'assigned_by_user_id' => Auth::id(),
                'status' => 'assigned',
                'catatan_assignment' => $request->catatan
            ]);

            // Catat log disposisi untuk setiap user
            DisposisiLog::create([
                'surat_masuk_id' => $id,
                'status_lama' => $statusLama,
                'status_baru' => $newStatus,
                'changed_by_user_id' => Auth::id(),
                'disposisi_ke_user_id' => $targetUser->id,
                'catatan' => $request->catatan
            ]);
        }

        $userNames = $targetUsers->pluck('name')->implode(', ');
        $roleNames = $targetUsers->pluck('role')->unique()->map(function($role) {
            return $role === 'pmo' ? 'PMO' : 'Pegawai';
        })->implode(' dan ');
        
        return redirect()->route('kepala.disposisi.index')
            ->with('success', "Surat berhasil didisposisi ke {$roleNames}: {$userNames}");
    }

    // Halaman daftar surat untuk PMO
    public function indexPmo()
    {
        /** @var User $user */
        $user = Auth::user();
        
        // Pastikan PMO memiliki privilege disposisi
        if (!$user->canDispose()) {
            abort(403, 'Anda tidak memiliki hak untuk mengakses disposisi.');
        }

        $suratMasuk = SuratMasuk::with(['admin', 'kepala', 'pmo', 'pegawai'])
            ->where('pmo_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('pmo/disposisi/index', [
            'suratMasuk' => $suratMasuk
        ]);
    }

    // Halaman detail surat untuk disposisi PMO
    public function showPmo($id)
    {
        $surat = SuratMasuk::with(['admin', 'kepala', 'pmo', 'pegawai'])
            ->findOrFail($id);

        // Pastikan PMO hanya bisa lihat surat yang didisposisi ke mereka
        if ($surat->pmo_id !== Auth::id()) {
            abort(403);
        }

        /** @var User $user */
        $user = Auth::user();

        // Pastikan PMO memiliki privilege disposisi
        if (!$user->canDispose()) {
            abort(403, 'Anda tidak memiliki hak untuk melakukan disposisi.');
        }

        // Ambil daftar pegawai untuk pilihan disposisi (semua pegawai, bukan hanya yang memiliki privilege)
        $pegawaiUsers = User::where('role', 'pegawai')->get();

        // Ambil riwayat disposisi
        $disposisiLogs = DisposisiLog::with(['changedBy', 'disposisiKeUser'])
            ->where('surat_masuk_id', $id)
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('pmo/disposisi/show', [
            'surat' => $surat,
            'pegawaiUsers' => $pegawaiUsers,
            'disposisiLogs' => $disposisiLogs,
            'auth' => [
                'user' => [
                    'id' => Auth::id(),
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'can_dispose' => $user->canDispose(),
                ]
            ]
        ]);
    }

    // Proses disposisi dari PMO ke Pegawai
    public function disposisiToPegawai(Request $request, $id)
    {
        $request->validate([
            'pegawai_ids' => 'required|array|min:1',
            'pegawai_ids.*' => 'exists:users,id',
            'catatan' => 'nullable|string|max:1000'
        ]);

        $surat = SuratMasuk::findOrFail($id);
        $targetPegawaiIds = $request->pegawai_ids;

        /** @var User $user */
        $user = Auth::user();

        // Pastikan hanya PMO yang bisa disposisi dan surat didisposisi ke mereka
        if (!$surat->canDisposisiToPegawai() || $surat->pmo_id !== Auth::id()) {
            return back()->withErrors(['error' => 'Tidak dapat melakukan disposisi pada surat ini.']);
        }

        // Pastikan PMO memiliki privilege disposisi
        if (!$user->canDispose()) {
            return back()->withErrors(['error' => 'Anda tidak memiliki hak untuk melakukan disposisi.']);
        }

        // Validasi semua target pegawai
        $targetPegawaiList = User::whereIn('id', $targetPegawaiIds)->get();
        
        foreach ($targetPegawaiList as $targetPegawai) {
            // Pastikan target pegawai adalah pegawai (tidak perlu privilege)
            if ($targetPegawai->role !== 'pegawai') {
                return back()->withErrors(['error' => "User {$targetPegawai->name} harus pegawai."]);
            }
        }

        // Update status surat dengan pegawai pertama sebagai primary
        $statusLama = $surat->status_disposisi;
        $primaryPegawai = $targetPegawaiList->first();
        $surat->update([
            'status_disposisi' => 'pegawai',
            'pegawai_id' => $primaryPegawai->id,
            'assigned_user_id' => $primaryPegawai->id, // untuk flexible assignment
            'disposisi_at' => now()
        ]);

        // Buat assignment untuk semua pegawai yang dipilih
        foreach ($targetPegawaiList as $targetPegawai) {
            SuratAssignment::create([
                'surat_masuk_id' => $surat->id,
                'user_id' => $targetPegawai->id,
                'assigned_by_user_id' => Auth::id(),
                'status' => 'assigned',
                'catatan_assignment' => $request->catatan
            ]);

            // Catat log disposisi untuk setiap pegawai
            DisposisiLog::create([
                'surat_masuk_id' => $id,
                'status_lama' => $statusLama,
                'status_baru' => 'pegawai',
                'changed_by_user_id' => Auth::id(),
                'disposisi_ke_user_id' => $targetPegawai->id,
                'catatan' => $request->catatan
            ]);
        }

        $pegawaiNames = $targetPegawaiList->pluck('name')->implode(', ');
        return redirect()->route('pmo.disposisi.index')
            ->with('success', "Surat berhasil didisposisi ke Pegawai: {$pegawaiNames}");
    }

    // Halaman daftar surat untuk Pegawai
    public function indexPegawai()
    {
        /** @var User $user */
        $user = Auth::user();
        
        // Untuk pegawai dengan privilege, ambil surat yang ditugaskan ke mereka 
        // baik sebagai pegawai_id, assigned_user_id, maupun melalui assignments
        $suratMasuk = SuratMasuk::with(['admin', 'kepala', 'pmo', 'pegawai', 'assignments.user'])
            ->where(function($query) {
                $query->where('pegawai_id', Auth::id())
                      ->orWhere('assigned_user_id', Auth::id())
                      ->orWhereHas('assignments', function($subQuery) {
                          $subQuery->where('user_id', Auth::id());
                      });
            })
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('pegawai/tugas/index', [
            'suratMasuk' => $suratMasuk,
            'auth' => [
                'user' => [
                    'id' => Auth::id(),
                    'name' => $user->name,
                    'role' => $user->role,
                    'can_dispose' => $user->canDispose(),
                ]
            ]
        ]);
    }

    // Halaman detail surat untuk pegawai
    public function showPegawai($id)
    {
        $surat = SuratMasuk::with(['admin', 'kepala', 'pmo', 'pegawai', 'assignments.user'])
            ->findOrFail($id);

        // Pastikan pegawai bisa lihat surat yang didisposisi ke mereka
        $isAssigned = ($surat->pegawai_id === Auth::id() || 
                      $surat->assigned_user_id === Auth::id() ||
                      $surat->assignments()->where('user_id', Auth::id())->exists());
        
        if (!$isAssigned) {
            abort(403, 'Anda tidak berwenang untuk melihat surat ini.');
        }

        /** @var User $user */
        $user = Auth::user();

        // Ambil daftar pegawai tanpa privilege untuk delegasi (jika user memiliki privilege)
        $pegawaiTanpaPrivilege = [];
        if ($user->canDispose()) {
            $pegawaiTanpaPrivilege = User::where('role', 'pegawai')
                ->where('can_dispose', false)
                ->get();
        }

        // Ambil riwayat disposisi
        $disposisiLogs = DisposisiLog::with(['changedBy', 'disposisiKeUser'])
            ->where('surat_masuk_id', $id)
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('pegawai/tugas/show', [
            'surat' => $surat,
            'disposisiLogs' => $disposisiLogs,
            'pegawaiTanpaPrivilege' => $pegawaiTanpaPrivilege,
            'auth' => [
                'user' => [
                    'id' => Auth::id(),
                    'name' => $user->name,
                    'role' => $user->role,
                    'can_dispose' => $user->canDispose(),
                ]
            ]
        ]);
    }

    // Selesaikan disposisi oleh pegawai
    public function selesaikan(Request $request, $id)
    {
        $request->validate([
            'catatan_selesai' => 'nullable|string|max:1000'
        ]);

        $surat = SuratMasuk::findOrFail($id);

        // Pastikan hanya pegawai yang ditugaskan yang bisa menyelesaikan
        if ($surat->pegawai_id !== Auth::id() || $surat->status_disposisi !== 'pegawai') {
            return back()->withErrors(['error' => 'Tidak dapat menyelesaikan disposisi ini.']);
        }

        // Update status surat
        $statusLama = $surat->status_disposisi;
        $surat->update([
            'status_disposisi' => 'selesai',
            'status_tindak_lanjut' => 'selesai',
            'disposisi_at' => now()
        ]);

        // Catat log disposisi
        DisposisiLog::create([
            'surat_masuk_id' => $id,
            'status_lama' => $statusLama,
            'status_baru' => 'selesai',
            'changed_by_user_id' => Auth::id(),
            'catatan' => $request->catatan_selesai
        ]);

        return redirect()->route('pegawai.tugas.index')
            ->with('success', 'Disposisi surat berhasil diselesaikan.');
    }

    // Dashboard PMO dengan data disposisi
    public function dashboardPmo()
    {
        $pmoId = Auth::id();
        
        // Ambil statistik surat untuk PMO
        $suratMasuk = SuratMasuk::where('pmo_id', $pmoId)->get();
        
        $dashboardData = [
            'totalSurat' => $suratMasuk->count(),
            'suratMenunggu' => $suratMasuk->where('status_disposisi', 'pmo')->count(),
            'suratProses' => $suratMasuk->where('status_disposisi', 'pegawai')->count(),
            'suratSelesai' => $suratMasuk->where('status_disposisi', 'selesai')->count(),
            'recentSurat' => $suratMasuk->where('status_disposisi', 'pmo')
                ->sortByDesc('created_at')
                ->take(10)
                ->map(function($surat) {
                    return [
                        'id' => $surat->id,
                        'nomor_surat' => $surat->nomor_surat,
                        'perihal' => $surat->perihal,
                        'tanggal_masuk' => $surat->tanggal_masuk,
                        'status_disposisi' => $surat->status_disposisi,
                        'kepala' => $surat->kepala ? ['name' => $surat->kepala->name] : null,
                        'pegawai' => $surat->pegawai ? ['name' => $surat->pegawai->name] : null,
                    ];
                })->values()
        ];

        return Inertia::render('pmo/dashboard', [
            'dashboardData' => $dashboardData
        ]);
    }

    // Dashboard Pegawai dengan data tugas disposisi
    public function dashboardPegawai()
    {
        $pegawaiId = Auth::id();

        /** @var User $user */
        $user = Auth::user();
        
        // Pastikan hanya pegawai yang dapat mengakses
        if ($user->role !== 'pegawai') {
            abort(403, 'Anda tidak memiliki akses ke dashboard pegawai.');
        }
        
        // Ambil statistik tugas untuk Pegawai
        // Untuk pegawai dengan privilege, ambil surat yang ditugaskan ke mereka 
        // baik sebagai pegawai_id maupun assigned_user_id
        $tugasList = SuratMasuk::with(['admin', 'kepala', 'pmo', 'pegawai'])
            ->where(function($query) use ($pegawaiId) {
                $query->where('pegawai_id', $pegawaiId)
                      ->orWhere('assigned_user_id', $pegawaiId);
            })
            ->get();
        
        // Hitung rata-rata waktu penyelesaian (dalam hari)
        $completedTasks = $tugasList->where('status_disposisi', 'selesai');
        $avgCompletionTime = 0;
        
        if ($completedTasks->count() > 0) {
            $totalDays = $completedTasks->sum(function($tugas) {
                $start = \Carbon\Carbon::parse($tugas->created_at);
                $end = \Carbon\Carbon::parse($tugas->disposisi_at);
                return $start->diffInDays($end);
            });
            $avgCompletionTime = round($totalDays / $completedTasks->count(), 1);
        }
        
        $dashboardData = [
            'totalTugas' => $tugasList->count(),
            'tugasMenunggu' => $tugasList->where('status_disposisi', 'pegawai')->count(),
            'tugasSelesai' => $tugasList->where('status_disposisi', 'selesai')->count(),
            'avgCompletionTime' => $avgCompletionTime,
            'recentTugas' => $tugasList->sortByDesc('created_at')
                ->take(10)
                ->map(function($tugas) {
                    return [
                        'id' => $tugas->id,
                        'nomor_surat' => $tugas->nomor_surat,
                        'perihal' => $tugas->perihal,
                        'tanggal_masuk' => $tugas->tanggal_masuk,
                        'status_disposisi' => $tugas->status_disposisi,
                        'pmo' => $tugas->pmo ? ['name' => $tugas->pmo->name] : null,
                        'created_at' => $tugas->created_at,
                    ];
                })->values()
        ];

        return Inertia::render('pegawai/dashboard', [
            'dashboardData' => $dashboardData,
            'auth' => [
                'user' => [
                    'id' => Auth::id(),
                    'name' => Auth::user()->name,
                    'email' => Auth::user()->email,
                    'role' => Auth::user()->role,
                    'can_dispose' => $user->canDispose(),
                ]
            ]
        ]);
    }

    // Halaman cetak tugas untuk pegawai
    public function cetakPegawai($id)
    {
        $surat = SuratMasuk::with(['admin', 'kepala', 'pmo', 'pegawai', 'assignments.user'])
            ->findOrFail($id);

        // Pastikan pegawai bisa cetak surat yang didisposisi ke mereka
        $isAssigned = ($surat->pegawai_id === Auth::id() || 
                      $surat->assigned_user_id === Auth::id() ||
                      $surat->assignments()->where('user_id', Auth::id())->exists());
        
        if (!$isAssigned) {
            abort(403, 'Anda tidak berwenang untuk mencetak surat ini.');
        }

        // Ambil riwayat disposisi
        $disposisiLogs = DisposisiLog::with(['changedBy', 'disposisiKeUser'])
            ->where('surat_masuk_id', $id)
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('pegawai/tugas/cetak', [
            'surat' => $surat,
            'disposisiLogs' => $disposisiLogs
        ]);
    }

    // Dashboard Kepala dengan data disposisi
    public function dashboardKepala()
    {
        $kepalaId = Auth::id();
        
        // Surat yang menunggu disposisi oleh kepala ini
        $suratMenunggu = SuratMasuk::with(['admin', 'kepala', 'pmo', 'pegawai'])
            ->where('status_disposisi', 'diajukan')
            ->where('kepala_id', $kepalaId)
            ->get();
            
        // Surat yang sudah didisposisi oleh kepala ini
        $suratSudahDisposisi = SuratMasuk::with(['admin', 'kepala', 'pmo', 'pegawai'])
            ->where('kepala_id', $kepalaId)
            ->whereIn('status_disposisi', ['pmo', 'pegawai', 'selesai'])
            ->get();
        
        $dashboardData = [
            'totalSurat' => $suratMenunggu->count() + $suratSudahDisposisi->count(),
            'menungguDisposisi' => $suratMenunggu->count(),
            'sudahDisposisi' => $suratSudahDisposisi->count(),
            'suratSelesai' => $suratSudahDisposisi->where('status_disposisi', 'selesai')->count(),
            // Tampilkan surat yang masih menunggu disposisi di dashboard
            'recentSurat' => $suratMenunggu
                ->sortByDesc('created_at')
                ->take(10)
                ->map(function($surat) {
                    return [
                        'id' => $surat->id,
                        'nomor_surat' => $surat->nomor_surat,
                        'perihal' => $surat->perihal,
                        'tanggal_masuk' => $surat->tanggal_masuk,
                        'status_disposisi' => $surat->status_disposisi,
                        'pengirim' => $surat->pengirim,
                        'prioritas' => $surat->prioritas ?? 'sedang',
                        'created_at' => $surat->created_at,
                    ];
                })->values()
        ];

        return Inertia::render('kepala/dashboard', [
            'dashboardData' => $dashboardData
        ]);
    }

    // Method untuk melihat riwayat disposisi kepala
    public function riwayatKepala()
    {
        $kepalaId = Auth::id();
        
        // Ambil semua surat yang sudah didisposisi oleh kepala ini
        $riwayatDisposisi = SuratMasuk::with(['admin', 'kepala', 'pmo', 'pegawai'])
            ->where('kepala_id', $kepalaId)
            ->orderBy('disposisi_at', 'desc')
            ->get()
            ->map(function($surat) {
                return [
                    'id' => $surat->id,
                    'no_surat' => $surat->no_surat,
                    'hal_surat' => $surat->hal_surat,
                    'pengirim' => $surat->pengirim,
                    'tanggal_diterima' => $surat->tanggal_diterima,
                    'status_disposisi' => $surat->status_disposisi,
                    'disposisi_at' => $surat->disposisi_at,
                    'pmo' => $surat->pmo ? ['id' => $surat->pmo->id, 'name' => $surat->pmo->name] : null,
                    'pegawai' => $surat->pegawai ? ['id' => $surat->pegawai->id, 'name' => $surat->pegawai->name] : null,
                    'created_at' => $surat->created_at,
                ];
            });

        return Inertia::render('kepala/riwayat/index', [
            'riwayatDisposisi' => $riwayatDisposisi,
            'auth' => [
                'user' => [
                    'id' => Auth::id(),
                    'name' => Auth::user()->name,
                    'role' => Auth::user()->role,
                ]
            ]
        ]);
    }

    // Method untuk user dengan privilege mendelegasikan ke user tanpa privilege
    public function delegasiKeNonPrivilege(Request $request, $id)
    {
        $request->validate([
            'pegawai_id' => 'required|exists:users,id',
            'catatan' => 'nullable|string|max:1000'
        ]);

        $surat = SuratMasuk::findOrFail($id);
        $targetPegawai = User::findOrFail($request->pegawai_id);

        /** @var User $user */
        $user = Auth::user();

        // Pastikan user memiliki privilege disposisi
        if (!$user->canDispose()) {
            return back()->withErrors(['error' => 'Anda tidak memiliki hak untuk melakukan disposisi.']);
        }

        // Pastikan surat sedang dalam tahap yang bisa didelegasikan
        if (!in_array($surat->status_disposisi, ['pmo', 'pegawai'])) {
            return back()->withErrors(['error' => 'Surat tidak dalam status yang dapat didelegasikan.']);
        }

        // Pastikan user adalah yang bertanggung jawab atas surat ini
        if (($user->role === 'pmo' && $surat->pmo_id !== Auth::id()) ||
            ($user->role === 'pegawai' && $surat->pegawai_id !== Auth::id())) {
            return back()->withErrors(['error' => 'Anda tidak berwenang untuk mendelegasikan surat ini.']);
        }

        // Pastikan target pegawai TIDAK memiliki privilege disposisi (user biasa)
        if ($targetPegawai->canDispose() || in_array($targetPegawai->role, ['admin', 'kepala', 'pmo'])) {
            return back()->withErrors(['error' => 'User yang dipilih harus pegawai tanpa privilege disposisi.']);
        }

        // Update status surat
        $statusLama = $surat->status_disposisi;
        $surat->update([
            'status_disposisi' => 'selesai', // Surat selesai karena sudah sampai ke pelaksana
            'pegawai_id' => $request->pegawai_id,
            'assigned_user_id' => $request->pegawai_id,
            'disposisi_at' => now()
        ]);

        // Catat log disposisi
        DisposisiLog::create([
            'surat_masuk_id' => $surat->id,
            'status_lama' => $statusLama,
            'status_baru' => 'selesai',
            'changed_by_user_id' => Auth::id(),
            'catatan' => $request->catatan,
            'disposisi_ke_user_id' => $request->pegawai_id
        ]);

        return redirect()->back()->with('success', "Surat berhasil didelegasikan ke: {$targetPegawai->name}");
    }

    // Method untuk menampilkan form delegasi ke non-privilege
    public function showDelegasi($id)
    {
        $surat = SuratMasuk::with(['admin', 'kepala', 'pmo', 'pegawai'])
            ->findOrFail($id);

        /** @var User $user */
        $user = Auth::user();

        // Pastikan user memiliki privilege dan berwenang atas surat ini
        if (!$user->canDispose()) {
            abort(403, 'Anda tidak memiliki hak untuk melakukan disposisi.');
        }

        if (($user->role === 'pmo' && $surat->pmo_id !== Auth::id()) ||
            ($user->role === 'pegawai' && $surat->pegawai_id !== Auth::id())) {
            abort(403, 'Anda tidak berwenang untuk mendelegasikan surat ini.');
        }

        // Ambil daftar pegawai tanpa privilege disposisi
        $pegawaiTanpaPrivilege = User::where('role', 'pegawai')
            ->where('can_dispose', false)
            ->get();

        // Ambil riwayat disposisi
        $disposisiLogs = DisposisiLog::with(['changedBy', 'disposisiKeUser'])
            ->where('surat_masuk_id', $id)
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('disposisi/delegasi', [
            'surat' => $surat,
            'pegawaiTanpaPrivilege' => $pegawaiTanpaPrivilege,
            'disposisiLogs' => $disposisiLogs,
            'auth' => [
                'user' => [
                    'id' => Auth::id(),
                    'name' => $user->name,
                    'role' => $user->role,
                    'can_dispose' => $user->canDispose(),
                ]
            ]
        ]);
    }

    // Method untuk pegawai tanpa privilege melihat disposisi yang ditugaskan ke mereka
    public function showTugas($id)
    {
        $surat = SuratMasuk::with(['admin', 'kepala', 'pmo', 'pegawai', 'assignments.user'])
            ->findOrFail($id);

        /** @var User $user */
        $user = Auth::user();

        // Pastikan pegawai bisa melihat surat yang ditugaskan ke mereka
        $isAssigned = ($surat->pegawai_id === Auth::id() || 
                      $surat->assigned_user_id === Auth::id() ||
                      $surat->assignments()->where('user_id', Auth::id())->exists());
        
        if (!$isAssigned) {
            abort(403, 'Anda tidak berwenang untuk melihat surat ini.');
        }

        // Ambil riwayat disposisi
        $disposisiLogs = DisposisiLog::with(['changedBy', 'disposisiKeUser'])
            ->where('surat_masuk_id', $id)
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('tugas-saya/show', [
            'surat' => $surat,
            'disposisiLogs' => $disposisiLogs,
            'auth' => [
                'user' => [
                    'id' => Auth::id(),
                    'name' => $user->name,
                    'role' => $user->role,
                    'can_dispose' => $user->canDispose(), // Get actual value
                ]
            ]
        ]);
    }

    // Method untuk cetak disposisi
    public function cetakDisposisi($id)
    {
        $surat = SuratMasuk::with(['admin', 'kepala', 'pmo', 'pegawai', 'assignments.user'])
            ->findOrFail($id);

        /** @var User $user */
        $user = Auth::user();

        // Pastikan user berwenang melihat surat ini
        $isAssigned = ($surat->pegawai_id === Auth::id() || 
                      $surat->assigned_user_id === Auth::id() ||
                      $surat->assignments()->where('user_id', Auth::id())->exists());
        
        if ($user->role === 'pegawai' && !$isAssigned) {
            abort(403, 'Anda tidak berwenang untuk mencetak surat ini.');
        }

        // Ambil riwayat disposisi
        $disposisiLogs = DisposisiLog::with(['changedBy', 'disposisiKeUser'])
            ->where('surat_masuk_id', $id)
            ->orderBy('created_at', 'asc')
            ->get();

        return Inertia::render('pegawai/tugas/cetak', [
            'surat' => $surat,
            'disposisiLogs' => $disposisiLogs
        ]);
    }

    // Method untuk semua user melihat tugas yang diberikan kepada mereka (pegawai tanpa privilege)
    public function indexTugasSaya()
    {
        /** @var User $user */
        $user = Auth::user();
        
        // Ambil surat yang ditugaskan ke user ini melalui tabel surat_assignments
        $tugasList = SuratMasuk::with(['admin', 'kepala', 'pmo', 'pegawai', 'assignedUser'])
            ->whereHas('assignments', function ($query) {
                $query->where('user_id', Auth::id());
            })
            ->orWhere('assigned_user_id', Auth::id()) // untuk backward compatibility
            ->orWhere('pegawai_id', Auth::id()) // untuk backward compatibility
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('tugas-saya/index', [
            'suratMasuk' => $tugasList,
            'auth' => [
                'user' => [
                    'id' => Auth::id(),
                    'name' => $user->name,
                    'role' => $user->role,
                    'can_dispose' => $user->canDispose(),
                ]
            ]
        ]);
    }

    // Method untuk pegawai tanpa privilege menyelesaikan tugas
    public function selesaikanTugas(Request $request, $id)
    {
        $request->validate([
            'catatan_selesai' => 'nullable|string|max:1000'
        ]);

        $surat = SuratMasuk::findOrFail($id);

        /** @var User $user */
        $user = Auth::user();

        // Pastikan user adalah yang ditugaskan dan surat belum selesai
        $isAssigned = ($surat->assigned_user_id === Auth::id() || 
                      $surat->pegawai_id === Auth::id() ||
                      $surat->assignments()->where('user_id', Auth::id())->exists());
        
        if (!$isAssigned || $surat->status_disposisi === 'selesai') {
            return back()->withErrors(['error' => 'Tidak dapat menyelesaikan tugas ini.']);
        }

        // Update status surat
        $statusLama = $surat->status_disposisi;
        $surat->update([
            'status_disposisi' => 'selesai',
            'status_tindak_lanjut' => 'selesai',
            'disposisi_at' => now()
        ]);

        // Catat log disposisi
        DisposisiLog::create([
            'surat_masuk_id' => $surat->id,
            'status_lama' => $statusLama,
            'status_baru' => 'selesai',
            'changed_by_user_id' => Auth::id(),
            'catatan' => $request->catatan_selesai
        ]);

        // Redirect based on user privilege
        if ($user->canDispose() && $user->role === 'pegawai') {
            return redirect()->route('pegawai.tugas.index')
                ->with('success', 'Tugas berhasil diselesaikan.');
        } else {
            return redirect()->route('tugas-saya.index')
                ->with('success', 'Tugas berhasil diselesaikan.');
        }
    }

    // Method untuk pegawai privileged mendelegasikan tugas
    public function delegasiTugasPegawai(Request $request, $id)
    {
        $request->validate([
            'pegawai_ids' => 'required|array|min:1',
            'pegawai_ids.*' => 'exists:users,id',
            'catatan' => 'nullable|string|max:1000'
        ]);

        $surat = SuratMasuk::findOrFail($id);
        $targetPegawaiIds = $request->pegawai_ids;

        /** @var User $user */
        $user = Auth::user();

        // Pastikan user memiliki privilege disposisi
        if (!$user->canDispose()) {
            return back()->withErrors(['error' => 'Anda tidak memiliki hak untuk melakukan disposisi.']);
        }

        // Pastikan surat sedang dalam tahap pegawai dan ditugaskan ke user ini
        if ($surat->status_disposisi !== 'pegawai' || 
            ($surat->pegawai_id !== Auth::id() && $surat->assigned_user_id !== Auth::id())) {
            return back()->withErrors(['error' => 'Anda tidak berwenang untuk mendelegasikan surat ini.']);
        }

        // Validasi semua target pegawai
        $targetPegawaiList = User::whereIn('id', $targetPegawaiIds)->get();
        
        foreach ($targetPegawaiList as $targetPegawai) {
            // Pastikan target pegawai TIDAK memiliki privilege disposisi (user biasa)
            if ($targetPegawai->canDispose() || in_array($targetPegawai->role, ['admin', 'kepala', 'pmo'])) {
                return back()->withErrors(['error' => "User {$targetPegawai->name} harus pegawai tanpa privilege disposisi."]);
            }
        }

        // Untuk multiple assignment, surat tetap dalam status 'pegawai' 
        // dan semua pegawai yang dipilih akan menerima tugas yang sama
        $statusLama = $surat->status_disposisi;
        
        // Simpan pegawai pertama sebagai pegawai utama untuk backward compatibility
        $mainPegawai = $targetPegawaiList->first();
        $surat->update([
            'pegawai_id' => $mainPegawai->id,
            'assigned_user_id' => $mainPegawai->id,
            'disposisi_at' => now()
        ]);

        // Buat assignment untuk setiap pegawai
        foreach ($targetPegawaiList as $targetPegawai) {
            SuratAssignment::create([
                'surat_masuk_id' => $surat->id,
                'user_id' => $targetPegawai->id,
                'assigned_by_user_id' => Auth::id(),
                'status' => 'assigned',
                'catatan_assignment' => $request->catatan
            ]);

            // Catat log disposisi untuk setiap pegawai
            DisposisiLog::create([
                'surat_masuk_id' => $surat->id,
                'status_lama' => $statusLama,
                'status_baru' => 'pegawai',
                'changed_by_user_id' => Auth::id(),
                'catatan' => $request->catatan,
                'disposisi_ke_user_id' => $targetPegawai->id
            ]);
        }

        $pegawaiNames = $targetPegawaiList->pluck('name')->implode(', ');
        return redirect()->route('pegawai.tugas.index')->with('success', "Tugas berhasil didelegasikan ke: {$pegawaiNames}");
    }
}
