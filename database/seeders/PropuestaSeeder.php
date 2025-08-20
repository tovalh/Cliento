<?php

namespace Database\Seeders;

use App\Models\Propuesta;
use App\Models\Cliente;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PropuestaSeeder extends Seeder
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

        $propuestasData = [
            [
                'titulo' => 'Desarrollo de Sitio Web Corporativo',
                'estado' => 'enviada',
                'descripcion_proyecto' => 'Desarrollo de una página web corporativa moderna y responsiva con sistema de gestión de contenido.',
                'alcance_incluye' => '- Diseño web responsivo\n- Sistema de gestión de contenido\n- Optimización SEO básica\n- Integración con redes sociales\n- Formulario de contacto\n- Galería de productos',
                'alcance_no_incluye' => '- E-commerce\n- Mantenimiento mensual\n- Hosting\n- Certificado SSL',
                'precio_total' => 15000.00,
                'forma_pago' => '50% adelanto, 50% a la entrega',
                'tiempo_entrega' => '6 semanas',
                'terminos_condiciones' => 'El proyecto incluye 2 rondas de revisiones. Cambios adicionales se cobrarán por separado.',
                'fecha_envio' => now()->subDays(5),
                'fecha_limite_respuesta' => now()->addDays(10),
                'dias_atras' => 5,
            ],
            [
                'titulo' => 'Sistema de Gestión de Inventario',
                'estado' => 'aprobada',
                'descripcion_proyecto' => 'Desarrollo de un sistema completo de gestión de inventario con módulos de compras, ventas y reportes.',
                'alcance_incluye' => '- Sistema web completo\n- Módulo de productos\n- Gestión de proveedores\n- Control de stock\n- Reportes y estadísticas\n- Sistema de usuarios',
                'alcance_no_incluye' => '- Integración con facturación electrónica\n- App móvil\n- Módulo de contabilidad',
                'precio_total' => 45000.00,
                'forma_pago' => '30% adelanto, 40% desarrollo, 30% entrega',
                'tiempo_entrega' => '12 semanas',
                'terminos_condiciones' => 'Incluye capacitación del personal y soporte técnico por 3 meses.',
                'fecha_envio' => now()->subDays(20),
                'fecha_limite_respuesta' => now()->subDays(5),
                'dias_atras' => 20,
            ],
            [
                'titulo' => 'App Móvil para Delivery',
                'estado' => 'negociacion',
                'descripcion_proyecto' => 'Aplicación móvil para iOS y Android con sistema de pedidos en línea y tracking en tiempo real.',
                'alcance_incluye' => '- App nativa iOS y Android\n- Panel de administración web\n- Sistema de pagos\n- Tracking GPS\n- Notificaciones push\n- Panel para repartidores',
                'alcance_no_incluye' => '- Comisiones de las tiendas de aplicaciones\n- Integración con POS existente\n- Marketing digital',
                'precio_total' => 75000.00,
                'forma_pago' => '40% adelanto, 30% desarrollo, 30% entrega',
                'tiempo_entrega' => '16 semanas',
                'terminos_condiciones' => 'El cliente debe proporcionar las credenciales de desarrollador para las tiendas.',
                'fecha_envio' => now()->subDays(3),
                'fecha_limite_respuesta' => now()->addDays(7),
                'dias_atras' => 3,
                'notas_internas' => 'Cliente solicita reducir el precio. Evaluar qué funcionalidades podemos quitar.',
            ],
            [
                'titulo' => 'Rediseño de Portal Institucional',
                'estado' => 'borrador',
                'descripcion_proyecto' => 'Rediseño completo del portal web institucional con enfoque en experiencia de usuario y accesibilidad.',
                'alcance_incluye' => '- Análisis UX/UI\n- Rediseño visual completo\n- Optimización de performance\n- Migración de contenido\n- Capacitación de administradores',
                'alcance_no_incluye' => '- Desarrollo de nuevas funcionalidades\n- Integración con sistemas externos\n- Hosting y dominio',
                'precio_total' => 25000.00,
                'forma_pago' => '50% adelanto, 50% a la entrega',
                'tiempo_entrega' => '8 semanas',
                'terminos_condiciones' => 'Se requiere acceso completo al sitio actual y material gráfico institucional.',
                'dias_atras' => 0,
            ],
            [
                'titulo' => 'Plataforma E-learning',
                'estado' => 'rechazada',
                'descripcion_proyecto' => 'Desarrollo de una plataforma educativa online con sistema de cursos, evaluaciones y certificaciones.',
                'alcance_incluye' => '- Plataforma web responsiva\n- Sistema de usuarios (estudiantes/instructores)\n- Módulo de cursos\n- Sistema de evaluaciones\n- Generación de certificados\n- Panel de administración',
                'alcance_no_incluye' => '- Contenido educativo\n- Integración con sistemas académicos\n- App móvil',
                'precio_total' => 85000.00,
                'forma_pago' => '30% adelanto, 40% desarrollo, 30% entrega',
                'tiempo_entrega' => '20 semanas',
                'terminos_condiciones' => 'Incluye servidor de pruebas y 6 meses de soporte técnico.',
                'fecha_envio' => now()->subDays(30),
                'fecha_limite_respuesta' => now()->subDays(15),
                'dias_atras' => 30,
            ],
            [
                'titulo' => 'Sistema CRM Personalizado',
                'estado' => 'enviada',
                'descripcion_proyecto' => 'Desarrollo de un sistema CRM personalizado para gestión de clientes, ventas y seguimiento comercial.',
                'alcance_incluye' => '- Gestión de contactos\n- Pipeline de ventas\n- Seguimiento de oportunidades\n- Reportes y dashboards\n- Integración con email\n- Sistema de tareas',
                'alcance_no_incluye' => '- Integración con redes sociales\n- Marketing automation\n- Telefonía VoIP',
                'precio_total' => 55000.00,
                'forma_pago' => '40% adelanto, 60% a la entrega',
                'tiempo_entrega' => '14 semanas',
                'terminos_condiciones' => 'Incluye migración de datos del sistema actual y capacitación del equipo.',
                'fecha_envio' => now()->subDays(2),
                'fecha_limite_respuesta' => now()->addDays(5),
                'dias_atras' => 2,
            ],
            [
                'titulo' => 'Portal de Empleados',
                'estado' => 'enviada',
                'descripcion_proyecto' => 'Portal interno para empleados con gestión de documentos, solicitudes y comunicación interna.',
                'alcance_incluye' => '- Sistema de autenticación\n- Gestión de documentos\n- Solicitudes de vacaciones\n- Directorio de empleados\n- Sistema de anuncios\n- Evaluaciones de desempeño',
                'alcance_no_incluye' => '- Integración con nómina\n- Sistema de asistencia biométrico\n- Módulo de capacitación',
                'precio_total' => 35000.00,
                'forma_pago' => '50% adelanto, 50% a la entrega',
                'tiempo_entrega' => '10 semanas',
                'terminos_condiciones' => 'Requiere integración con Active Directory existente.',
                'fecha_envio' => now()->subDays(12),
                'fecha_limite_respuesta' => now()->subDays(2), // Vencida
                'dias_atras' => 12,
            ],
            [
                'titulo' => 'Sistema de Facturación Electrónica',
                'estado' => 'aprobada',
                'descripcion_proyecto' => 'Sistema completo de facturación electrónica integrado con SUNAT para automatización de procesos fiscales.',
                'alcance_incluye' => '- Generación de comprobantes electrónicos\n- Integración con SUNAT\n- Gestión de clientes y productos\n- Reportes tributarios\n- API para integraciones\n- Backup automático',
                'alcance_no_incluye' => '- Migración de facturas históricas\n- Integración con sistemas contables\n- Soporte legal',
                'precio_total' => 65000.00,
                'forma_pago' => '30% adelanto, 40% desarrollo, 30% entrega',
                'tiempo_entrega' => '15 semanas',
                'terminos_condiciones' => 'Cliente debe obtener certificado digital SUNAT antes del inicio del proyecto.',
                'fecha_envio' => now()->subDays(25),
                'fecha_limite_respuesta' => now()->subDays(10),
                'dias_atras' => 25,
            ],
        ];

        foreach ($clientes as $index => $cliente) {
            if ($index < count($propuestasData)) {
                $propuestaData = $propuestasData[$index];
                
                $fechaCreacion = now()->subDays($propuestaData['dias_atras']);
                
                Propuesta::create([
                    'cliente_id' => $cliente->id,
                    'user_id' => $users->random()->id,
                    'titulo' => $propuestaData['titulo'],
                    'estado' => $propuestaData['estado'],
                    'descripcion_proyecto' => $propuestaData['descripcion_proyecto'],
                    'alcance_incluye' => $propuestaData['alcance_incluye'],
                    'alcance_no_incluye' => $propuestaData['alcance_no_incluye'],
                    'precio_total' => $propuestaData['precio_total'],
                    'forma_pago' => $propuestaData['forma_pago'],
                    'tiempo_entrega' => $propuestaData['tiempo_entrega'],
                    'terminos_condiciones' => $propuestaData['terminos_condiciones'],
                    'fecha_envio' => $propuestaData['fecha_envio'] ?? null,
                    'fecha_limite_respuesta' => $propuestaData['fecha_limite_respuesta'] ?? null,
                    'notas_internas' => $propuestaData['notas_internas'] ?? null,
                    'created_at' => $fechaCreacion,
                    'updated_at' => $fechaCreacion,
                ]);
            }
        }

        // Crear algunas propuestas adicionales para tener más datos de prueba
        $estadosPosibles = ['borrador', 'enviada', 'aprobada', 'rechazada', 'negociacion'];
        
        for ($i = 0; $i < 5; $i++) {
            $estado = fake()->randomElement($estadosPosibles);
            $fechaCreacion = fake()->dateTimeBetween('-3 months', 'now');
            
            $fechaEnvio = null;
            $fechaLimite = null;
            
            if (in_array($estado, ['enviada', 'aprobada', 'rechazada', 'negociacion'])) {
                $fechaEnvio = fake()->dateTimeBetween($fechaCreacion, 'now');
                $fechaLimite = fake()->dateTimeBetween($fechaEnvio, '+30 days');
            }
            
            Propuesta::create([
                'cliente_id' => $clientes->random()->id,
                'user_id' => $users->random()->id,
                'titulo' => fake()->randomElement([
                    'Desarrollo de App Móvil',
                    'Sitio Web E-commerce',
                    'Sistema de Gestión',
                    'Portal Corporativo',
                    'Plataforma Digital',
                    'Automatización de Procesos'
                ]) . ' - ' . fake()->company(),
                'estado' => $estado,
                'descripcion_proyecto' => fake()->paragraph(3),
                'alcance_incluye' => "- " . implode("\n- ", fake()->sentences(5)),
                'alcance_no_incluye' => "- " . implode("\n- ", fake()->sentences(3)),
                'precio_total' => fake()->numberBetween(5000, 100000),
                'forma_pago' => fake()->randomElement([
                    '100% adelanto',
                    '50% adelanto, 50% entrega',
                    '30% adelanto, 70% entrega',
                    '30% adelanto, 40% desarrollo, 30% entrega'
                ]),
                'tiempo_entrega' => fake()->randomElement([
                    '4 semanas',
                    '6 semanas',
                    '8 semanas',
                    '10 semanas',
                    '12 semanas',
                    '16 semanas'
                ]),
                'terminos_condiciones' => fake()->paragraph(),
                'fecha_envio' => $fechaEnvio,
                'fecha_limite_respuesta' => $fechaLimite,
                'notas_internas' => fake()->boolean(30) ? fake()->paragraph() : null,
                'created_at' => $fechaCreacion,
                'updated_at' => $fechaCreacion,
            ]);
        }
    }
}