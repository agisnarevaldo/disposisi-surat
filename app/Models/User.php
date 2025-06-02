<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'jabatan',
        'nip',
        'alamat',
        'no_hp',
        'can_dispose',
        'keterangan_privilege',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'can_dispose' => 'boolean',
        ];
    }

    /**
     * Check if user can dispose letters
     */
    public function canDispose(): bool
    {
        // Kepala always can dispose
        if ($this->role === 'kepala') {
            return true;
        }
        
        // PMO and pegawai need explicit can_dispose privilege
        return ($this->role === 'pmo' || $this->role === 'pegawai') && $this->can_dispose;
    }

    /**
     * Get users who can dispose letters
     */
    public static function whoCanDispose()
    {
        return static::where(function ($query) {
            $query->where('role', 'kepala') // Kepala always can dispose
                  ->orWhere(function ($q) {
                      $q->whereIn('role', ['pmo', 'pegawai'])
                        ->where('can_dispose', true);
                  });
        });
    }
}
