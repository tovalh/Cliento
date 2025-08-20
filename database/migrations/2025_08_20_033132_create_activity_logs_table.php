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
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            // Información de la actividad
            $table->string('action'); // 'created', 'updated', 'completed', 'sent', etc.
            $table->string('model_type'); // 'Cliente', 'Propuesta', 'Seguimiento', etc.
            $table->unsignedBigInteger('model_id')->nullable(); // ID del modelo relacionado
            
            // Descripciones para el feed
            $table->string('title'); // "Completaste la tarea 'Enviar borrador'"
            $table->text('description'); // "para María González"
            $table->string('icon')->default('📝'); // Emoji o clase de icono
            
            // Metadatos adicionales
            $table->json('metadata')->nullable(); // Información extra en JSON
            
            $table->timestamps();
            
            // Índices para búsquedas rápidas
            $table->index(['user_id', 'created_at']);
            $table->index(['model_type', 'model_id']);
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
    }
};
