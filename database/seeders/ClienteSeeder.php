<?php

namespace Database\Seeders;

use App\Models\Cliente;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ClienteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $clientes = [
            [
                'nombre' => 'Juan',
                'apellido' => 'Pérez',
                'email' => 'juan.perez@example.com',
                'telefono' => '+1234567890',
                'empresa' => 'Tech Solutions',
                'direccion' => 'Calle Principal 123',
                'ciudad' => 'Ciudad de México',
                'fecha_nacimiento' => '1985-03-15',
                'estado' => 'activo',
                'notas' => 'Cliente importante con múltiples proyectos',
            ],
            [
                'nombre' => 'María',
                'apellido' => 'González',
                'email' => 'maria.gonzalez@example.com',
                'telefono' => '+0987654321',
                'empresa' => 'Design Studio',
                'direccion' => 'Avenida Central 456',
                'ciudad' => 'Guadalajara',
                'fecha_nacimiento' => '1990-07-22',
                'estado' => 'activo',
                'notas' => 'Especialista en diseño UX/UI',
            ],
            [
                'nombre' => 'Carlos',
                'apellido' => 'López',
                'email' => 'carlos.lopez@example.com',
                'telefono' => '+1122334455',
                'empresa' => 'Marketing Pro',
                'direccion' => 'Boulevard Norte 789',
                'ciudad' => 'Monterrey',
                'fecha_nacimiento' => '1988-12-10',
                'estado' => 'inactivo',
                'notas' => 'Ex cliente, posible reactivación',
            ],
        ];

        foreach ($clientes as $cliente) {
            Cliente::create($cliente);
        }
    }
}
