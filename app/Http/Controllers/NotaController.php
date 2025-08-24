<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Cliente;
use App\Models\Nota;
use Illuminate\Http\Request;

class NotaController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'cliente_id' => 'required|exists:clientes,id',
            'contenido' => 'required|string',
            'importante' => 'boolean',
        ]);

        $validated['user_id'] = auth()->id();
        $validated['tipo'] = 'nota'; // Todas las notas serán de tipo 'nota'

        $nota = Nota::create($validated);

        // Log de actividad
        ActivityLog::logNotaCreated($nota->load('cliente'));

        return back()->with('message', 'Nota agregada exitosamente.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Nota $nota)
    {
        $validated = $request->validate([
            'contenido' => 'required|string',
            'importante' => 'boolean',
        ]);

        $nota->update($validated);

        return back()->with('message', 'Nota actualizada exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Nota $nota)
    {
        $nota->delete();

        return back()->with('message', 'Nota eliminada exitosamente.');
    }
}
