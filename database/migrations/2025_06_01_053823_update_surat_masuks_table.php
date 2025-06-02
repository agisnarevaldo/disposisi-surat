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
        Schema::table('surat_masuks', function (Blueprint $table) {
            $table->enum('status_disposisi', ['diajukan', 'kepala', 'pmo', 'pegawai', 'selesai'])
                ->default('diajukan')
                ->after('status_tindak_lanjut');

            $table->unsignedBigInteger('admin_id')->nullable()->after('status_disposisi');
            $table->foreign('admin_id')->references('id')->on('users')->onDelete('set null');

            $table->unsignedBigInteger('kepala_id')->nullable()->after('admin_id');
            $table->foreign('kepala_id')->references('id')->on('users')->onDelete('set null');

            $table->unsignedBigInteger('pmo_id')->nullable()->after('kepala_id');
            $table->foreign('pmo_id')->references('id')->on('users')->onDelete('set null');

            $table->unsignedBigInteger('pegawai_id')->nullable()->after('pmo_id');
            $table->foreign('pegawai_id')->references('id')->on('users')->onDelete('set null');

            $table->timestamp('disposisi_at')->nullable()->after('pegawai_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {

        Schema::table('surat_masuks', function (Blueprint $table) {
            // Drop foreign keys
            $table->dropForeign(['admin_id']);
            $table->dropForeign(['kepala_id']);
            $table->dropForeign(['pmo_id']);
            $table->dropForeign(['pegawai_id']);

            // Drop columns
            $table->dropColumn([
                'status_disposisi',
                'admin_id',
                'kepala_id',
                'pmo_id',
                'pegawai_id',
                'disposisi_at'
            ]);
        });
    }
};
