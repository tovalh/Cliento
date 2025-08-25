<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Proyecto;
use App\Models\Propuesta;
use App\Models\ProyectoTarea;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class ProyectoController extends Controller
{
    public function index(Request $request)
    {
        $query = Proyecto::with(['cliente', 'user', 'propuesta']);

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
                $q->where('nombre', 'like', '%' . $request->buscar . '%')
                  ->orWhere('descripcion', 'like', '%' . $request->buscar . '%');
            });
        }

        $orderBy = $request->get('orden', 'created_at');
        $orderDirection = $request->get('direccion', 'desc');
        
        if ($orderBy === 'cliente') {
            $query->join('clientes', 'proyectos.cliente_id', '=', 'clientes.id')
                  ->orderBy('clientes.nombre', $orderDirection)
                  ->select('proyectos.*');
        } else {
            $query->orderBy($orderBy, $orderDirection);
        }

        $proyectos = $query->paginate(15)->withQueryString();

        return Inertia::render('Proyectos/Index', [
            'proyectos' => $proyectos,
            'filtros' => $request->only(['estado', 'cliente', 'buscar', 'orden', 'direccion']),
            'estadisticas' => $this->getEstadisticas()
        ]);
    }

    public function show(Proyecto $proyecto)
    {
        $proyecto->load(['cliente', 'user', 'propuesta', 'tareas.user']);

        return Inertia::render('Proyectos/Show', [
            'proyecto' => $proyecto
        ]);
    }

    public function edit(Proyecto $proyecto)
    {
        return Inertia::render('Proyectos/Edit', [
            'proyecto' => $proyecto->load(['cliente', 'propuesta'])
        ]);
    }

    public function update(Request $request, Proyecto $proyecto)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'fecha_inicio' => 'nullable|date',
            'fecha_entrega' => 'nullable|date|after_or_equal:fecha_inicio',
            'precio_total' => 'required|numeric|min:0',
            'forma_pago' => 'required|string|max:255',
            'notas' => 'nullable|string',
        ]);

        $proyecto->update($validated);

        return redirect()->route('proyectos.show', $proyecto)
                        ->with('message', 'Proyecto actualizado exitosamente.');
    }

    public function destroy(Proyecto $proyecto)
    {
        $proyecto->delete();

        return redirect()->route('proyectos.index')
                        ->with('message', 'Proyecto eliminado exitosamente.');
    }

    public function cambiarEstado(Request $request, Proyecto $proyecto)
    {
        $request->validate([
            'estado' => 'required|in:por_empezar,en_progreso,en_pausa,completado',
        ]);

        $proyecto->update(['estado' => $request->estado]);

        if ($request->estado === 'en_progreso' && !$proyecto->fecha_inicio) {
            $proyecto->update(['fecha_inicio' => now()]);
        }

        return back()->with('message', 'Estado del proyecto actualizado.');
    }

    public function convertirDesdePropuesta(Propuesta $propuesta)
    {
        if ($propuesta->estado !== 'aprobada') {
            return back()->withErrors(['error' => 'Solo se pueden convertir propuestas aprobadas.']);
        }

        if ($propuesta->proyecto) {
            return back()->withErrors(['error' => 'Esta propuesta ya fue convertida en proyecto.']);
        }

        $proyecto = Proyecto::crearDesdePropuesta($propuesta);
        
        // Log de actividad
        ActivityLog::logProyectoCreated($proyecto->load('cliente'));

        return redirect()->route('proyectos.show', $proyecto)
                        ->with('message', 'Proyecto creado exitosamente desde la propuesta.');
    }

    public function crearTarea(Request $request, Proyecto $proyecto)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'fecha_limite' => 'nullable|date',
        ]);

        $validated['proyecto_id'] = $proyecto->id;
        $validated['user_id'] = auth()->id();
        $validated['orden'] = $proyecto->tareas()->max('orden') + 1;

        ProyectoTarea::create($validated);

        return back()->with('message', 'Tarea creada exitosamente.');
    }

    public function actualizarTarea(Request $request, ProyectoTarea $tarea)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'fecha_limite' => 'nullable|date',
            'completada' => 'boolean',
        ]);

        if ($validated['completada'] && !$tarea->completada) {
            $tarea->completar();
        } elseif (!$validated['completada'] && $tarea->completada) {
            $tarea->marcarPendiente();
        }

        $tarea->update($validated);

        return back()->with('message', 'Tarea actualizada exitosamente.');
    }

    public function eliminarTarea(ProyectoTarea $tarea)
    {
        $tarea->delete();

        return back()->with('message', 'Tarea eliminada exitosamente.');
    }

    private function getEstadisticas()
    {
        return [
            'total' => Proyecto::count(),
            'por_empezar' => Proyecto::porEmpezar()->count(),
            'en_progreso' => Proyecto::enProgreso()->count(),
            'en_pausa' => Proyecto::enPausa()->count(),
            'completados' => Proyecto::completados()->count(),
            'valor_total' => Proyecto::sum('precio_total'),
            'valor_completados' => Proyecto::completados()->sum('precio_total'),
        ];
    }

    /**
     * Exportar proyecto a PDF con diseño profesional
     */
    public function exportarPdf(Proyecto $proyecto)
    {
        // Cargar el proyecto con sus relaciones de manera segura
        $proyecto->load(['cliente', 'user', 'propuesta', 'tareas']);
        
        // Asegurar que las relaciones existan como colecciones vacías si son null
        if (is_null($proyecto->tareas)) {
            $proyecto->setRelation('tareas', collect());
        }
        
        // Generar el PDF usando la vista
        $pdf = Pdf::loadView('proyectos.pdf', compact('proyecto'))
                  ->setPaper('a4', 'portrait')
                  ->setOptions([
                      'isHtml5ParserEnabled' => true,
                      'isRemoteEnabled' => true,
                      'defaultFont' => 'sans-serif'
                  ]);

        // Nombre del archivo
        $filename = 'Proyecto_' . str_replace([' ', '/'], ['_', '_'], $proyecto->nombre) . '_' . date('Y-m-d') . '.pdf';

        return $pdf->download($filename);
    }
}
