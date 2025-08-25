<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cliente: {{ $cliente->nombre }} {{ $cliente->apellido }}</title>
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

        .stats-grid {
            display: table;
            width: 100%;
            margin: 20px 0;
        }

        .stats-row {
            display: table-row;
        }

        .stat-box {
            display: table-cell;
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 15px;
            text-align: center;
            margin: 5px;
            width: 25%;
        }

        .stat-number {
            font-size: 24px;
            font-weight: bold;
            color: #FF6B35;
            margin-bottom: 5px;
        }

        .stat-label {
            font-size: 11px;
            color: #666;
            text-transform: uppercase;
        }

        .timeline-item {
            border-left: 3px solid #FF6B35;
            padding-left: 15px;
            margin-bottom: 15px;
            position: relative;
        }

        .timeline-item:before {
            content: '';
            position: absolute;
            left: -6px;
            top: 5px;
            width: 9px;
            height: 9px;
            border-radius: 50%;
            background: #FF6B35;
        }

        .timeline-date {
            font-size: 10px;
            color: #666;
            margin-bottom: 5px;
        }

        .timeline-title {
            font-weight: bold;
            color: #333;
            margin-bottom: 3px;
        }

        .timeline-description {
            font-size: 11px;
            color: #666;
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

        .list-item {
            background: #f8f9fa;
            border-radius: 6px;
            padding: 12px;
            margin: 8px 0;
            border-left: 4px solid #FF6B35;
        }

        .list-item-title {
            font-weight: bold;
            color: #333;
            margin-bottom: 5px;
        }

        .list-item-meta {
            font-size: 10px;
            color: #666;
        }

        .price-highlight {
            color: #28a745;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <!-- Header Principal -->
    <div class="header">
        <h1>{{ $cliente->nombre }} {{ $cliente->apellido }}</h1>
        <p>Reporte completo generado con IA ✨</p>
        @if($cliente->empresa)
        <p style="margin-top: 10px; font-size: 14px;">{{ $cliente->empresa }}</p>
        @endif
    </div>

    <div class="container">
        <!-- Información Personal del Cliente -->
        <div class="section">
            <h2 class="section-title">👤 Información Personal</h2>
            <div class="info-grid">
                <div class="info-row">
                    <div class="info-label">Nombre Completo:</div>
                    <div class="info-value">{{ $cliente->nombre }} {{ $cliente->apellido }}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">Email:</div>
                    <div class="info-value">{{ $cliente->email }}</div>
                </div>
                @if($cliente->telefono)
                <div class="info-row">
                    <div class="info-label">Teléfono:</div>
                    <div class="info-value">{{ $cliente->telefono }}</div>
                </div>
                @endif
                @if($cliente->empresa)
                <div class="info-row">
                    <div class="info-label">Empresa:</div>
                    <div class="info-value">{{ $cliente->empresa }}</div>
                </div>
                @endif
                @if($cliente->direccion)
                <div class="info-row">
                    <div class="info-label">Dirección:</div>
                    <div class="info-value">{{ $cliente->direccion }}</div>
                </div>
                @endif
                <div class="info-row">
                    <div class="info-label">Cliente desde:</div>
                    <div class="info-value">{{ $cliente->created_at->format('d/m/Y') }}</div>
                </div>
            </div>
        </div>

        <!-- Estadísticas del Cliente -->
        <div class="section">
            <h2 class="section-title">📊 Resumen de Actividad</h2>
            <div class="stats-grid">
                <div class="stats-row">
                    <div class="stat-box">
                        <div class="stat-number">{{ $cliente->propuestas ? $cliente->propuestas->count() : 0 }}</div>
                        <div class="stat-label">Propuestas</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-number">{{ $cliente->proyectos ? $cliente->proyectos->count() : 0 }}</div>
                        <div class="stat-label">Proyectos</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-number">{{ $cliente->seguimientos ? $cliente->seguimientos->count() : 0 }}</div>
                        <div class="stat-label">Seguimientos</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-number">{{ $cliente->notas ? $cliente->notas->count() : 0 }}</div>
                        <div class="stat-label">Notas</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Propuestas -->
        @if($cliente->propuestas && $cliente->propuestas->count() > 0)
        <div class="section">
            <h2 class="section-title">📋 Propuestas</h2>
            @foreach($cliente->propuestas as $propuesta)
            <div class="list-item">
                <div class="list-item-title">{{ $propuesta->titulo }}</div>
                <div class="list-item-meta">
                    Estado: {{ ucfirst($propuesta->estado) }} | 
                    Valor: <span class="price-highlight">${{ number_format($propuesta->precio_total, 2) }}</span> | 
                    {{ $propuesta->created_at->format('d/m/Y') }}
                </div>
                @if($propuesta->descripcion_proyecto)
                <div style="margin-top: 8px; font-size: 11px;">
                    {{ Str::limit($propuesta->descripcion_proyecto, 150) }}
                </div>
                @endif
            </div>
            @endforeach
        </div>
        @endif

        <!-- Proyectos -->
        @if($cliente->proyectos && $cliente->proyectos->count() > 0)
        <div class="section page-break">
            <h2 class="section-title">🚀 Proyectos</h2>
            @foreach($cliente->proyectos as $proyecto)
            <div class="list-item">
                <div class="list-item-title">{{ $proyecto->nombre }}</div>
                <div class="list-item-meta">
                    Estado: {{ str_replace('_', ' ', ucfirst($proyecto->estado)) }} | 
                    Valor: <span class="price-highlight">${{ number_format($proyecto->precio_total, 2) }}</span> | 
                    {{ $proyecto->created_at->format('d/m/Y') }}
                </div>
                @if($proyecto->descripcion)
                <div style="margin-top: 8px; font-size: 11px;">
                    {{ Str::limit($proyecto->descripcion, 150) }}
                </div>
                @endif
            </div>
            @endforeach
        </div>
        @endif

        <!-- Timeline de Seguimientos -->
        @if($cliente->seguimientos && $cliente->seguimientos->count() > 0)
        <div class="section">
            <h2 class="section-title">📅 Historial de Seguimientos</h2>
            @foreach($cliente->seguimientos->sortByDesc('fecha_seguimiento')->take(10) as $seguimiento)
            <div class="timeline-item">
                <div class="timeline-date">{{ \Carbon\Carbon::parse($seguimiento->fecha_seguimiento)->format('d/m/Y') }}</div>
                <div class="timeline-title">{{ $seguimiento->titulo }}</div>
                @if($seguimiento->descripcion)
                <div class="timeline-description">{{ Str::limit($seguimiento->descripcion, 100) }}</div>
                @endif
            </div>
            @endforeach
            @if($cliente->seguimientos && $cliente->seguimientos->count() > 10)
            <div class="no-data">... y {{ $cliente->seguimientos->count() - 10 }} seguimientos más</div>
            @endif
        </div>
        @endif

        <!-- Notas -->
        @if($cliente->notas && $cliente->notas->count() > 0)
        <div class="section">
            <h2 class="section-title">📝 Notas</h2>
            @foreach($cliente->notas->sortByDesc('created_at')->take(5) as $nota)
            <div class="list-item">
                <div class="list-item-title">{{ $nota->titulo }}</div>
                <div class="list-item-meta">{{ $nota->created_at->format('d/m/Y H:i') }}</div>
                @if($nota->contenido)
                <div style="margin-top: 8px; font-size: 11px;">
                    {{ Str::limit($nota->contenido, 200) }}
                </div>
                @endif
            </div>
            @endforeach
            @if($cliente->notas && $cliente->notas->count() > 5)
            <div class="no-data">... y {{ $cliente->notas->count() - 5 }} notas más</div>
            @endif
        </div>
        @endif

        <!-- Footer -->
        <div class="footer">
            <p>
                <strong>Reporte generado automáticamente el {{ now()->format('d/m/Y H:i') }}</strong><br>
                Este reporte contiene información confidencial del cliente.<br>
                Para más detalles, consulte el sistema CRM.
            </p>
        </div>
    </div>
</body>
</html>