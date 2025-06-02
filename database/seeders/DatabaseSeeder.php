<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'admin',
            'email' => 'admin@mail.com',
            'role' => 'admin',
            'password' => bcrypt('Password!'),
        ]);

        // Jalankan seeder untuk kepala
        $this->call([
            KepalaUserSeeder::class,
            PmoUserSeeder::class,
            PegawaiUserSeeder::class,
        ]);
    }
}
