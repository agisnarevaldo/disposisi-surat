<?php

namespace App\Http\Controllers;

use App\Models\SuratMasuk;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class SuratMasukController extends Controller
{
    // Tampilkan semua surat masuk untuk admin
    public function adminIndex()
    {
        $suratMasuks = SuratMasuk::with(['admin', 'assignedUser', 'kepala', 'pmo', 'pegawai'])
            ->latest()
            ->get();

        return inertia('admin/surat-masuk/index', [
            'suratMasuks' => $suratMasuks,
        ]);
    }

    // Tampilkan semua surat masuk (untuk route umum)
    public function index()
    {
        $suratMasuks = SuratMasuk::latest()->get();

        return inertia('SuratMasuk/Index', [
            'suratMasuks' => $suratMasuks,
        ]);
    }

    // Tampilkan form tambah surat masuk
    public function create()
    {
        // Ambil daftar semua user yang bisa menerima disposisi untuk pilihan pengajuan
        $usersCanDispose = User::whoCanDispose()
            ->select('id', 'name', 'email', 'role', 'jabatan')
            ->orderBy('role')
            ->orderBy('name')
            ->get();
        
        return inertia('admin/surat-masuk/create', [
            'usersCanDispose' => $usersCanDispose
        ]);
    }

    // simpan data baru
    public function store(Request $request)
    {
        $validated = $request->validate([
            'no_agenda' => 'required|string|max:255',
            'no_surat' => 'required|string|max:255',
            'tanggal_surat' => 'required|date',
            'tanggal_diterima' => 'required|date',
            'pengirim' => 'required|string|max:255',
            'hal_surat' => 'required|string|max:255',
            'jenis_surat' => 'required|string|max:255',
            'file_surat' => 'required|file|mimes:pdf,doc,docx,odt|max:10240', // max 10MB
            'tujuan_surat' => 'required|string|max:255',
            'pesan_tambahan' => 'nullable|string',
            'user_id' => 'nullable|exists:users,id' // user untuk pengajuan (fleksibel)
        ]);

        $filePath = $request->file('file_surat')->store('surat-masuk', 'public');

        // Tentukan status disposisi berdasarkan apakah langsung diajukan ke user
        $statusDisposisi = ($request->user_id && $request->user_id !== 'draft') ? 'diajukan' : 'draft';
        $assignedUserId = ($request->user_id && $request->user_id !== 'draft') ? $request->user_id : null;

        // Data dasar surat masuk
        $suratMasukData = [
            'no_agenda' => $validated['no_agenda'],
            'no_surat' => $validated['no_surat'],
            'tanggal_surat' => $validated['tanggal_surat'],
            'tanggal_diterima' => $validated['tanggal_diterima'],
            'pengirim' => $validated['pengirim'],
            'hal_surat' => $validated['hal_surat'],
            'jenis_surat' => $validated['jenis_surat'],
            'file_surat' => $filePath,
            'tujuan_surat' => $validated['tujuan_surat'],
            'pesan_tambahan' => $validated['pesan_tambahan'],
            'status_disposisi' => $statusDisposisi,
            'status_baca' => 'belum dibaca',
            'status_tindak_lanjut' => 'belum ditindaklanjuti',
            'admin_id' => Auth::id(),
            'assigned_user_id' => $assignedUserId,
            'disposisi_at' => $assignedUserId ? now() : null
        ];

        // Set field spesifik berdasarkan role target user jika ada
        if ($assignedUserId) {
            $targetUser = User::findOrFail($assignedUserId);
            
            switch ($targetUser->role) {
                case 'kepala':
                    $suratMasukData['kepala_id'] = $assignedUserId;
                    break;
                case 'pmo':
                    $suratMasukData['pmo_id'] = $assignedUserId;
                    $suratMasukData['status_disposisi'] = 'pmo';
                    break;
                case 'pegawai':
                    $suratMasukData['pegawai_id'] = $assignedUserId;
                    $suratMasukData['status_disposisi'] = 'pegawai';
                    break;
            }
        }

        $suratMasuk = SuratMasuk::create($suratMasukData);

        $message = $assignedUserId ? 
            'Surat masuk berhasil ditambahkan dan diajukan ke user yang dipilih.' : 
            'Surat masuk berhasil ditambahkan sebagai draft.';

        return redirect()->route('admin.surat-masuk.index')->with('success', $message);
    }

    // Tampilkan detail surat masuk
    public function show($id)
    {
        $suratMasuk = SuratMasuk::with(['admin', 'assignedUser', 'kepala', 'pmo', 'pegawai'])
            ->findOrFail($id);
            
        return inertia('admin/surat-masuk/show', [
            'suratMasuk' => $suratMasuk,
        ]);
    }

    // Tampilkan form edit surat masuk
    public function edit($id)
    {
        $suratMasuk = SuratMasuk::findOrFail($id);
        
        // Ambil daftar semua user yang bisa menerima disposisi untuk pilihan pengajuan
        $usersCanDispose = User::whoCanDispose()
            ->select('id', 'name', 'email', 'role', 'jabatan')
            ->orderBy('role')
            ->orderBy('name')
            ->get();
        
        return inertia('admin/surat-masuk/edit', [
            'suratMasuk' => $suratMasuk,
            'usersCanDispose' => $usersCanDispose
        ]);
    }

    // Update surat masuk
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'no_agenda' => 'required|string|max:255',
            'no_surat' => 'required|string|max:255',
            'tanggal_surat' => 'required|date',
            'tanggal_diterima' => 'required|date',
            'pengirim' => 'required|string|max:255',
            'hal_surat' => 'required|string|max:255',
            'jenis_surat' => 'required|string|max:255',
            'file_surat' => 'nullable|file|mimes:pdf,doc,docx,odt|max:10240',
            'tujuan_surat' => 'required|string|max:255',
            'pesan_tambahan' => 'nullable|string',
        ]);

        $suratMasuk = SuratMasuk::findOrFail($id);

        // Handle file upload jika ada file baru
        if ($request->hasFile('file_surat')) {
            // Hapus file lama jika ada
            if ($suratMasuk->file_surat) {
                Storage::disk('public')->delete($suratMasuk->file_surat);
            }
            $filePath = $request->file('file_surat')->store('surat-masuk', 'public');
            $validated['file_surat'] = $filePath;
        } else {
            // Jika tidak ada file baru, jangan update kolom file_surat
            unset($validated['file_surat']);
        }

        $suratMasuk->update($validated);

        return redirect()->route('admin.surat-masuk.index')->with('success', 'Surat masuk berhasil diperbarui.');
    }

    // Hapus surat masuk
    public function destroy($id)
    {
        $suratMasuk = SuratMasuk::findOrFail($id);
        
        // Hapus file terkait
        if ($suratMasuk->file_surat) {
            Storage::disk('public')->delete($suratMasuk->file_surat);
        }
        
        $suratMasuk->delete();

        return redirect()->route('admin.surat-masuk.index')->with('success', 'Surat masuk berhasil dihapus.');
    }

    // Method untuk mengajukan surat ke user dengan privilege
    public function ajukanKeUser(Request $request, $id)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'pesan_tambahan' => 'nullable|string|max:1000'
        ]);

        $suratMasuk = SuratMasuk::findOrFail($id);
        $targetUser = User::findOrFail($request->user_id);

        // Pastikan target user bisa menerima disposisi
        if (!$targetUser->canDispose()) {
            return back()->withErrors(['error' => 'User yang dipilih tidak memiliki hak untuk menerima disposisi.']);
        }

        // Pastikan surat bisa diajukan (status masih draft atau diajukan)
        if (!in_array($suratMasuk->status_disposisi, ['draft', 'diajukan'])) {
            return back()->withErrors(['error' => 'Surat sudah dalam proses disposisi.']);
        }

        // Update surat dengan assigned user yang fleksibel
        $updateData = [
            'status_disposisi' => 'diajukan',
            'assigned_user_id' => $request->user_id,
            'pesan_tambahan' => $request->pesan_tambahan,
            'disposisi_at' => now()
        ];

        // Set field spesifik berdasarkan role target user
        switch ($targetUser->role) {
            case 'kepala':
                $updateData['kepala_id'] = $request->user_id;
                break;
            case 'pmo':
                $updateData['pmo_id'] = $request->user_id;
                $updateData['status_disposisi'] = 'pmo';
                break;
            case 'pegawai':
                $updateData['pegawai_id'] = $request->user_id;
                $updateData['status_disposisi'] = 'pegawai';
                break;
        }

        $suratMasuk->update($updateData);

        $roleTarget = $targetUser->role === 'kepala' ? 'kepala' : 'user dengan privilege';
        
        return redirect()->route('admin.surat-masuk.index')
            ->with('success', "Surat berhasil diajukan ke {$roleTarget}: {$targetUser->name}.");
    }

    // Tampilkan form ajukan ke user dengan privilege
    public function showAjukan($id)
    {
        $suratMasuk = SuratMasuk::findOrFail($id);
        
        // Ambil semua user yang bisa menerima disposisi
        $usersCanDispose = User::whoCanDispose()
            ->select('id', 'name', 'role', 'jabatan')
            ->orderBy('role')
            ->orderBy('name')
            ->get();
        
        return inertia('admin/surat-masuk/ajukan', [
            'suratMasuk' => $suratMasuk,
            'usersCanDispose' => $usersCanDispose
        ]);
    }

    // Tandai surat masuk sebagai dibaca
    public function markAsRead($id)
    {
        $suratMasuk = SuratMasuk::findOrFail($id);
        $suratMasuk->update(['status_baca' => 'dibaca']);

        return redirect()->back()->with('success', 'Surat masuk berhasil ditandai sebagai dibaca.');
    }

    // Tandai surat masuk sebagai belum dibaca
    public function markAsUnread($id)
    {
        $suratMasuk = SuratMasuk::findOrFail($id);
        $suratMasuk->update(['status_baca' => 'belum dibaca']);

        return redirect()->back()->with('success', 'Surat masuk berhasil ditandai sebagai belum dibaca.');
    }

    // Download surat masuk
    public function downloadFile($id)
    {
        $suratMasuk = SuratMasuk::findOrFail($id);
        
        $filePath = storage_path('app/public/' . $suratMasuk->file_surat);
        
        if (!file_exists($filePath)) {
            return redirect()->back()->withErrors(['error' => 'File tidak ditemukan.']);
        }
        
        return response()->download($filePath);
    }

    // View PDF file inline
    public function viewFile($id)
    {
        $suratMasuk = SuratMasuk::findOrFail($id);
        
        $filePath = storage_path('app/public/' . $suratMasuk->file_surat);
        
        if (!file_exists($filePath)) {
            abort(404, 'File tidak ditemukan.');
        }
        
        $fileExtension = pathinfo($suratMasuk->file_surat, PATHINFO_EXTENSION);
        
        if (strtolower($fileExtension) === 'pdf') {
            return response()->file($filePath, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'inline; filename="' . basename($suratMasuk->file_surat) . '"'
            ]);
        }
        
        // For non-PDF files, force download
        return $this->downloadFile($id);
    }

    // Method untuk rekap surat (admin only)
    public function rekapSurat(Request $request)
    {
        // Pastikan hanya admin yang bisa akses
        if (Auth::user()->role !== 'admin') {
            abort(403, 'Anda tidak memiliki akses ke halaman ini.');
        }

        $query = SuratMasuk::with(['admin', 'kepala', 'pmo', 'pegawai', 'assignedUser', 'assignments.user']);

        // Filter berdasarkan tanggal
        if ($request->filled('tanggal_mulai')) {
            $query->whereDate('tanggal_diterima', '>=', $request->tanggal_mulai);
        }

        if ($request->filled('tanggal_selesai')) {
            $query->whereDate('tanggal_diterima', '<=', $request->tanggal_selesai);
        }

        // Filter berdasarkan status
        if ($request->filled('status')) {
            $query->where('status_disposisi', $request->status);
        }

        // Filter berdasarkan pengirim surat
        if ($request->filled('pengirim')) {
            $query->where('pengirim', 'like', '%' . $request->pengirim . '%');
        }

        $suratMasuks = $query->orderBy('tanggal_diterima', 'desc')->get();

        // Statistik rekap
        $totalSurat = $suratMasuks->count();
        $statusStats = [
            'diajukan' => $suratMasuks->where('status_disposisi', 'diajukan')->count(),
            'pmo' => $suratMasuks->where('status_disposisi', 'pmo')->count(),
            'pegawai' => $suratMasuks->where('status_disposisi', 'pegawai')->count(),
            'selesai' => $suratMasuks->where('status_disposisi', 'selesai')->count(),
        ];

        // Statistik berdasarkan bulan (untuk chart)  
        $monthlyStats = SuratMasuk::selectRaw('DATE_FORMAT(tanggal_diterima, "%Y-%m") as month, COUNT(*) as count')
            ->groupBy('month')
            ->orderBy('month')
            ->pluck('count', 'month');

        // Ambil daftar kepala untuk filter (tidak digunakan lagi)
        // $kepalaList = User::where('role', 'kepala')->select('id', 'name')->get();

        return inertia('admin/surat-masuk/rekap', [
            'suratMasuks' => $suratMasuks,
            'filters' => $request->only(['tanggal_mulai', 'tanggal_selesai', 'status', 'pengirim']),
            // 'kepalaList' => $kepalaList,
            'statistics' => [
                'total' => $totalSurat,
                'status' => $statusStats,
                'monthly' => $monthlyStats,
            ]
        ]);
    }

    // Method untuk export rekap ke Excel/CSV
    public function exportRekap(Request $request)
    {
        // Pastikan hanya admin yang bisa akses
        if (Auth::user()->role !== 'admin') {
            abort(403, 'Anda tidak memiliki akses ke fitur ini.');
        }

        $query = SuratMasuk::with(['admin', 'kepala', 'pmo', 'pegawai', 'assignedUser']);

        // Apply same filters as rekap
        if ($request->filled('tanggal_mulai')) {
            $query->whereDate('tanggal_diterima', '>=', $request->tanggal_mulai);
        }

        if ($request->filled('tanggal_selesai')) {
            $query->whereDate('tanggal_diterima', '<=', $request->tanggal_selesai);
        }

        if ($request->filled('status')) {
            $query->where('status_disposisi', $request->status);
        }

        if ($request->filled('kepala_id')) {
            $query->where('kepala_id', $request->kepala_id);
        }

        if ($request->filled('pengirim')) {
            $query->where('pengirim', 'like', '%' . $request->pengirim . '%');
        }

        $suratMasuks = $query->orderBy('tanggal_diterima', 'desc')->get();

        // Generate CSV content
        $csvData = [];
        $csvData[] = [
            'No',
            'Nomor Surat',
            'Pengirim',
            'Perihal',
            'Tanggal Diterima',
            'Tanggal Surat',
            'Status',
            'Kepala',
            'PMO',
            'Pegawai',
            'Disposisi At'
        ];

        foreach ($suratMasuks as $index => $surat) {
            $csvData[] = [
                $index + 1,
                $surat->no_surat,
                $surat->pengirim,
                $surat->hal_surat,
                $surat->tanggal_diterima,
                $surat->tanggal_surat,
                ucfirst($surat->status_disposisi),
                $surat->kepala ? $surat->kepala->name : '-',
                $surat->pmo ? $surat->pmo->name : '-',
                $surat->pegawai ? $surat->pegawai->name : '-',
                $surat->disposisi_at ? \Carbon\Carbon::parse($surat->disposisi_at)->format('d/m/Y H:i') : '-'
            ];
        }

        $filename = 'rekap-surat-masuk-' . date('Y-m-d-H-i-s') . '.csv';
        
        $callback = function() use ($csvData) {
            $file = fopen('php://output', 'w');
            
            // Add BOM for UTF-8 to ensure proper character encoding in Excel
            fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));
            
            foreach ($csvData as $row) {
                fputcsv($file, $row);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }
}
