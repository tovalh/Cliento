<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProyectoTarea extends Model
{
    use HasFactory;

    protected $fillable = [
        'proyecto_id',
        'user_id',
        'titulo',
        'descripcion',
        'completada',
        'fecha_limite',
        'orden',
        'completada_en',
    ];

    protected $casts = [
        'completada' => 'boolean',
        'fecha_limite' => 'date',
        'completada_en' => 'datetime',
    ];

    // Relaciones
    public function proyecto(): BelongsTo
    {
        return $this->belongsTo(Proyecto::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Scopes
    public function scopePendientes($query)
    {
        return $query->where('completada', false);
    }

    public function scopeCompletadas($query)
    {
        return $query->where('completada', true);
    }

    public function scopeVencidas($query)
    {
        return $query->where('completada', false)
                    ->where('fecha_limite', '<', today());
    }

    // Métodos de acción
    public function completar()
    {
        $this->update([
            'completada' => true,
            'completada_en' => now(),
        ]);
    }

    public function marcarPendiente()
    {
        $this->update([
            'completada' => false,
            'completada_en' => null,
        ]);
    }
}
