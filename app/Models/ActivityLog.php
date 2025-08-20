<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ActivityLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'action',
        'model_type',
        'model_id',
        'title',
        'description',
        'icon',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    // Relaciones
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Método estático para crear logs de actividad
    public static function log(string $action, string $modelType, $modelId, string $title, string $description, string $icon = '📝', array $metadata = [])
    {
        return self::create([
            'user_id' => auth()->id(),
            'action' => $action,
            'model_type' => $modelType,
            'model_id' => $modelId,
            'title' => $title,
            'description' => $description,
            'icon' => $icon,
            'metadata' => $metadata,
        ]);
    }

    // Scopes para filtrar actividades
    public function scopeRecent($query, $limit = 10)
    {
        return $query->orderBy('created_at', 'desc')->limit($limit);
    }

    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeOfType($query, $modelType)
    {
        return $query->where('model_type', $modelType);
    }

    // Accessor para obtener el tiempo relativo
    public function getTimeAgoAttribute()
    {
        return $this->created_at->diffForHumans();
    }

    // Accessor para el mensaje completo
    public function getFullMessageAttribute()
    {
        return $this->title . ' ' . $this->description;
    }

    // Métodos estáticos para tipos específicos de actividad
    public static function logClienteCreated($cliente)
    {
        return self::log(
            'created',
            'Cliente',
            $cliente->id,
            'Agregaste a ' . $cliente->nombre . ' ' . $cliente->apellido,
            'como nuevo cliente',
            '👤',
            ['cliente_nombre' => $cliente->nombre . ' ' . $cliente->apellido]
        );
    }

    public static function logPropuestaCreated($propuesta)
    {
        return self::log(
            'created',
            'Propuesta',
            $propuesta->id,
            'Creaste la propuesta "' . $propuesta->titulo . '"',
            'para ' . $propuesta->cliente->nombre . ' ' . $propuesta->cliente->apellido,
            '📄',
            ['propuesta_titulo' => $propuesta->titulo, 'cliente_nombre' => $propuesta->cliente->nombre . ' ' . $propuesta->cliente->apellido]
        );
    }

    public static function logPropuestaEnviada($propuesta)
    {
        return self::log(
            'sent',
            'Propuesta',
            $propuesta->id,
            'Enviaste la propuesta "' . $propuesta->titulo . '"',
            'a ' . $propuesta->cliente->nombre . ' ' . $propuesta->cliente->apellido,
            '📤',
            ['propuesta_titulo' => $propuesta->titulo, 'cliente_nombre' => $propuesta->cliente->nombre . ' ' . $propuesta->cliente->apellido]
        );
    }

    public static function logPropuestaAprobada($propuesta)
    {
        return self::log(
            'approved',
            'Propuesta',
            $propuesta->id,
            '¡Propuesta "' . $propuesta->titulo . '" fue aprobada!',
            'por ' . $propuesta->cliente->nombre . ' ' . $propuesta->cliente->apellido,
            '✅',
            ['propuesta_titulo' => $propuesta->titulo, 'cliente_nombre' => $propuesta->cliente->nombre . ' ' . $propuesta->cliente->apellido, 'valor' => $propuesta->precio_total]
        );
    }

    public static function logSeguimientoCompleted($seguimiento)
    {
        return self::log(
            'completed',
            'Seguimiento',
            $seguimiento->id,
            'Completaste la tarea "' . $seguimiento->descripcion . '"',
            'para ' . $seguimiento->cliente->nombre . ' ' . $seguimiento->cliente->apellido,
            '✅',
            ['seguimiento_descripcion' => $seguimiento->descripcion, 'cliente_nombre' => $seguimiento->cliente->nombre . ' ' . $seguimiento->cliente->apellido]
        );
    }

    public static function logSeguimientoCreated($seguimiento)
    {
        return self::log(
            'created',
            'Seguimiento',
            $seguimiento->id,
            'Programaste una tarea "' . $seguimiento->descripcion . '"',
            'para ' . $seguimiento->cliente->nombre . ' ' . $seguimiento->cliente->apellido,
            '📅',
            ['seguimiento_descripcion' => $seguimiento->descripcion, 'cliente_nombre' => $seguimiento->cliente->nombre . ' ' . $seguimiento->cliente->apellido, 'fecha' => $seguimiento->fecha_seguimiento]
        );
    }

    public static function logProyectoCreated($proyecto)
    {
        return self::log(
            'created',
            'Proyecto',
            $proyecto->id,
            'Convertiste la propuesta en proyecto "' . $proyecto->nombre . '"',
            'para ' . $proyecto->cliente->nombre . ' ' . $proyecto->cliente->apellido,
            '🚀',
            ['proyecto_nombre' => $proyecto->nombre, 'cliente_nombre' => $proyecto->cliente->nombre . ' ' . $proyecto->cliente->apellido]
        );
    }

    public static function logNotaCreated($nota)
    {
        return self::log(
            'created',
            'Nota',
            $nota->id,
            'Agregaste una nota',
            'para ' . $nota->cliente->nombre . ' ' . $nota->cliente->apellido,
            '📝',
            ['cliente_nombre' => $nota->cliente->nombre . ' ' . $nota->cliente->apellido]
        );
    }
}
