<?php

namespace App\Http\Controllers;

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
            'tipo' => 'required|in:nota,llamada,reunion,email,tarea',
            'importante' => 'boolean',
        ]);

        $validated['user_id'] = auth()->id();

        $nota = Nota::create($validated);

        return back()->with('message', 'Nota agregada exitosamente.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Nota $nota)
    {
        $validated = $request->validate([
            'contenido' => 'required|string',
            'tipo' => 'required|in:nota,llamada,reunion,email,tarea',
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
