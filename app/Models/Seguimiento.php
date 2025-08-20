<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class Seguimiento extends Model
{
    use HasFactory;

    protected $table = 'seguimientos';

    protected $fillable = [
        'cliente_id',
        'user_id',
        'titulo',
        'descripcion',
        'fecha_seguimiento',
        'prioridad',
        'tipo',
        'completado',
        'completado_en',
    ];

    protected $casts = [
        'fecha_seguimiento' => 'date',
        'completado' => 'boolean',
        'completado_en' => 'datetime',
    ];

    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopePendientes($query)
    {
        return $query->where('completado', false);
    }

    public function scopeVencidos($query)
    {
        return $query->where('completado', false)
                    ->where('fecha_seguimiento', '<', today());
    }

    public function scopeHoy($query)
    {
        return $query->where('completado', false)
                    ->where('fecha_seguimiento', today());
    }

    public function scopeProximosDias($query, $dias = 7)
    {
        return $query->where('completado', false)
                    ->where('fecha_seguimiento', '<=', today()->addDays($dias))
                    ->where('fecha_seguimiento', '>=', today());
    }

    public function scopePorPrioridad($query, $prioridad)
    {
        return $query->where('prioridad', $prioridad);
    }

    public function completar()
    {
        $this->update([
            'completado' => true,
            'completado_en' => now(),
        ]);
    }

    public function getEstadoAttribute()
    {
        if ($this->completado) {
            return 'completado';
        }

        if ($this->fecha_seguimiento < today()) {
            return 'vencido';
        }

        if ($this->fecha_seguimiento->isToday()) {
            return 'hoy';
        }

        return 'pendiente';
    }

    public function getDiasRestantesAttribute()
    {
        if ($this->completado) {
            return null;
        }

        return today()->diffInDays($this->fecha_seguimiento, false);
    }
}
