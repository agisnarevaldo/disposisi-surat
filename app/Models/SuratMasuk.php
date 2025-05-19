<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SuratMasuk extends Model
{
    // Specipy table name
    protected $table = 'surat_masuks';
    // Mass assignable fields (biar bisa diisi / mass isert atau mass update)
    protected $fillable = [
        'no_agenda',
        'no_surat',
        'tanggal_surat',
        'tanggal_diterima',
        'pengirim',
        'hal_surat',
        'jenis_surat',
        'file_surat',
        'tujuan_surat',
        'status_baca',
        'status_tindak_lanjut',
        'pesan_tambahan'
    ];
}
