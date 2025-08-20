<?php

use App\Http\Controllers\ClienteController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\NotaController;
use App\Http\Controllers\PropuestaController;
use App\Http\Controllers\ProyectoController;
use App\Http\Controllers\SeguimientoController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::post('dashboard/completar-tarea/{seguimiento}', [DashboardController::class, 'completarTarea'])->name('dashboard.completar-tarea');
    
    Route::resource('clientes', ClienteController::class);
    Route::resource('notas', NotaController::class)->only(['store', 'update', 'destroy']);
    Route::resource('seguimientos', SeguimientoController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::post('seguimientos/{seguimiento}/completar', [SeguimientoController::class, 'completar'])->name('seguimientos.completar');
    Route::get('api/seguimientos/pendientes', [SeguimientoController::class, 'pendientes'])->name('seguimientos.pendientes');
    
    // Propuestas routes
    Route::resource('propuestas', PropuestaController::class);
    Route::post('propuestas/{propuesta}/enviar', [PropuestaController::class, 'enviar'])->name('propuestas.enviar');
    Route::post('propuestas/{propuesta}/cambiar-estado', [PropuestaController::class, 'cambiarEstado'])->name('propuestas.cambiar-estado');
    Route::post('propuestas/{propuesta}/followup', [PropuestaController::class, 'registrarFollowup'])->name('propuestas.followup');
    Route::post('propuestas/{propuesta}/duplicar', [PropuestaController::class, 'duplicar'])->name('propuestas.duplicar');
    Route::get('propuestas/{propuesta}/pdf', [PropuestaController::class, 'exportarPdf'])->name('propuestas.pdf');
    
    // Proyectos routes
    Route::resource('proyectos', ProyectoController::class)->only(['index', 'show', 'edit', 'update', 'destroy']);
    Route::post('propuestas/{propuesta}/convertir-proyecto', [ProyectoController::class, 'convertirDesdePropuesta'])->name('propuestas.convertir-proyecto');
    Route::post('proyectos/{proyecto}/cambiar-estado', [ProyectoController::class, 'cambiarEstado'])->name('proyectos.cambiar-estado');
    Route::post('proyectos/{proyecto}/tareas', [ProyectoController::class, 'crearTarea'])->name('proyectos.tareas.store');
    Route::put('tareas/{tarea}', [ProyectoController::class, 'actualizarTarea'])->name('proyectos.tareas.update');
    Route::delete('tareas/{tarea}', [ProyectoController::class, 'eliminarTarea'])->name('proyectos.tareas.destroy');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
