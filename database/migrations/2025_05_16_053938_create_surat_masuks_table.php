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
        Schema::create('surat_masuks', function (Blueprint $table) {
            $table->id();
            $table->string('no_agenda');
            $table->string('no_surat');
            $table->date('tanggal_surat');
            $table->date('tanggal_diterima');
            $table->string('pengirim');
            $table->string('hal_surat');
            $table->string('jenis_surat');
            $table->string('file_surat');
            $table->string('tujuan_surat');
            $table->string('status_baca')->default('belum dibaca');
            $table->string('status_tindak_lanjut')->default('belum');
            $table->text('pesan_tambahan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('surat_masuks');
    }
};
