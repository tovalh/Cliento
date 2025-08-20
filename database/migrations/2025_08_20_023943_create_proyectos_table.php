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
        Schema::create('proyectos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('propuesta_id')->constrained('propuestas')->onDelete('cascade');
            $table->foreignId('cliente_id')->constrained('clientes')->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            // Información básica del proyecto
            $table->string('nombre');
            $table->text('descripcion');
            $table->enum('estado', ['por_empezar', 'en_progreso', 'en_pausa', 'completado'])
                  ->default('por_empezar');
            
            // Fechas clave
            $table->date('fecha_inicio')->nullable();
            $table->date('fecha_entrega')->nullable();
            
            // Información financiera (copiada de la propuesta)
            $table->decimal('precio_total', 10, 2);
            $table->string('forma_pago');
            
            // Notas del proyecto
            $table->text('notas')->nullable();
            
            $table->timestamps();
            
            // Índices
            $table->index(['cliente_id', 'estado']);
            $table->index(['estado']);
            $table->index(['fecha_inicio']);
            $table->index(['fecha_entrega']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('proyectos');
    }
};
