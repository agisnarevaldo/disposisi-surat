<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SuratAssignment extends Model
{
    use HasFactory;

    protected $fillable = [
        'surat_masuk_id',
        'user_id',
        'assigned_by_user_id',
        'status',
        'catatan_assignment',
        'catatan_completion',
        'completed_at'
    ];

    protected $casts = [
        'completed_at' => 'datetime'
    ];

    // Relationships
    public function suratMasuk()
    {
        return $this->belongsTo(SuratMasuk::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function assignedBy()
    {
        return $this->belongsTo(User::class, 'assigned_by_user_id');
    }

    // Scopes
    public function scopeAssigned($query)
    {
        return $query->where('status', 'assigned');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }
}
