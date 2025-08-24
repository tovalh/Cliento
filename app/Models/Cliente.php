<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Cliente extends Model
{
    use HasFactory;

    protected $table = 'clientes';

    protected $fillable = [
        'user_id',
        'nombre',
        'apellido',
        'email',
        'telefono',
        'empresa',
        'direccion',
        'ciudad',
        'fecha_nacimiento',
        'estado',
        'notas',
    ];

    protected $casts = [
        'fecha_nacimiento' => 'date',
    ];

    public function getNombreCompletoAttribute()
    {
        return $this->nombre . ' ' . $this->apellido;
    }

    public function scopeActivos($query)
    {
        return $query->where('estado', 'activo');
    }

    public function scopeInactivos($query)
    {
        return $query->where('estado', 'inactivo');
    }

    public function notas(): HasMany
    {
        return $this->hasMany(Nota::class);
    }

    public function notasRecientes(): HasMany
    {
        return $this->hasMany(Nota::class)->latest()->limit(5);
    }

    public function seguimientos(): HasMany
    {
        return $this->hasMany(Seguimiento::class);
    }

    public function seguimientosPendientes(): HasMany
    {
        return $this->hasMany(Seguimiento::class)->pendientes();
    }

    public function propuestas(): HasMany
    {
        return $this->hasMany(Propuesta::class);
    }

    public function proyectos(): HasMany
    {
        return $this->hasMany(Proyecto::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
