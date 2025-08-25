<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Cliente;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class ClienteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Cliente::where('user_id', auth()->id());

        // Filtro de búsqueda general
        if ($request->filled('buscar')) {
            $buscar = $request->get('buscar');
            $query->where(function($q) use ($buscar) {
                $q->where('nombre', 'like', "%{$buscar}%")
                  ->orWhere('apellido', 'like', "%{$buscar}%")
                  ->orWhere('email', 'like', "%{$buscar}%")
                  ->orWhere('empresa', 'like', "%{$buscar}%");
            });
        }



        // Ordenamiento
        $sortField = $request->get('sort_field', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        
        // Validar campos de ordenamiento
        $allowedSortFields = ['nombre', 'empresa', 'email', 'estado', 'created_at'];
        if (!in_array($sortField, $allowedSortFields)) {
            $sortField = 'created_at';
        }
        
        if (!in_array($sortOrder, ['asc', 'desc'])) {
            $sortOrder = 'desc';
        }

        $clientes = $query->orderBy($sortField, $sortOrder)->paginate(10);
        
        return Inertia::render('Clientes/Index', [
            'clientes' => $clientes,
            'filtros' => [
                'buscar' => $request->get('buscar'),
                'sort_field' => $sortField,
                'sort_order' => $sortOrder,
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Clientes/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'apellido' => 'required|string|max:255',
            'email' => 'required|email|unique:clientes,email',
            'telefono' => 'nullable|string|max:255',
            'empresa' => 'nullable|string|max:255',
            'direccion' => 'nullable|string',
            'ciudad' => 'nullable|string|max:255',
            'fecha_nacimiento' => 'nullable|date',
            'estado' => 'required|in:activo,inactivo',
            'notas' => 'nullable|string',
        ]);

        $validated['user_id'] = auth()->id();
        $cliente = Cliente::create($validated);
        
        // Log de actividad
        ActivityLog::logClienteCreated($cliente);

        return redirect()->route('clientes.index')->with('message', 'Cliente creado exitosamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Cliente $cliente)
    {
        // Verificar que el cliente pertenece al usuario actual
        if ($cliente->user_id !== auth()->id()) {
            abort(403, 'No tienes permiso para ver este cliente.');
        }

        $notas = $cliente->notas()->with('user')->latest()->get();
        $seguimientos = $cliente->seguimientos()->with('user')->latest()->get();
        $propuestas = $cliente->propuestas()->with('user')->latest()->get();
        $proyectos = $cliente->proyectos()->with('user')->latest()->get();
        
        return Inertia::render('Clientes/Show', [
            'cliente' => $cliente,
            'notas' => $notas,
            'seguimientos' => $seguimientos,
            'propuestas' => $propuestas,
            'proyectos' => $proyectos
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Cliente $cliente)
    {
        // Verificar que el cliente pertenece al usuario actual
        if ($cliente->user_id !== auth()->id()) {
            abort(403, 'No tienes permiso para editar este cliente.');
        }

        return Inertia::render('Clientes/Edit', [
            'cliente' => $cliente
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Cliente $cliente)
    {
        // Verificar que el cliente pertenece al usuario actual
        if ($cliente->user_id !== auth()->id()) {
            abort(403, 'No tienes permiso para actualizar este cliente.');
        }

        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'apellido' => 'required|string|max:255',
            'email' => 'required|email|unique:clientes,email,' . $cliente->id,
            'telefono' => 'nullable|string|max:255',
            'empresa' => 'nullable|string|max:255',
            'direccion' => 'nullable|string',
            'ciudad' => 'nullable|string|max:255',
            'fecha_nacimiento' => 'nullable|date',
            'estado' => 'required|in:activo,inactivo',
            'notas' => 'nullable|string',
        ]);

        $cliente->update($validated);

        return redirect()->route('clientes.index')->with('message', 'Cliente actualizado exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Cliente $cliente)
    {
        // Verificar que el cliente pertenece al usuario actual
        if ($cliente->user_id !== auth()->id()) {
            abort(403, 'No tienes permiso para eliminar este cliente.');
        }

        // Log de actividad antes de eliminar
        ActivityLog::logClienteDeleted($cliente);
        
        $cliente->delete();

        return redirect()->route('clientes.index')->with('message', 'Cliente eliminado exitosamente.');
    }

    /**
     * Exportar cliente a PDF con diseño profesional
     */
    public function exportarPdf(Cliente $cliente)
    {
        // Cargar el cliente con sus relaciones de manera segura
        $cliente->load(['notas', 'seguimientos', 'propuestas', 'proyectos']);
        
        // Asegurar que las relaciones existan como colecciones vacías si son null
        if (is_null($cliente->notas)) {
            $cliente->setRelation('notas', collect());
        }
        if (is_null($cliente->seguimientos)) {
            $cliente->setRelation('seguimientos', collect());
        }
        if (is_null($cliente->propuestas)) {
            $cliente->setRelation('propuestas', collect());
        }
        if (is_null($cliente->proyectos)) {
            $cliente->setRelation('proyectos', collect());
        }
        
        // Generar el PDF usando la vista
        $pdf = Pdf::loadView('clientes.pdf', compact('cliente'))
                  ->setPaper('a4', 'portrait')
                  ->setOptions([
                      'isHtml5ParserEnabled' => true,
                      'isRemoteEnabled' => true,
                      'defaultFont' => 'sans-serif'
                  ]);

        // Nombre del archivo
        $filename = 'Cliente_' . str_replace([' ', '/'], ['_', '_'], $cliente->nombre . '_' . $cliente->apellido) . '_' . date('Y-m-d') . '.pdf';

        return $pdf->download($filename);
    }
}
