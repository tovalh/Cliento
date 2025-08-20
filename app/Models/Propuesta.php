<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Propuesta extends Model
{
    use HasFactory;

    protected $fillable = [
        'cliente_id',
        'user_id',
        'titulo',
        'estado',
        'fecha_envio',
        'fecha_limite_respuesta',
        'descripcion_proyecto',
        'alcance_incluye',
        'alcance_no_incluye',
        'precio_total',
        'forma_pago',
        'tiempo_entrega',
        'terminos_condiciones',
        'fecha_ultimo_followup',
        'proximo_recordatorio',
        'notas_internas',
    ];

    protected $casts = [
        'fecha_envio' => 'date',
        'fecha_limite_respuesta' => 'date',
        'fecha_ultimo_followup' => 'date',
        'proximo_recordatorio' => 'date',
        'precio_total' => 'decimal:2',
    ];

    // Relaciones
    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function proyecto()
    {
        return $this->hasOne(Proyecto::class);
    }

    // Scopes para filtrado
    public function scopePorEstado($query, $estado)
    {
        return $query->where('estado', $estado);
    }

    public function scopeBorradores($query)
    {
        return $query->where('estado', 'borrador');
    }

    public function scopeEnviadas($query)
    {
        return $query->where('estado', 'enviada');
    }

    public function scopeAprobadas($query)
    {
        return $query->where('estado', 'aprobada');
    }

    public function scopeRechazadas($query)
    {
        return $query->where('estado', 'rechazada');
    }

    public function scopeEnNegociacion($query)
    {
        return $query->where('estado', 'negociacion');
    }

    public function scopeProximasAVencer($query, $dias = 7)
    {
        return $query->where('fecha_limite_respuesta', '<=', now()->addDays($dias))
                    ->where('fecha_limite_respuesta', '>=', now())
                    ->where('estado', 'enviada');
    }

    public function scopeVencidas($query)
    {
        return $query->where('fecha_limite_respuesta', '<', now())
                    ->where('estado', 'enviada');
    }

    // Accessors
    public function getEstadoColorAttribute()
    {
        return match($this->estado) {
            'borrador' => 'bg-gray-100 text-gray-800',
            'enviada' => 'bg-blue-100 text-blue-800',
            'aprobada' => 'bg-green-100 text-green-800',
            'rechazada' => 'bg-red-100 text-red-800',
            'negociacion' => 'bg-yellow-100 text-yellow-800',
            default => 'bg-gray-100 text-gray-800'
        };
    }

    public function getEstadoIconoAttribute()
    {
        return match($this->estado) {
            'borrador' => '🟡',
            'enviada' => '🔵',
            'aprobada' => '🟢',
            'rechazada' => '❌',
            'negociacion' => '⏸️',
            default => '🟡'
        };
    }

    public function getPrecioFormateadoAttribute()
    {
        return '$' . number_format($this->precio_total, 2, '.', ',');
    }

    public function getDiasRestantesAttribute()
    {
        if (!$this->fecha_limite_respuesta || $this->estado !== 'enviada') {
            return null;
        }

        $dias = now()->diffInDays($this->fecha_limite_respuesta, false);
        return $dias;
    }

    public function getEstaVencidaAttribute()
    {
        return $this->fecha_limite_respuesta && 
               $this->fecha_limite_respuesta < now() && 
               $this->estado === 'enviada';
    }

    // Métodos de acción
    public function marcarComoEnviada($fechaEnvio = null)
    {
        $this->update([
            'estado' => 'enviada',
            'fecha_envio' => $fechaEnvio ?? now(),
        ]);
    }

    public function aprobar()
    {
        $this->update(['estado' => 'aprobada']);
    }

    public function rechazar()
    {
        $this->update(['estado' => 'rechazada']);
    }

    public function ponerEnNegociacion()
    {
        $this->update(['estado' => 'negociacion']);
    }

    public function registrarFollowup($fecha = null, $notas = null)
    {
        $this->update([
            'fecha_ultimo_followup' => $fecha ?? now(),
            'notas_internas' => $notas ? $this->notas_internas . "\n\n" . now()->format('Y-m-d H:i') . ": " . $notas : $this->notas_internas,
        ]);
    }
}