<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Propuesta;
use App\Models\Cliente;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PropuestaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Propuesta::with(['cliente', 'user']);

        // Filtros
        if ($request->filled('estado')) {
            $query->porEstado($request->estado);
        }

        if ($request->filled('cliente')) {
            $query->whereHas('cliente', function ($q) use ($request) {
                $q->where('nombre', 'like', '%' . $request->cliente . '%')
                  ->orWhere('apellido', 'like', '%' . $request->cliente . '%')
                  ->orWhere('empresa', 'like', '%' . $request->cliente . '%');
            });
        }

        if ($request->filled('buscar')) {
            $query->where(function ($q) use ($request) {
                $q->where('titulo', 'like', '%' . $request->buscar . '%')
                  ->orWhere('descripcion_proyecto', 'like', '%' . $request->buscar . '%');
            });
        }

        if ($request->filled('fecha_desde')) {
            $query->where('created_at', '>=', $request->fecha_desde);
        }

        if ($request->filled('fecha_hasta')) {
            $query->where('created_at', '<=', $request->fecha_hasta);
        }

        // Ordenamiento
        $orderBy = $request->get('orden', 'created_at');
        $orderDirection = $request->get('direccion', 'desc');
        
        if ($orderBy === 'cliente') {
            $query->join('clientes', 'propuestas.cliente_id', '=', 'clientes.id')
                  ->orderBy('clientes.nombre', $orderDirection)
                  ->select('propuestas.*');
        } else {
            $query->orderBy($orderBy, $orderDirection);
        }

        $propuestas = $query->paginate(15)->withQueryString();

        return Inertia::render('Propuestas/Index', [
            'propuestas' => $propuestas,
            'filtros' => $request->only(['estado', 'cliente', 'buscar', 'fecha_desde', 'fecha_hasta', 'orden', 'direccion']),
            'estadisticas' => $this->getEstadisticas()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $clientes = Cliente::where('estado', 'activo')
                          ->where('user_id', auth()->id())
                          ->orderBy('nombre')
                          ->get(['id', 'nombre', 'apellido', 'empresa']);

        $clienteSeleccionado = null;
        $redirectToClient = false;
        
        if ($request->filled('cliente_id')) {
            $clienteSeleccionado = Cliente::find($request->cliente_id);
            $redirectToClient = true;
        }

        return Inertia::render('Propuestas/Create', [
            'clientes' => $clientes,
            'clienteSeleccionado' => $clienteSeleccionado,
            'redirectToClient' => $redirectToClient
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
            'descripcion_proyecto' => 'required|string',
            'alcance_incluye' => 'required|string',
            'alcance_no_incluye' => 'nullable|string',
            'precio_total' => 'required|numeric|min:0',
            'forma_pago' => 'required|string|max:255',
            'tiempo_entrega' => 'required|string|max:255',
            'terminos_condiciones' => 'nullable|string',
            'fecha_limite_respuesta' => 'nullable|date|after:today',
            'notas_internas' => 'nullable|string',
        ]);

        $validated['user_id'] = auth()->id();

        $propuesta = Propuesta::create($validated);
        
        // Log de actividad
        ActivityLog::logPropuestaCreated($propuesta->load('cliente'));

        // Si viene con redirect_to_client, volver al cliente
        if ($request->filled('redirect_to_client') && $request->redirect_to_client === 'true') {
            return redirect()->route('clientes.show', $propuesta->cliente_id)
                            ->with('message', 'Propuesta creada exitosamente.');
        }

        return redirect()->route('propuestas.show', $propuesta)
                        ->with('message', 'Propuesta creada exitosamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Propuesta $propuesta)
    {
        $propuesta->load(['cliente', 'user', 'proyecto']);

        return Inertia::render('Propuestas/Show', [
            'propuesta' => $propuesta
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Propuesta $propuesta)
    {
        $clientes = Cliente::where('estado', 'activo')
                          ->where('user_id', auth()->id())
                          ->orderBy('nombre')
                          ->get(['id', 'nombre', 'apellido', 'empresa']);

        return Inertia::render('Propuestas/Edit', [
            'propuesta' => $propuesta->load('cliente'),
            'clientes' => $clientes
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Propuesta $propuesta)
    {
        $validated = $request->validate([
            'cliente_id' => 'required|exists:clientes,id',
            'titulo' => 'required|string|max:255',
            'descripcion_proyecto' => 'required|string',
            'alcance_incluye' => 'required|string',
            'alcance_no_incluye' => 'nullable|string',
            'precio_total' => 'required|numeric|min:0',
            'forma_pago' => 'required|string|max:255',
            'tiempo_entrega' => 'required|string|max:255',
            'terminos_condiciones' => 'nullable|string',
            'fecha_limite_respuesta' => 'nullable|date|after:today',
            'notas_internas' => 'nullable|string',
        ]);

        $propuesta->update($validated);

        return redirect()->route('propuestas.show', $propuesta)
                        ->with('message', 'Propuesta actualizada exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Propuesta $propuesta)
    {
        $propuesta->delete();

        return redirect()->route('propuestas.index')
                        ->with('message', 'Propuesta eliminada exitosamente.');
    }

    /**
     * Marcar propuesta como enviada
     */
    public function enviar(Request $request, Propuesta $propuesta)
    {
        $request->validate([
            'fecha_envio' => 'nullable|date',
        ]);

        $propuesta->marcarComoEnviada($request->fecha_envio);
        
        // Log de actividad
        ActivityLog::logPropuestaEnviada($propuesta->load('cliente'));

        return back()->with('message', 'Propuesta marcada como enviada.');
    }

    /**
     * Cambiar estado de la propuesta
     */
    public function cambiarEstado(Request $request, Propuesta $propuesta)
    {
        $request->validate([
            'estado' => 'required|in:borrador,enviada,aprobada,rechazada,negociacion',
        ]);

        $estadoAnterior = $propuesta->estado;
        $propuesta->update(['estado' => $request->estado]);
        
        // Log de actividad especial para propuestas aprobadas
        if ($request->estado === 'aprobada' && $estadoAnterior !== 'aprobada') {
            ActivityLog::logPropuestaAprobada($propuesta->load('cliente'));
        }

        return back()->with('message', 'Estado de propuesta actualizado.');
    }

    /**
     * Registrar follow-up
     */
    public function registrarFollowup(Request $request, Propuesta $propuesta)
    {
        $request->validate([
            'notas' => 'required|string',
            'proximo_recordatorio' => 'nullable|date|after:today',
        ]);

        $propuesta->registrarFollowup(now(), $request->notas);

        if ($request->proximo_recordatorio) {
            $propuesta->update(['proximo_recordatorio' => $request->proximo_recordatorio]);
        }

        return back()->with('message', 'Follow-up registrado exitosamente.');
    }

    /**
     * Duplicar propuesta
     */
    public function duplicar(Propuesta $propuesta)
    {
        $nuevaPropuesta = $propuesta->replicate();
        $nuevaPropuesta->titulo = $propuesta->titulo . ' (Copia)';
        $nuevaPropuesta->estado = 'borrador';
        $nuevaPropuesta->fecha_envio = null;
        $nuevaPropuesta->fecha_ultimo_followup = null;
        $nuevaPropuesta->user_id = auth()->id();
        $nuevaPropuesta->save();

        return redirect()->route('propuestas.edit', $nuevaPropuesta)
                        ->with('message', 'Propuesta duplicada exitosamente.');
    }

    /**
     * Obtener estadísticas para el dashboard
     */
    private function getEstadisticas()
    {
        return [
            'total' => Propuesta::count(),
            'borradores' => Propuesta::borradores()->count(),
            'enviadas' => Propuesta::enviadas()->count(),
            'aprobadas' => Propuesta::aprobadas()->count(),
            'rechazadas' => Propuesta::rechazadas()->count(),
            'negociacion' => Propuesta::enNegociacion()->count(),
            'proximas_vencer' => Propuesta::proximasAVencer()->count(),
            'vencidas' => Propuesta::vencidas()->count(),
            'valor_total_aprobadas' => Propuesta::aprobadas()->sum('precio_total'),
            'valor_total_enviadas' => Propuesta::enviadas()->sum('precio_total'),
        ];
    }

    /**
     * Exportar propuesta a PDF (placeholder para futura implementación)
     */
    public function exportarPdf(Propuesta $propuesta)
    {
        // TODO: Implementar exportación a PDF
        return back()->with('message', 'Funcionalidad de exportación en desarrollo.');
    }
}