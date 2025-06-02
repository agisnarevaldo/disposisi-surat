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
        Schema::create('disposisi_logs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('surat_masuk_id');
            $table->foreign('surat_masuk_id')->references('id')->on('surat_masuks')->onDelete('cascade');
            $table->string('status_lama')->nullable();
            $table->string('status_baru')->nullable();
            $table->unsignedBigInteger('changed_by_user_id');
            $table->foreign('changed_by_user_id')->references('id')->on('users')->onDelete('cascade');
            $table->unsignedBigInteger('disposisi_ke_user_id')->nullable();
            $table->foreign('disposisi_ke_user_id')->references('id')->on('users')->onDelete('set null');
            $table->text('catatan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('disposisi_logs');
    }
};
