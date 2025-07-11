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
        Schema::create('surat_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('surat_masuk_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('assigned_by_user_id')->constrained('users')->onDelete('cascade');
            $table->enum('status', ['assigned', 'completed'])->default('assigned');
            $table->text('catatan_assignment')->nullable();
            $table->text('catatan_completion')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            // Unique constraint: satu surat tidak bisa di-assign ke user yang sama dua kali
            $table->unique(['surat_masuk_id', 'user_id']);
            
            // Index untuk performance
            $table->index(['surat_masuk_id', 'status']);
            $table->index(['user_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('surat_assignments');
    }
};
