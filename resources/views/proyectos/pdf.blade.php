<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Proyecto: {{ $proyecto->nombre }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 12px;
            line-height: 1.6;
            color: #333;
            background: #fff;
        }

        .header {
            background: #FF6B35;
            color: white;
            padding: 30px;
            text-align: center;
            margin-bottom: 30px;
        }

        .header h1 {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 10px;
        }

        .header p {
            font-size: 16px;
            opacity: 0.9;
        }

        .container {
            padding: 0 30px;
            max-width: 800px;
            margin: 0 auto;
        }

        .section {
            margin-bottom: 30px;
            page-break-inside: avoid;
        }

        .section-title {
            color: #FF6B35;
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 2px solid #FF6B35;
        }

        .info-grid {
            display: table;
            width: 100%;
            margin-bottom: 20px;
        }

        .info-row {
            display: table-row;
        }

        .info-label {
            display: table-cell;
            font-weight: bold;
            color: #666;
            padding: 8px 20px 8px 0;
            width: 30%;
            vertical-align: top;
        }

        .info-value {
            display: table-cell;
            padding: 8px 0;
            color: #333;
            vertical-align: top;
        }

        .highlight-box {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }

        .status-badge {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: bold;
            text-transform: uppercase;
        }

        .status-por-empezar { background: #f8f9fa; color: #6c757d; }
        .status-en-progreso { background: #cce5ff; color: #0066cc; }
        .status-en-pausa { background: #fff3cd; color: #856404; }
        .status-completado { background: #d4edda; color: #155724; }

        .price-box {
            background: #e8f5e8;
            border: 2px solid #28a745;
            border-radius: 10px;
            padding: 25px;
            text-align: center;
            margin: 25px 0;
        }

        .price-box .price {
            font-size: 32px;
            font-weight: bold;
            color: #28a745;
            margin-bottom: 5px;
        }

        .price-box .label {
            font-size: 14px;
            color: #666;
        }

        .task-item {
            background: #f8f9fa;
            border-radius: 6px;
            padding: 12px;
            margin: 8px 0;
            border-left: 4px solid #FF6B35;
            position: relative;
        }

        .task-completed {
            border-left-color: #28a745;
            background: #f8fff8;
        }

        .task-item-title {
            font-weight: bold;
            color: #333;
            margin-bottom: 5px;
        }

        .task-item-meta {
            font-size: 10px;
            color: #666;
        }

        .task-status {
            position: absolute;
            right: 15px;
            top: 15px;
            font-size: 18px;
        }

        .progress-bar {
            background: #e9ecef;
            border-radius: 10px;
            height: 20px;
            margin: 15px 0;
            overflow: hidden;
        }

        .progress-fill {
            background: #28a745;
            height: 100%;
            border-radius: 10px;
            text-align: center;
            line-height: 20px;
            color: white;
            font-size: 11px;
            font-weight: bold;
        }

        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            text-align: center;
            color: #666;
            font-size: 11px;
        }

        .page-break {
            page-break-before: always;
        }

        .no-data {
            text-align: center;
            color: #999;
            font-style: italic;
            padding: 20px;
        }

        .two-column {
            display: table;
            width: 100%;
        }

        .column {
            display: table-cell;
            width: 48%;
            vertical-align: top;
            padding-right: 2%;
        }

        .column:last-child {
            padding-right: 0;
            padding-left: 2%;
        }
    </style>
</head>
<body>
    <!-- Header Principal -->
    <div class="header">
        <h1>{{ $proyecto->nombre }}</h1>
        <p>Reporte del proyecto generado con IA ✨</p>
        <div style="margin-top: 15px;">
            <span class="status-badge status-{{ str_replace(' ', '-', $proyecto->estado) }}">
                {{ str_replace('_', ' ', ucfirst($proyecto->estado)) }}
            </span>
        </div>
    </div>

    <div class="container">
        <!-- Información del Cliente -->
        <div class="section">
            <h2 class="section-title">👤 Información del Cliente</h2>
            <div class="info-grid">
                <div class="info-row">
                    <div class="info-label">Cliente:</div>
                    <div class="info-value">{{ $proyecto->cliente->nombre }} {{ $proyecto->cliente->apellido }}</div>
                </div>
                @if($proyecto->cliente->empresa)
                <div class="info-row">
                    <div class="info-label">Empresa:</div>
                    <div class="info-value">{{ $proyecto->cliente->empresa }}</div>
                </div>
                @endif
                <div class="info-row">
                    <div class="info-label">Email:</div>
                    <div class="info-value">{{ $proyecto->cliente->email }}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">Responsable:</div>
                    <div class="info-value">{{ $proyecto->user->name }}</div>
                </div>
            </div>
        </div>

        <!-- Información del Proyecto -->
        <div class="section">
            <h2 class="section-title">🚀 Detalles del Proyecto</h2>
            <div class="info-grid">
                <div class="info-row">
                    <div class="info-label">Fecha de Inicio:</div>
                    <div class="info-value">
                        {{ $proyecto->fecha_inicio ? \Carbon\Carbon::parse($proyecto->fecha_inicio)->format('d/m/Y') : 'No definida' }}
                    </div>
                </div>
                <div class="info-row">
                    <div class="info-label">Fecha de Entrega:</div>
                    <div class="info-value">
                        {{ $proyecto->fecha_entrega ? \Carbon\Carbon::parse($proyecto->fecha_entrega)->format('d/m/Y') : 'No definida' }}
                    </div>
                </div>
                <div class="info-row">
                    <div class="info-label">Estado Actual:</div>
                    <div class="info-value">{{ str_replace('_', ' ', ucfirst($proyecto->estado)) }}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">Forma de Pago:</div>
                    <div class="info-value">{{ $proyecto->forma_pago }}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">Creado:</div>
                    <div class="info-value">{{ $proyecto->created_at->format('d/m/Y') }}</div>
                </div>
            </div>

            <div class="highlight-box">
                <strong>Descripción del Proyecto:</strong><br>
                {{ $proyecto->descripcion }}
            </div>

            <div class="price-box">
                <div class="price">${{ number_format($proyecto->precio_total, 2) }} USD</div>
                <div class="label">Valor Total del Proyecto</div>
            </div>
        </div>

        @if($proyecto->propuesta)
        <!-- Propuesta Original -->
        <div class="section">
            <h2 class="section-title">📋 Propuesta Original</h2>
            <div class="info-grid">
                <div class="info-row">
                    <div class="info-label">Título:</div>
                    <div class="info-value">{{ $proyecto->propuesta->titulo }}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">Precio Original:</div>
                    <div class="info-value">${{ number_format($proyecto->propuesta->precio_total, 2) }} USD</div>
                </div>
                <div class="info-row">
                    <div class="info-label">Estado Propuesta:</div>
                    <div class="info-value">{{ ucfirst($proyecto->propuesta->estado) }}</div>
                </div>
            </div>
            
            @if($proyecto->propuesta->descripcion_proyecto)
            <div class="highlight-box">
                <strong>Descripción de la Propuesta:</strong><br>
                {{ $proyecto->propuesta->descripcion_proyecto }}
            </div>
            @endif
        </div>
        @endif

        <!-- Tareas del Proyecto -->
        @if($proyecto->tareas && $proyecto->tareas->count() > 0)
        <div class="section page-break">
            <h2 class="section-title">✓ Tareas del Proyecto</h2>
            
            @php
                $completedTasks = $proyecto->tareas->where('completada', true)->count();
                $totalTasks = $proyecto->tareas->count();
                $progressPercentage = $totalTasks > 0 ? round(($completedTasks / $totalTasks) * 100) : 0;
            @endphp
            
            <div class="progress-bar">
                <div class="progress-fill" style="width: {{ $progressPercentage }}%;">
                    {{ $progressPercentage }}% Completado ({{ $completedTasks }}/{{ $totalTasks }})
                </div>
            </div>

            @foreach($proyecto->tareas->sortBy('created_at') as $tarea)
            <div class="task-item {{ $tarea->completada ? 'task-completed' : '' }}">
                <div class="task-status">{{ $tarea->completada ? '✅' : '⏳' }}</div>
                <div class="task-item-title">{{ $tarea->titulo }}</div>
                @if($tarea->descripcion)
                <div style="margin: 8px 0; font-size: 11px; color: #666;">
                    {{ $tarea->descripcion }}
                </div>
                @endif
                <div class="task-item-meta">
                    @if($tarea->fecha_limite)
                    Fecha límite: {{ \Carbon\Carbon::parse($tarea->fecha_limite)->format('d/m/Y') }} |
                    @endif
                    Creada: {{ $tarea->created_at->format('d/m/Y') }}
                    @if($tarea->completada && $tarea->updated_at != $tarea->created_at)
                    | Completada: {{ $tarea->updated_at->format('d/m/Y') }}
                    @endif
                </div>
            </div>
            @endforeach
        </div>
        @else
        <div class="section">
            <h2 class="section-title">✓ Tareas del Proyecto</h2>
            <div class="no-data">No hay tareas registradas para este proyecto</div>
        </div>
        @endif

        @if($proyecto->notas)
        <!-- Notas Adicionales -->
        <div class="section">
            <h2 class="section-title">📝 Notas Adicionales</h2>
            <div class="highlight-box">
                {{ $proyecto->notas }}
            </div>
        </div>
        @endif

        <!-- Footer -->
        <div class="footer">
            <p>
                <strong>Reporte generado automáticamente el {{ now()->format('d/m/Y H:i') }}</strong><br>
                Este reporte contiene información confidencial del proyecto.<br>
                Para más detalles, consulte el sistema CRM.
            </p>
        </div>
    </div>
</body>
</html>