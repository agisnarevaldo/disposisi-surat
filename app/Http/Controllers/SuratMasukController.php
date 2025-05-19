<?php

namespace App\Http\Controllers;

use App\Models\SuratMasuk;
use Illuminate\Http\Request;

class SuratMasukController extends Controller
{
    // Tampilkan semua surat masuk
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
        return inertia('SuratMasuk/Create');
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
            'file_surat' => 'required|file|mimes:pdf,doc,docx,odt|max:10240', // max 10MB, adjust as needed
        ]);

        $filePath = $request->file('file_surat')->store('surat-masuk', 'public');

        SuratMasuk::create([
            ...$request->except('file_surat'),
            'file_surat' => $filePath,
        ]);

        return redirect()->route('surat-masuk.index')->with('success', 'Surat masuk berhasil ditambahkan.');
    }

    // Tampilkan detail surat masuk
    public function show($id)
    {
        $suratMasuk = SuratMasuk::findOrFail($id);
        return inertia('SuratMasuk/Detail', [
            'suratMasuk' => $suratMasuk,
        ]);
    }

    // Tampilkan form edit surat masuk
    public function edit($id)
    {
        $suratMasuk = SuratMasuk::findOrFail($id);
        return inertia('SuratMasuk/Edit', [
            'suratMasuk' => $suratMasuk,
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
            'file_surat' => 'nullable|file|mimes:pdf,doc,docx,odt|max:10240', // max 10MB, adjust as needed
        ]);

        $suratMasuk = SuratMasuk::findOrFail($id);

        if ($request->hasFile('file_surat')) {
            $filePath = $request->file('file_surat')->store('surat-masuk', 'public');
            $validated['file_surat'] = $filePath;
        }

        $suratMasuk->update($validated);

        return redirect()->route('surat-masuk.index')->with('success', 'Surat masuk berhasil diperbarui.');
    }

    // Hapus surat masuk
    public function destroy($id)
    {
        $suratMasuk = SuratMasuk::findOrFail($id);
        $suratMasuk->delete();

        return redirect()->route('surat-masuk.index')->with('success', 'Surat masuk berhasil dihapus.');
    }

    // Tandai surat masuk sebagai dibaca
    public function markAsRead($id)
    {
        $suratMasuk = SuratMasuk::findOrFail($id);
        $suratMasuk->update(['status_baca' => 'dibaca']);

        return redirect()->route('surat-masuk.index')->with('success', 'Surat masuk berhasil ditandai sebagai dibaca.');
    }

    // Tandai surat masuk sebagai belum dibaca
    public function markAsUnread($id)
    {
        $suratMasuk = SuratMasuk::findOrFail($id);
        $suratMasuk->update(['status_baca' => 'belum dibaca']);

        return redirect()->route('surat-masuk.index')->with('success', 'Surat masuk berhasil ditandai sebagai belum dibaca.');
    }

    // Download surat masuk
    public function downloadFile($id)
    {
        $suratMasuk = SuratMasuk::findOrFail($id);
        return response()->download(storage_path('app/public/' . $suratMasuk->file_surat));
    }
}
