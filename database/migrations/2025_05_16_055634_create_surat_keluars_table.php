<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('surat_keluars', function (Blueprint $table) {
            $table->id();
            $table->string('no_surat');
            $table->date('tanggal_surat');
            $table->string('kepada');
            $table->string('hal_surat');
            $table->string('jenis_surat');
            $table->string('file_surat');
            $table->foreignId('dibuat_oleh')->constrained('users')->onDelete('cascade');
            $table->string('status')->default('pending');
            $table->text('keterangan_tindak_lanjut')->nullable();
            $table->date('tanggal_tindak_lanjut')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('surat_keluars');
    }
};
