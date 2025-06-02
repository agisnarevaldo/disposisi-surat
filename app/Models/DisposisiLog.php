<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DisposisiLog extends Model
{
    protected $fillable = [
        'surat_masuk_id',
        'status_lama',
        'status_baru',
        'changed_by_user_id',
        'catatan',
        'disposisi_ke_user_id'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relationships
    public function suratMasuk()
    {
        return $this->belongsTo(SuratMasuk::class);
    }

    public function changedBy()
    {
        return $this->belongsTo(User::class, 'changed_by_user_id');
    }

    public function disposisiKeUser()
    {
        return $this->belongsTo(User::class, 'disposisi_ke_user_id');
    }
}
