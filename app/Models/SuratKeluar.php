<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SuratKeluar extends Model
{
    // Specify table name
    protected $table = 'surat_keluars';

    // Mass assignable fields (biar bisa diisi / mass isert atau mass update)
    protected $fillable = [
        'no_surat',
        'tanggal_surat',
        'kepada',
        'hal_surat',
        'jenis_surat',
        'file_surat',
        'dibuat_oleh',
        'status',
        'keterangan_tindak_lanjut',
        'tanggal_tindak_lanjut'
    ];

    // relasi ke tabel users
    public function pembuat()
    {
        return $this->belongsTo(User::class, 'dibuat_oleh');
    }
}
