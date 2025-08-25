<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Propuesta: {{ $propuesta->titulo }}</title>
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

        .status-badge {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: bold;
            text-transform: uppercase;
        }

        .status-borrador { background: #f8f9fa; color: #6c757d; }
        .status-enviada { background: #cce5ff; color: #0066cc; }
        .status-aprobada { background: #d4edda; color: #155724; }
        .status-rechazada { background: #f8d7da; color: #721c24; }
        .status-negociacion { background: #fff3cd; color: #856404; }

        .scope-section {
            margin: 20px 0;
        }

        .scope-column {
            width: 48%;
            float: left;
            margin-right: 4%;
        }

        .scope-column:last-child {
            margin-right: 0;
        }

        .scope-list {
            background: #f8f9fa;
            border-radius: 6px;
            padding: 15px;
            margin-top: 10px;
        }

        .scope-list ul {
            list-style: none;
            padding: 0;
        }

        .scope-list li {
            padding: 4px 0;
            border-bottom: 1px solid #e9ecef;
        }

        .scope-list li:last-child {
            border-bottom: none;
        }

        .includes li:before {
            content: "✓ ";
            color: #28a745;
            font-weight: bold;
            margin-right: 8px;
        }

        .excludes li:before {
            content: "✗ ";
            color: #dc3545;
            font-weight: bold;
            margin-right: 8px;
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

        .clearfix::after {
            content: "";
            display: table;
            clear: both;
        }

        .terms-box {
            background: #fff8e1;
            border: 1px solid #ffc107;
            border-radius: 6px;
            padding: 15px;
            margin: 15px 0;
        }
    </style>
</head>
<body>
    <!-- Header Principal -->
    <div class="header">
        <h1>{{ $propuesta->titulo }}</h1>
        <p>Propuesta comercial generada con IA ✨</p>
        <div style="margin-top: 15px;">
            <span class="status-badge status-{{ $propuesta->estado }}">
                {{ ucfirst($propuesta->estado) }}
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
                    <div class="info-value">{{ $propuesta->cliente->nombre }} {{ $propuesta->cliente->apellido }}</div>
                </div>
                @if($propuesta->cliente->empresa)
                <div class="info-row">
                    <div class="info-label">Empresa:</div>
                    <div class="info-value">{{ $propuesta->cliente->empresa }}</div>
                </div>
                @endif
                <div class="info-row">
                    <div class="info-label">Email:</div>
                    <div class="info-value">{{ $propuesta->cliente->email }}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">Fecha de Propuesta:</div>
                    <div class="info-value">{{ $propuesta->created_at->format('d/m/Y') }}</div>
                </div>
                @if($propuesta->fecha_limite_respuesta)
                <div class="info-row">
                    <div class="info-label">Válida hasta:</div>
                    <div class="info-value">{{ \Carbon\Carbon::parse($propuesta->fecha_limite_respuesta)->format('d/m/Y') }}</div>
                </div>
                @endif
            </div>
        </div>

        <!-- Descripción del Proyecto -->
        <div class="section">
            <h2 class="section-title">📋 Descripción del Proyecto</h2>
            <div class="highlight-box">
                {!! nl2br(e($propuesta->descripcion_proyecto)) !!}
            </div>
        </div>

        <!-- Alcance del Proyecto -->
        <div class="section">
            <h2 class="section-title">🎯 Alcance del Proyecto</h2>
            <div class="scope-section clearfix">
                <div class="scope-column">
                    <h3 style="color: #28a745; margin-bottom: 10px;">✅ Lo que SÍ incluye:</h3>
                    <div class="scope-list includes">
                        <ul>
                            @foreach(explode("\n", $propuesta->alcance_incluye) as $item)
                                @if(trim($item))
                                <li>{{ trim(str_replace('-', '', $item)) }}</li>
                                @endif
                            @endforeach
                        </ul>
                    </div>
                </div>
                
                @if($propuesta->alcance_no_incluye)
                <div class="scope-column">
                    <h3 style="color: #dc3545; margin-bottom: 10px;">❌ Lo que NO incluye:</h3>
                    <div class="scope-list excludes">
                        <ul>
                            @foreach(explode("\n", $propuesta->alcance_no_incluye) as $item)
                                @if(trim($item))
                                <li>{{ trim(str_replace('-', '', $item)) }}</li>
                                @endif
                            @endforeach
                        </ul>
                    </div>
                </div>
                @endif
            </div>
        </div>

        <!-- Información Comercial -->
        <div class="section page-break">
            <h2 class="section-title">💰 Información Comercial</h2>
            
            <div class="price-box">
                <div class="price">${{ number_format($propuesta->precio_total, 2) }} USD</div>
                <div class="label">Precio Total del Proyecto</div>
            </div>

            <div class="info-grid">
                <div class="info-row">
                    <div class="info-label">Forma de Pago:</div>
                    <div class="info-value">{{ $propuesta->forma_pago }}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">Tiempo de Entrega:</div>
                    <div class="info-value">{{ $propuesta->tiempo_entrega }}</div>
                </div>
            </div>
        </div>

        <!-- Términos y Condiciones -->
        @if($propuesta->terminos_condiciones)
        <div class="section">
            <h2 class="section-title">📝 Términos y Condiciones</h2>
            <div class="terms-box">
                {!! nl2br(e($propuesta->terminos_condiciones)) !!}
            </div>
        </div>
        @endif

        <!-- Información del Responsable -->
        <div class="section">
            <h2 class="section-title">👨‍💼 Información de Contacto</h2>
            <div class="info-grid">
                <div class="info-row">
                    <div class="info-label">Responsable:</div>
                    <div class="info-value">{{ $propuesta->user->name }}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">Email:</div>
                    <div class="info-value">{{ $propuesta->user->email }}</div>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>
                <strong>Propuesta generada automáticamente el {{ now()->format('d/m/Y H:i') }}</strong><br>
                Esta propuesta es válida por 30 días desde su fecha de emisión.<br>
                Para cualquier consulta, no dude en contactarnos.
            </p>
        </div>
    </div>
</body>
</html>