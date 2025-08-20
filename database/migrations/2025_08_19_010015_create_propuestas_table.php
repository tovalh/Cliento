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
        Schema::create('propuestas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cliente_id')->constrained('clientes')->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            // Información básica
            $table->string('titulo');
            $table->enum('estado', ['borrador', 'enviada', 'aprobada', 'rechazada', 'negociacion'])
                  ->default('borrador');
            $table->date('fecha_envio')->nullable();
            $table->date('fecha_limite_respuesta')->nullable();
            
            // Contenido de la propuesta
            $table->text('descripcion_proyecto');
            $table->text('alcance_incluye');
            $table->text('alcance_no_incluye')->nullable();
            $table->decimal('precio_total', 10, 2);
            $table->string('forma_pago');
            $table->string('tiempo_entrega');
            $table->text('terminos_condiciones')->nullable();
            
            // Seguimiento
            $table->date('fecha_ultimo_followup')->nullable();
            $table->date('proximo_recordatorio')->nullable();
            $table->text('notas_internas')->nullable();
            
            $table->timestamps();
            
            // Índices para optimización
            $table->index(['cliente_id', 'estado']);
            $table->index(['fecha_envio']);
            $table->index(['estado']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('propuestas');
    }
};