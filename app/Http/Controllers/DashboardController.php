<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Seguimiento;
use App\Models\Propuesta;
use App\Models\Cliente;
use App\Models\Proyecto;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $today = today();
        
        // Widget 1: Mis Tareas para Hoy
        $tareasHoy = Seguimiento::with(['cliente', 'user'])
            ->where('fecha_seguimiento', $today)
            ->where('completado', false)
            ->orderBy('prioridad', 'desc')
            ->orderBy('created_at', 'asc')
            ->get();

        // Widget 2: Atención Requerida
        // Tareas Vencidas
        $tareasVencidas = Seguimiento::with(['cliente', 'user'])
            ->where('fecha_seguimiento', '<', $today)
            ->where('completado', false)
            ->orderBy('fecha_seguimiento', 'asc')
            ->get();

        // Propuestas por Vencer (próximos 7 días)
        $propuestasPorVencer = Propuesta::with(['cliente', 'user'])
            ->whereIn('estado', ['enviada', 'negociacion'])
            ->whereBetween('fecha_limite_respuesta', [$today, $today->copy()->addDays(7)])
            ->orderBy('fecha_limite_respuesta', 'asc')
            ->get();

        // Fechas para métricas mensuales
        $inicioMes = $today->copy()->startOfMonth();
        $finMes = $today->copy()->endOfMonth();

        // Estadísticas generales
        $estadisticas = [
            'clientes_totales' => Cliente::where('estado', 'activo')->count(),
            'propuestas_activas' => Propuesta::whereIn('estado', ['enviada', 'negociacion'])->count(),
            'proyectos_activos' => Proyecto::whereIn('estado', ['por_empezar', 'en_progreso'])->count(),
            'tareas_pendientes_total' => Seguimiento::where('completado', false)->count(),
            'valor_propuestas_enviadas' => Propuesta::whereIn('estado', ['enviada', 'negociacion'])->sum('precio_total'),
            'valor_proyectos_activos' => Proyecto::whereIn('estado', ['por_empezar', 'en_progreso'])->sum('precio_total'),
        ];

        // KPIs del mes
        $kpisMes = [
            // Ventas del mes (propuestas aprobadas)
            'ventas_mes' => Propuesta::where('estado', 'aprobada')
                ->whereBetween('updated_at', [$inicioMes, $finMes])
                ->sum('precio_total'),
            
            // Propuestas enviadas este mes
            'propuestas_enviadas_mes' => Propuesta::whereBetween('created_at', [$inicioMes, $finMes])->count(),
            
            // Nuevos clientes este mes
            'nuevos_clientes_mes' => Cliente::whereBetween('created_at', [$inicioMes, $finMes])->count(),
            
            // Para tasa de cierre
            'propuestas_aprobadas_mes' => Propuesta::where('estado', 'aprobada')
                ->whereBetween('updated_at', [$inicioMes, $finMes])
                ->count(),
            
            'propuestas_resueltas_mes' => Propuesta::whereIn('estado', ['aprobada', 'rechazada'])
                ->whereBetween('updated_at', [$inicioMes, $finMes])
                ->count(),
        ];

        // Calcular tasa de cierre
        $kpisMes['tasa_cierre'] = $kpisMes['propuestas_resueltas_mes'] > 0 
            ? round(($kpisMes['propuestas_aprobadas_mes'] / $kpisMes['propuestas_resueltas_mes']) * 100, 1)
            : 0;

        // Activity Feed - Actividades recientes
        $actividadesRecientes = ActivityLog::with('user')
            ->forUser(auth()->id())
            ->recent(7)
            ->get();

        return Inertia::render('dashboard', [
            'tareasHoy' => $tareasHoy,
            'tareasVencidas' => $tareasVencidas,
            'propuestasPorVencer' => $propuestasPorVencer,
            'estadisticas' => $estadisticas,
            'kpisMes' => $kpisMes,
            'actividadesRecientes' => $actividadesRecientes,
        ]);
    }

    public function completarTarea(Request $request, Seguimiento $seguimiento)
    {
        $seguimiento->completar();
        
        // Log de actividad
        ActivityLog::logSeguimientoCompleted($seguimiento->load('cliente'));
        
        return back()->with('message', 'Tarea marcada como completada.');
    }
}
