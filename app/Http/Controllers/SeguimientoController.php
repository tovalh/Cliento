<?php

namespace App\Http\Controllers;

use App\Models\Seguimiento;
use App\Models\Cliente;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SeguimientoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Seguimiento::with(['cliente', 'user']);

        // Filtros
        if ($request->filled('estado')) {
            if ($request->estado === 'completados') {
                $query->where('completado', true);
            } elseif ($request->estado === 'pendientes') {
                $query->where('completado', false);
            } elseif ($request->estado === 'vencidos') {
                $query->vencidos();
            } elseif ($request->estado === 'hoy') {
                $query->hoy();
            }
        }

        if ($request->filled('prioridad')) {
            $query->porPrioridad($request->prioridad);
        }

        if ($request->filled('tipo')) {
            $query->where('tipo', $request->tipo);
        }

        if ($request->filled('cliente')) {
            $query->whereHas('cliente', function ($q) use ($request) {
                $q->where('nombre', 'like', '%' . $request->cliente . '%')
                  ->orWhere('apellido', 'like', '%' . $request->cliente . '%')
                  ->orWhere('email', 'like', '%' . $request->cliente . '%');
            });
        }

        if ($request->filled('buscar')) {
            $query->where(function ($q) use ($request) {
                $q->where('titulo', 'like', '%' . $request->buscar . '%')
                  ->orWhere('descripcion', 'like', '%' . $request->buscar . '%');
            });
        }

        // Ordenamiento
        $orderBy = $request->get('orden', 'fecha_seguimiento');
        $orderDirection = $request->get('direccion', 'asc');
        
        if ($orderBy === 'cliente') {
            $query->join('clientes', 'seguimientos.cliente_id', '=', 'clientes.id')
                  ->orderBy('clientes.nombre', $orderDirection)
                  ->select('seguimientos.*');
        } else {
            $query->orderBy($orderBy, $orderDirection);
        }

        $seguimientos = $query->paginate(15)->withQueryString();

        return Inertia::render('Seguimientos/Index', [
            'seguimientos' => $seguimientos,
            'filtros' => $request->only(['estado', 'prioridad', 'tipo', 'cliente', 'buscar', 'orden', 'direccion'])
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'cliente_id' => 'required|exists:clientes,id',
            'titulo' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'fecha_seguimiento' => 'required|date|after_or_equal:today',
            'prioridad' => 'required|in:baja,media,alta',
            'tipo' => 'required|in:llamada,email,reunion,propuesta,otro',
        ]);

        $validated['user_id'] = auth()->id();

        $seguimiento = Seguimiento::create($validated);

        return back()->with('message', 'Seguimiento programado exitosamente.');
    }

    /**
     * Complete a follow-up (mark as done).
     */
    public function completar(Seguimiento $seguimiento)
    {
        $seguimiento->completar();

        return back()->with('message', 'Seguimiento marcado como completado.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Seguimiento $seguimiento)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'fecha_seguimiento' => 'required|date|after_or_equal:today',
            'prioridad' => 'required|in:baja,media,alta',
            'tipo' => 'required|in:llamada,email,reunion,propuesta,otro',
        ]);

        $seguimiento->update($validated);

        return back()->with('message', 'Seguimiento actualizado exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Seguimiento $seguimiento)
    {
        $seguimiento->delete();

        return back()->with('message', 'Seguimiento eliminado exitosamente.');
    }

    /**
     * Get pending follow-ups for dashboard widget.
     */
    public function pendientes()
    {
        $seguimientos = Seguimiento::with(['cliente', 'user'])
            ->pendientes()
            ->proximosDias(7)
            ->orderBy('fecha_seguimiento')
            ->orderBy('prioridad', 'desc')
            ->get();

        return response()->json($seguimientos);
    }
}
