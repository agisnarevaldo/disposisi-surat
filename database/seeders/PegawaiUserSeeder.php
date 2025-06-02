<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class PegawaiUserSeeder extends Seeder
{
    public function run(): void
    {
        // Create pegawai users
        $pegawaiUsers = [
            [
                'name' => 'Ahmad Rizki',
                'email' => 'ahmad.rizki@disposisi.local',
                'password' => Hash::make('password123'),
                'role' => 'pegawai',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Siti Nurhaliza',
                'email' => 'siti.nurhaliza@disposisi.local',
                'password' => Hash::make('password123'),
                'role' => 'pegawai',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Budi Santoso',
                'email' => 'budi.santoso@disposisi.local',
                'password' => Hash::make('password123'),
                'role' => 'pegawai',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Dewi Sartika',
                'email' => 'dewi.sartika@disposisi.local',
                'password' => Hash::make('password123'),
                'role' => 'pegawai',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Eko Prabowo',
                'email' => 'eko.prabowo@disposisi.local',
                'password' => Hash::make('password123'),
                'role' => 'pegawai',
                'email_verified_at' => now(),
            ],
        ];

        foreach ($pegawaiUsers as $userData) {
            User::updateOrCreate(
                ['email' => $userData['email']],
                $userData
            );
        }

        $this->command->info('Pegawai users seeded successfully!');
        $this->command->info('Login credentials for pegawai users:');
        $this->command->info('Email: ahmad.rizki@disposisi.local | Password: password123');
        $this->command->info('Email: siti.nurhaliza@disposisi.local | Password: password123');
        $this->command->info('Email: budi.santoso@disposisi.local | Password: password123');
        $this->command->info('Email: dewi.sartika@disposisi.local | Password: password123');
        $this->command->info('Email: eko.prabowo@disposisi.local | Password: password123');
    }
}
