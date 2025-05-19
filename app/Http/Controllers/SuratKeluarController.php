<?php

namespace App\Http\Controllers;

use App\Models\SuratKeluar;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class SuratKeluarController extends Controller
{
    // Tampilkan semua surat keluar
    public function index()
    {
        $suratKeluars = SuratKeluar::with('pembuat')->latest()->get();

        return Inertia::render('SuratKeluar/Index', [
            'suratKeluars' => $suratKeluars,
        ]);
    }

    // Tampilkan form tambah surat keluar
    public function create()
    {
        return Inertia::render('SuratKeluar/Create');
    }

    // Simpan data baru
    public function store(Request $request)
    {
        $validated = $request->validate([
            'no_surat' => 'required|string|max:255',
            'tanggal_surat' => 'required|date',
            'kepada' => 'required|string|max:255',
            'hal_surat' => 'required|string|max:255',
            'jenis_surat' => 'required|string|max:255',
            'file_surat' => 'required|file|mimes:pdf,doc,docx,odt|max:10240', // max 10MB, adjust as needed
        ]);

        // Use Auth::user() or auth()->user() to get the authenticated user
        $validated['dibuat_oleh'] = Auth::user()->id; // OR $validated['dibuat_oleh'] = auth()->user()->id;

        // Handle file upload
        if ($request->hasFile('file_surat')) {
            $validated['file_surat'] = $request->file('file_surat')->store('surat-keluar', 'public');
        }

        SuratKeluar::create($validated);

        return redirect()->route('surat-keluar.index')->with('success', 'Surat keluar berhasil ditambahkan.');
    }

    // Tampilkan detail surat keluar
    public function show($id)
    {
        $suratKeluar = SuratKeluar::with('pembuat')->findOrFail($id);
        return Inertia::render('SuratKeluar/Detail', [
            'suratKeluar' => $suratKeluar,
        ]);
    }

    // Tampilkan form edit surat keluar
    public function edit($id)
    {
        $suratKeluar = SuratKeluar::findOrFail($id);
        return Inertia::render('SuratKeluar/Edit', [
            'suratKeluar' => $suratKeluar,
        ]);
    }

    // Update surat keluar
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'no_surat' => 'required|string|max:255',
            'tanggal_surat' => 'required|date',
            'kepada' => 'required|string|max:255',
            'hal_surat' => 'required|string|max:255',
            'jenis_surat' => 'required|string|max:255',
            'file_surat' => 'nullable|file|mimes:pdf,doc,docx,odt|max:10240', // max 10MB, adjust as needed
        ]);

        $suratKeluar = SuratKeluar::findOrFail($id);

        // Handle file upload if a new file is provided
        if ($request->hasFile('file_surat')) {
            // Delete the old file if it exists
            if ($suratKeluar->file_surat) {
                Storage::disk('public')->delete($suratKeluar->file_surat);
            }
            $validated['file_surat'] = $request->file('file_surat')->store('surat-keluar', 'public');
        }

        $suratKeluar->update($validated);

        return redirect()->route('surat-keluar.index')->with('success', 'Surat keluar berhasil diperbarui.');
    }

    // Hapus surat keluar
    public function destroy($id)
    {
        $suratKeluar = SuratKeluar::findOrFail($id);

        // Delete the file if it exists
        if ($suratKeluar->file_surat) {
            Storage::disk('public')->delete($suratKeluar->file_surat);
        }

        $suratKeluar->delete();

        return redirect()->route('surat-keluar.index')->with('success', 'Surat keluar berhasil dihapus.');
    }

    // Download surat keluar
    public function downloadFile($id)
    {
        $suratKeluar = SuratKeluar::findOrFail($id);

        // Assuming 'file_surat' is the path stored in the database
        $filePath = $suratKeluar->file_surat;

        if (!$filePath || !Storage::disk('public')->exists($filePath)) {
            abort(404, 'File not found.');
        }

        return response()->download(storage_path('app/public/' . $filePath));
    }

    // Tampilkan form tindak lanjut surat keluar
    public function tindakLanjut($id)
    {
        $suratKeluar = SuratKeluar::findOrFail($id);
        return Inertia::render('SuratKeluar/TindakLanjut', [
            'suratKeluar' => $suratKeluar,
        ]);
    }

    // Simpan tindak lanjut surat keluar
    public function simpanTindakLanjut(Request $request, $id)
    {
        $validated = $request->validate([
            'keterangan_tindak_lanjut' => 'required|string|max:255',
            'tanggal_tindak_lanjut' => 'required|date',
        ]);

        $suratKeluar = SuratKeluar::findOrFail($id);
        $suratKeluar->update($validated);

        return redirect()->route('surat-keluar.index')->with('success', 'Tindak lanjut surat keluar berhasil disimpan.');
    }
}
