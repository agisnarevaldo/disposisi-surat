<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class PmoUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Buat user PMO
        User::create([
            'name' => 'PMO BPS',
            'email' => 'pmo@bps.go.id',
            'password' => Hash::make('password'),
            'role' => 'pmo',
            'jabatan' => 'Project Management Officer',
            'email_verified_at' => now(),
        ]);

        // Buat beberapa user pegawai
        User::create([
            'name' => 'Pegawai 1',
            'email' => 'pegawai1@bps.go.id',
            'password' => Hash::make('password'),
            'role' => 'pegawai',
            'jabatan' => 'Statistisi Ahli Pertama',
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Pegawai 2',
            'email' => 'pegawai2@bps.go.id',
            'password' => Hash::make('password'),
            'role' => 'pegawai',
            'jabatan' => 'Statistisi Ahli Muda',
            'email_verified_at' => now(),
        ]);
    }
}
