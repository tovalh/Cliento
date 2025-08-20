<?php

namespace Database\Seeders;

use App\Models\Seguimiento;
use App\Models\Cliente;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SeguimientoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $clientes = Cliente::all();
        $users = User::all();

        if ($clientes->isEmpty() || $users->isEmpty()) {
            return;
        }

        $seguimientosData = [
            [
                'titulo' => 'Llamar para seguimiento de propuesta',
                'descripcion' => 'Verificar si han revisado la propuesta enviada la semana pasada',
                'tipo' => 'llamada',
                'prioridad' => 'alta',
                'dias_futuro' => 0, // Hoy
            ],
            [
                'titulo' => 'Enviar email de check-in',
                'descripcion' => 'Contacto mensual para mantener la relación',
                'tipo' => 'email',
                'prioridad' => 'media',
                'dias_futuro' => 1, // Mañana
            ],
            [
                'titulo' => 'Reunión de seguimiento del proyecto',
                'descripcion' => 'Revisar el progreso del proyecto en curso',
                'tipo' => 'reunion',
                'prioridad' => 'alta',
                'dias_futuro' => 2,
            ],
            [
                'titulo' => 'Seguimiento trimestral',
                'descripcion' => 'Cliente pasado, buscar nuevas oportunidades',
                'tipo' => 'llamada',
                'prioridad' => 'baja',
                'dias_futuro' => 3,
            ],
            [
                'titulo' => 'Presentar nueva propuesta',
                'descripcion' => 'Cliente mostró interés en servicios adicionales',
                'tipo' => 'propuesta',
                'prioridad' => 'alta',
                'dias_futuro' => 5,
            ],
            [
                'titulo' => 'Llamada de seguimiento post-entrega',
                'descripcion' => 'Verificar satisfacción con el proyecto entregado',
                'tipo' => 'llamada',
                'prioridad' => 'media',
                'dias_futuro' => 7,
            ],
            [
                'titulo' => 'Contacto de mantenimiento de relación',
                'descripcion' => 'Mantener contacto con cliente importante',
                'tipo' => 'email',
                'prioridad' => 'media',
                'dias_futuro' => -1, // Ayer (vencido)
            ],
            [
                'titulo' => 'Seguimiento urgente - Sin respuesta',
                'descripcion' => 'Cliente no ha respondido a propuesta urgente',
                'tipo' => 'llamada',
                'prioridad' => 'alta',
                'dias_futuro' => -2, // Hace 2 días (vencido)
            ],
        ];

        foreach ($clientes as $cliente) {
            // Agregar 2-4 seguimientos aleatorios para cada cliente
            $seguimientosParaCliente = fake()->randomElements($seguimientosData, rand(2, 4));
            
            foreach ($seguimientosParaCliente as $seguimientoData) {
                $fechaSeguimiento = now()->addDays($seguimientoData['dias_futuro']);
                
                Seguimiento::create([
                    'cliente_id' => $cliente->id,
                    'user_id' => $users->random()->id,
                    'titulo' => $seguimientoData['titulo'],
                    'descripcion' => $seguimientoData['descripcion'],
                    'fecha_seguimiento' => $fechaSeguimiento,
                    'tipo' => $seguimientoData['tipo'],
                    'prioridad' => $seguimientoData['prioridad'],
                    'completado' => false,
                ]);
            }
        }

        // Agregar algunos seguimientos completados para mostrar funcionalidad
        $clienteEjemplo = $clientes->first();
        if ($clienteEjemplo) {
            Seguimiento::create([
                'cliente_id' => $clienteEjemplo->id,
                'user_id' => $users->first()->id,
                'titulo' => 'Reunión inicial completada',
                'descripcion' => 'Primera reunión exitosa, definimos los requerimientos',
                'fecha_seguimiento' => now()->subDays(3),
                'tipo' => 'reunion',
                'prioridad' => 'alta',
                'completado' => true,
                'completado_en' => now()->subDays(3)->addHours(2),
            ]);
        }
    }
}
