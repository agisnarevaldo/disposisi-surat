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
        'pesan_tambahan',
        'status_disposisi',
        'admin_id',
        'assigned_user_id',
        'kepala_id',
        'pmo_id',
        'pegawai_id',
        'disposisi_at'
    ];

    protected $casts = [
        'tanggal_surat' => 'date',
        'tanggal_diterima' => 'date',
        'disposisi_at' => 'datetime',
    ];

    // Relationships
    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id');
    }

    public function assignedUser()
    {
        return $this->belongsTo(User::class, 'assigned_user_id');
    }

    public function kepala()
    {
        return $this->belongsTo(User::class, 'kepala_id');
    }

    public function pmo()
    {
        return $this->belongsTo(User::class, 'pmo_id');
    }

    public function pegawai()
    {
        return $this->belongsTo(User::class, 'pegawai_id');
    }

    // Relationship untuk multiple assignments
    public function assignments()
    {
        return $this->hasMany(SuratAssignment::class);
    }

    public function activeAssignments()
    {
        return $this->hasMany(SuratAssignment::class)->where('status', 'assigned');
    }

    public function assignedUsers()
    {
        return $this->belongsToMany(User::class, 'surat_assignments', 'surat_masuk_id', 'user_id')
                    ->withPivot(['status', 'catatan_assignment', 'catatan_completion', 'completed_at', 'assigned_by_user_id'])
                    ->withTimestamps();
    }

    // Helper methods untuk alur disposisi
    public function canDisposisiToKepala()
    {
        return $this->status_disposisi === 'diajukan';
    }

    public function canDisposisiByKepala()
    {
        return $this->status_disposisi === 'diajukan' && !$this->kepala_id;
    }

    public function canDisposisiToPmo()
    {
        return $this->status_disposisi === 'pmo';
    }

    public function canDisposisiToPegawai()
    {
        return $this->status_disposisi === 'pmo' || $this->status_disposisi === 'pegawai';
    }

    public function isSelesai()
    {
        return $this->status_disposisi === 'selesai';
    }

    // Helper methods untuk flexible workflow
    public function isAssignedTo($userId)
    {
        return $this->assigned_user_id == $userId;
    }

    public function getAssignedUserRole()
    {
        return $this->assignedUser ? $this->assignedUser->role : null;
    }

    public function canBeDisposedBy($user)
    {
        // Admin yang membuat surat dapat mengajukan
        if ($this->admin_id == $user->id && $this->status_disposisi === 'draft') {
            return true;
        }

        // User yang ditugaskan dapat melakukan disposisi sesuai role
        if ($this->assigned_user_id == $user->id && $this->status_disposisi === 'diajukan') {
            return true;
        }

        // Kepala dapat disposisi jika surat assigned ke mereka atau sesuai workflow lama
        if ($user->role === 'kepala' && ($this->assigned_user_id == $user->id || $this->kepala_id == $user->id)) {
            return true;
        }

        // PMO dapat disposisi jika surat didisposisi ke mereka
        if ($user->role === 'pmo' && $this->pmo_id == $user->id && $this->status_disposisi === 'pmo') {
            return true;
        }

        return false;
    }

    public function getCurrentAssignedUser()
    {
        switch ($this->status_disposisi) {
            case 'draft':
                return $this->admin;
            case 'diajukan':
                return $this->assignedUser ?: $this->kepala;
            case 'kepala':
                return $this->kepala;
            case 'pmo':
                return $this->pmo;
            case 'pegawai':
                return $this->pegawai;
            case 'selesai':
                return $this->pegawai;
            default:
                return null;
        }
    }
}
