<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class KepalaUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Kepala BPS',
            'email' => 'kepala@bps.go.id',
            'password' => Hash::make('password'),
            'role' => 'kepala',
            'jabatan' => 'Kepala Badan Pusat Statistik',
            'email_verified_at' => now(),
        ]);
    }
}
