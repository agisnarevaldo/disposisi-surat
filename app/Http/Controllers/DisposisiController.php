<?php

namespace App\Http\Controllers;

use App\Models\SuratMasuk;
use App\Models\DisposisiLog;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class DisposisiController extends Controller
{
    // Halaman daftar surat untuk disposisi (untuk kepala)
    public function indexKepala()
    {
        /** @var User $user */
        $user = Auth::user();
        
        // Pastikan kepala memiliki privilege disposisi (seharusnya otomatis untuk kepala)
        if (!$user->canDispose()) {
            abort(403, 'Anda tidak memiliki hak untuk mengakses disposisi.');
        }

        $suratMasuk = SuratMasuk::with(['admin', 'kepala', 'pmo', 'pegawai'])
            ->where('status_disposisi', 'diajukan')
            ->orWhere('kepala_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('kepala/disposisi/index', [
            'suratMasuk' => $suratMasuk
        ]);
    }

    // Halaman detail surat untuk disposisi kepala
    public function showKepala($id)
    {
        /** @var User $user */
        $user = Auth::user();
        
        // Pastikan kepala memiliki privilege disposisi
        if (!$user->canDispose()) {
            abort(403, 'Anda tidak memiliki hak untuk melakukan disposisi.');
        }

        $surat = SuratMasuk::with(['admin', 'kepala', 'pmo', 'pegawai', 'assignedUser'])
            ->findOrFail($id);

        // Pastikan kepala belum pernah melakukan disposisi (hanya bisa sekali disposisi)
        if ($surat->kepala_id && $surat->kepala_id == Auth::id()) {
            return back()->withErrors(['error' => 'Anda sudah melakukan disposisi untuk surat ini.']);
        }

        // Ambil daftar user dengan privilege disposisi (kecuali kepala dan admin)
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
                    'name' => $user->name,
                    'role' => $user->role,
                    'can_dispose' => $user->canDispose(),
                ]
            ]
        ]);
    }

    // Proses disposisi dari kepala ke user dengan privilege
    public function disposisiKeUser(Request $request, $id)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'catatan' => 'nullable|string|max:1000'
        ]);

        $surat = SuratMasuk::findOrFail($id);
        $targetUser = User::findOrFail($request->user_id);

        /** @var User $user */
        $user = Auth::user();

        // Pastikan hanya kepala yang bisa disposisi dan status masih 'diajukan'
        if ($surat->status_disposisi !== 'diajukan' || $user->role !== 'kepala') {
            return back()->withErrors(['error' => 'Tidak dapat melakukan disposisi pada surat ini.']);
        }

        // Pastikan kepala belum pernah melakukan disposisi (hanya bisa sekali disposisi)
        if ($surat->kepala_id && $surat->kepala_id == Auth::id()) {
            return back()->withErrors(['error' => 'Anda sudah melakukan disposisi untuk surat ini.']);
        }

        // Pastikan kepala memiliki privilege disposisi
        if (!$user->canDispose()) {
            return back()->withErrors(['error' => 'Anda tidak memiliki hak untuk melakukan disposisi.']);
        }

        // Pastikan target user memiliki privilege disposisi dan bukan admin/kepala
        if (!$targetUser->canDispose() || in_array($targetUser->role, ['admin', 'kepala'])) {
            return back()->withErrors(['error' => 'User yang dipilih tidak dapat menerima disposisi.']);
        }

        // Tentukan status berdasarkan role target user
        $newStatus = $targetUser->role; // 'pmo' atau 'pegawai'
        
        // Update status surat dengan assigned_user_id untuk flexible assignment
        $statusLama = $surat->status_disposisi;
        $updateData = [
            'status_disposisi' => $newStatus,
            'kepala_id' => Auth::id(),
            'assigned_user_id' => $request->user_id,
            'disposisi_at' => now()
        ];

        // Update field spesifik berdasarkan role untuk backward compatibility
        if ($targetUser->role === 'pmo') {
            $updateData['pmo_id'] = $request->user_id;
        } elseif ($targetUser->role === 'pegawai') {
            $updateData['pegawai_id'] = $request->user_id;
        }

        $surat->update($updateData);

        // Catat log disposisi
        DisposisiLog::create([
            'surat_masuk_id' => $id,
            'status_lama' => $statusLama,
            'status_baru' => $newStatus,
            'changed_by_user_id' => Auth::id(),
            'disposisi_ke_user_id' => $request->user_id,
            'catatan' => $request->catatan
        ]);

        $targetRoleName = $targetUser->role === 'pmo' ? 'PMO' : 'Pegawai';
        return redirect()->route('kepala.disposisi.index')
            ->with('success', "Surat berhasil didisposisi ke {$targetRoleName}: {$targetUser->name}.");
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
            'pegawai_id' => 'required|exists:users,id',
            'catatan' => 'nullable|string|max:1000'
        ]);

        $surat = SuratMasuk::findOrFail($id);
        $targetPegawai = User::findOrFail($request->pegawai_id);

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

        // Pastikan target pegawai adalah pegawai (tidak perlu privilege)
        if ($targetPegawai->role !== 'pegawai') {
            return back()->withErrors(['error' => 'User yang dipilih harus pegawai.']);
        }

        // Update status surat
        $statusLama = $surat->status_disposisi;
        $surat->update([
            'status_disposisi' => 'pegawai',
            'pegawai_id' => $request->pegawai_id,
            'assigned_user_id' => $request->pegawai_id, // untuk flexible assignment
            'disposisi_at' => now()
        ]);

        // Catat log disposisi
        DisposisiLog::create([
            'surat_masuk_id' => $id,
            'status_lama' => $statusLama,
            'status_baru' => 'pegawai',
            'changed_by_user_id' => Auth::id(),
            'disposisi_ke_user_id' => $request->pegawai_id,
            'catatan' => $request->catatan
        ]);

        return redirect()->route('pmo.disposisi.index')
            ->with('success', 'Surat berhasil didisposisi ke Pegawai.');
    }

    // Halaman daftar surat untuk Pegawai
    public function indexPegawai()
    {
        $suratMasuk = SuratMasuk::with(['admin', 'kepala', 'pmo', 'pegawai'])
            ->where('pegawai_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('pegawai/disposisi/index', [
            'suratMasuk' => $suratMasuk
        ]);
    }

    // Halaman detail surat untuk pegawai
    public function showPegawai($id)
    {
        $surat = SuratMasuk::with(['admin', 'kepala', 'pmo', 'pegawai'])
            ->findOrFail($id);

        // Pastikan pegawai hanya bisa lihat surat yang didisposisi ke mereka
        if ($surat->pegawai_id !== Auth::id()) {
            abort(403);
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

        return redirect()->route('pegawai.disposisi.index')
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
        
        // Ambil statistik tugas untuk Pegawai
        $tugasList = SuratMasuk::with(['admin', 'kepala', 'pmo', 'pegawai'])
            ->where('pegawai_id', $pegawaiId)
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
        $surat = SuratMasuk::with(['admin', 'kepala', 'pmo', 'pegawai'])
            ->findOrFail($id);

        // Pastikan pegawai hanya bisa cetak surat yang didisposisi ke mereka
        if ($surat->pegawai_id !== Auth::id()) {
            abort(403);
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
        
        // Ambil statistik surat untuk Kepala
        $suratMasuk = SuratMasuk::with(['admin', 'kepala', 'pmo', 'pegawai']);
        
        // Untuk kepala, tampilkan semua surat yang perlu disposisi atau sudah didisposisi oleh kepala
        $allSurat = $suratMasuk->where(function($query) use ($kepalaId) {
            $query->where('status_disposisi', 'diajukan')  // Surat yang perlu disposisi
                  ->orWhere('kepala_id', $kepalaId);        // Surat yang sudah didisposisi oleh kepala ini
        })->get();
        
        $dashboardData = [
            'totalSurat' => $allSurat->count(),
            'menungguDisposisi' => $allSurat->where('status_disposisi', 'diajukan')->count(),
            'sudahDisposisi' => $allSurat->whereIn('status_disposisi', ['pmo', 'pegawai', 'selesai'])
                                         ->where('kepala_id', $kepalaId)->count(),
            'suratSelesai' => $allSurat->where('status_disposisi', 'selesai')
                                      ->where('kepala_id', $kepalaId)->count(),
            'recentSurat' => $allSurat->where('status_disposisi', 'diajukan')
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
                        'pmo' => $surat->pmo ? ['name' => $surat->pmo->name] : null,
                        'pegawai' => $surat->pegawai ? ['name' => $surat->pegawai->name] : null,
                        'prioritas' => $surat->prioritas ?? 'sedang',
                        'created_at' => $surat->created_at,
                    ];
                })->values()
        ];

        return Inertia::render('kepala/dashboard', [
            'dashboardData' => $dashboardData
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
        $surat = SuratMasuk::with(['admin', 'kepala', 'pmo', 'pegawai'])
            ->findOrFail($id);

        /** @var User $user */
        $user = Auth::user();

        // Pastikan pegawai hanya bisa melihat surat yang ditugaskan ke mereka
        if ($surat->pegawai_id !== Auth::id()) {
            abort(403, 'Anda tidak berwenang untuk melihat surat ini.');
        }

        // Ambil riwayat disposisi
        $disposisiLogs = DisposisiLog::with(['changedBy', 'disposisiKeUser'])
            ->where('surat_masuk_id', $id)
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('pegawai/tugas/show', [
            'surat' => $surat,
            'disposisiLogs' => $disposisiLogs,
            'auth' => [
                'user' => [
                    'id' => Auth::id(),
                    'name' => $user->name,
                    'role' => $user->role,
                    'can_dispose' => false, // pegawai tanpa privilege
                ]
            ]
        ]);
    }

    // Method untuk cetak disposisi
    public function cetakDisposisi($id)
    {
        $surat = SuratMasuk::with(['admin', 'kepala', 'pmo', 'pegawai'])
            ->findOrFail($id);

        /** @var User $user */
        $user = Auth::user();

        // Pastikan user berwenang melihat surat ini
        if ($user->role === 'pegawai' && $surat->pegawai_id !== Auth::id()) {
            abort(403, 'Anda tidak berwenang untuk mencetak surat ini.');
        }

        // Ambil riwayat disposisi
        $disposisiLogs = DisposisiLog::with(['changedBy', 'disposisiKeUser'])
            ->where('surat_masuk_id', $id)
            ->orderBy('created_at', 'asc')
            ->get();

        return Inertia::render('disposisi/cetak', [
            'surat' => $surat,
            'disposisiLogs' => $disposisiLogs,
            'tanggalCetak' => now()->format('d F Y'),
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

    // Method untuk semua user melihat tugas yang diberikan kepada mereka (pegawai tanpa privilege)
    public function indexTugasSaya()
    {
        /** @var User $user */
        $user = Auth::user();
        
        // Ambil surat yang ditugaskan ke user ini
        $tugasList = SuratMasuk::with(['admin', 'kepala', 'pmo', 'pegawai', 'assignedUser'])
            ->where('assigned_user_id', Auth::id())
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
        if (($surat->assigned_user_id !== Auth::id() && $surat->pegawai_id !== Auth::id()) || 
            $surat->status_disposisi === 'selesai') {
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

        // Pastikan surat sedang dalam tahap pegawai dan ditugaskan ke user ini
        if ($surat->status_disposisi !== 'pegawai' || $surat->pegawai_id !== Auth::id()) {
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

        return redirect()->route('pegawai.tugas.index')->with('success', "Tugas berhasil didelegasikan ke: {$targetPegawai->name}");
    }
}
