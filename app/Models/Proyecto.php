<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Proyecto extends Model
{
    use HasFactory;

    protected $fillable = [
        'propuesta_id',
        'cliente_id',
        'user_id',
        'nombre',
        'descripcion',
        'estado',
        'fecha_inicio',
        'fecha_entrega',
        'precio_total',
        'forma_pago',
        'notas',
    ];

    protected $casts = [
        'fecha_inicio' => 'date',
        'fecha_entrega' => 'date',
        'precio_total' => 'decimal:2',
    ];

    // Relaciones
    public function propuesta(): BelongsTo
    {
        return $this->belongsTo(Propuesta::class);
    }

    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function tareas(): HasMany
    {
        return $this->hasMany(ProyectoTarea::class)->orderBy('orden');
    }

    // Scopes para filtrado
    public function scopePorEstado($query, $estado)
    {
        return $query->where('estado', $estado);
    }

    public function scopePorEmpezar($query)
    {
        return $query->where('estado', 'por_empezar');
    }

    public function scopeEnProgreso($query)
    {
        return $query->where('estado', 'en_progreso');
    }

    public function scopeEnPausa($query)
    {
        return $query->where('estado', 'en_pausa');
    }

    public function scopeCompletados($query)
    {
        return $query->where('estado', 'completado');
    }

    // Accessors
    public function getEstadoColorAttribute()
    {
        return match($this->estado) {
            'por_empezar' => 'bg-gray-100 text-gray-800',
            'en_progreso' => 'bg-blue-100 text-blue-800',
            'en_pausa' => 'bg-yellow-100 text-yellow-800',
            'completado' => 'bg-green-100 text-green-800',
            default => 'bg-gray-100 text-gray-800'
        };
    }

    public function getEstadoIconoAttribute()
    {
        return match($this->estado) {
            'por_empezar' => '⏳',
            'en_progreso' => '🚀',
            'en_pausa' => '⏸️',
            'completado' => '✅',
            default => '⏳'
        };
    }

    public function getPrecioFormateadoAttribute()
    {
        return '$' . number_format($this->precio_total, 2, '.', ',');
    }

    public function getProgresoAttribute()
    {
        $totalTareas = $this->tareas()->count();
        if ($totalTareas === 0) {
            return 0;
        }
        
        $tareasCompletadas = $this->tareas()->where('completada', true)->count();
        return round(($tareasCompletadas / $totalTareas) * 100);
    }

    // Métodos de acción
    public function iniciar($fechaInicio = null)
    {
        $this->update([
            'estado' => 'en_progreso',
            'fecha_inicio' => $fechaInicio ?? now(),
        ]);
    }

    public function pausar()
    {
        $this->update(['estado' => 'en_pausa']);
    }

    public function reanudar()
    {
        $this->update(['estado' => 'en_progreso']);
    }

    public function completar()
    {
        $this->update(['estado' => 'completado']);
    }

    // Método estático para crear desde propuesta
    public static function crearDesdePropuesta(Propuesta $propuesta)
    {
        return self::create([
            'propuesta_id' => $propuesta->id,
            'cliente_id' => $propuesta->cliente_id,
            'user_id' => $propuesta->user_id,
            'nombre' => $propuesta->titulo,
            'descripcion' => $propuesta->descripcion_proyecto,
            'precio_total' => $propuesta->precio_total,
            'forma_pago' => $propuesta->forma_pago,
            'estado' => 'por_empezar',
        ]);
    }
}
