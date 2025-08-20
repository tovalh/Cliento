<?php

namespace Database\Seeders;

use App\Models\Nota;
use App\Models\Cliente;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class NotaSeeder extends Seeder
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

        $notasData = [
            [
                'contenido' => 'Hablé con el cliente el lunes. Está interesado en un presupuesto para desarrollar una aplicación móvil para su empresa.',
                'tipo' => 'llamada',
                'importante' => true,
            ],
            [
                'contenido' => 'Envié el presupuesto por email. Incluye desarrollo completo, testing y soporte por 6 meses.',
                'tipo' => 'email',
                'importante' => false,
            ],
            [
                'contenido' => 'Reunión programada para el viernes a las 3 PM en sus oficinas para discutir los detalles del proyecto.',
                'tipo' => 'reunion',
                'importante' => true,
            ],
            [
                'contenido' => 'Cliente confirmó que le gusta la propuesta. Pidió algunos ajustes menores en el alcance del proyecto.',
                'tipo' => 'nota',
                'importante' => false,
            ],
            [
                'contenido' => 'Pendiente: Enviar contrato modificado con los cambios solicitados.',
                'tipo' => 'tarea',
                'importante' => true,
            ],
            [
                'contenido' => 'Segunda reunión muy productiva. Cliente aprobó la propuesta final. Firmamos el contrato.',
                'tipo' => 'reunion',
                'importante' => true,
            ],
            [
                'contenido' => 'Proyecto iniciado. Primer sprint de desarrollo comenzó esta semana.',
                'tipo' => 'nota',
                'importante' => false,
            ],
        ];

        foreach ($clientes as $cliente) {
            // Agregar 3-5 notas aleatorias para cada cliente
            $notasParaCliente = fake()->randomElements($notasData, rand(3, 5));
            
            foreach ($notasParaCliente as $index => $notaData) {
                Nota::create([
                    'cliente_id' => $cliente->id,
                    'user_id' => $users->random()->id,
                    'contenido' => $notaData['contenido'],
                    'tipo' => $notaData['tipo'],
                    'importante' => $notaData['importante'],
                    'created_at' => now()->subDays(rand(1, 30))->subHours(rand(0, 23)),
                ]);
            }
        }
    }
}
