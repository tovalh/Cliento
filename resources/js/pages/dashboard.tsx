import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    AlertTriangle,
    Calendar,
    CheckCircle,
    Clock,
    DollarSign,
    FileText,
    FolderOpen,
    Mail,
    Phone,
    Rocket,
    TrendingUp,
    Users,
    Video,
    Building2,
    Target,
    Briefcase,
    Percent,
    UserPlus,
    Activity
} from 'lucide-react';

// Types
interface Cliente {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    empresa?: string;
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface Seguimiento {
    id: number;
    cliente_id: number;
    user_id: number;
    descripcion: string;
    tipo: 'reunión' | 'llamada' | 'email' | 'whatsapp' | 'otro';
    prioridad: 'baja' | 'media' | 'alta';
    fecha_seguimiento: string;
    completado: boolean;
    created_at: string;
    cliente: Cliente;
    user: User;
}

interface Propuesta {
    id: number;
    cliente_id: number;
    titulo: string;
    estado: string;
    precio_total: number;
    fecha_limite_respuesta?: string;
    cliente: Cliente;
}

interface ActivityLog {
    id: number;
    action: string;
    model_type: string;
    model_id: number;
    title: string;
    description: string;
    icon: string;
    created_at: string;
    time_ago: string;
    full_message: string;
    user: User;
}

interface Props {
    tareasHoy: Seguimiento[];
    tareasVencidas: Seguimiento[];
    propuestasPorVencer: Propuesta[];
    estadisticas: {
        clientes_totales: number;
        propuestas_activas: number;
        proyectos_activos: number;
        tareas_pendientes_total: number;
        valor_propuestas_enviadas: number;
        valor_proyectos_activos: number;
    };
    kpisMes: {
        ventas_mes: number;
        propuestas_enviadas_mes: number;
        nuevos_clientes_mes: number;
        propuestas_aprobadas_mes: number;
        propuestas_resueltas_mes: number;
        tasa_cierre: number;
    };
    actividadesRecientes: ActivityLog[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({ 
    tareasHoy, 
    tareasVencidas, 
    propuestasPorVencer, 
    estadisticas,
    kpisMes,
    actividadesRecientes 
}: Props) {
    const handleCompletarTarea = (seguimientoId: number) => {
        router.post(`/dashboard/completar-tarea/${seguimientoId}`, {}, {
            onSuccess: () => {
                router.reload({ only: ['tareasHoy', 'tareasVencidas'] });
            }
        });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            weekday: 'short',
            day: 'numeric',
            month: 'short'
        });
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    const getDiasVencido = (fecha: string) => {
        const fechaSeguimiento = new Date(fecha);
        const hoy = new Date();
        const diffTime = hoy.getTime() - fechaSeguimiento.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const getDiasRestantes = (fecha: string) => {
        const fechaLimite = new Date(fecha);
        const hoy = new Date();
        const diffTime = fechaLimite.getTime() - hoy.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const getTipoIcon = (tipo: string) => {
        const icons = {
            'reunión': Video,
            'llamada': Phone,
            'email': Mail,
            'whatsapp': Phone,
            'otro': Clock
        };
        return icons[tipo as keyof typeof icons] || Clock;
    };

    const getPrioridadColor = (prioridad: string) => {
        const colors = {
            'alta': 'bg-red-100 text-red-700 border-red-200',
            'media': 'bg-yellow-100 text-yellow-700 border-yellow-200',
            'baja': 'bg-green-100 text-green-700 border-green-200'
        };
        return colors[prioridad as keyof typeof colors] || colors.media;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            
            <div className="min-h-screen bg-background p-8">
                <div className="mx-auto max-w-7xl space-y-8">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                                Dashboard
                            </h1>
                            <p className="text-lg text-gray-600">
                                Tu centro de comando comercial
                            </p>
                        </div>
                        <div className="text-sm text-gray-500">
                            {new Date().toLocaleDateString('es-ES', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                            })}
                        </div>
                    </div>

                    {/* Acceso Rápido - Movido arriba */}
                    <Card className="shadow-lg border bg-primary text-primary-foreground">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-primary-foreground">
                                <Rocket className="h-5 w-5" />
                                Acceso Rápido
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <Link href="/clientes/create">
                                    <Button variant="secondary" className="w-full h-auto p-4 flex flex-col gap-2 bg-white/10 hover:bg-white/20 text-primary-foreground border-white/20">
                                        <Users className="h-6 w-6" />
                                        <span>Nuevo Cliente</span>
                                    </Button>
                                </Link>
                                <Link href="/propuestas/create">
                                    <Button variant="secondary" className="w-full h-auto p-4 flex flex-col gap-2 bg-white/10 hover:bg-white/20 text-primary-foreground border-white/20">
                                        <FileText className="h-6 w-6" />
                                        <span>Nueva Propuesta</span>
                                    </Button>
                                </Link>
                                <Link href="/seguimientos">
                                    <Button variant="secondary" className="w-full h-auto p-4 flex flex-col gap-2 bg-white/10 hover:bg-white/20 text-primary-foreground border-white/20">
                                        <Clock className="h-6 w-6" />
                                        <span>Seguimientos</span>
                                    </Button>
                                </Link>
                                <Link href="/proyectos">
                                    <Button variant="secondary" className="w-full h-auto p-4 flex flex-col gap-2 bg-white/10 hover:bg-white/20 text-primary-foreground border-white/20">
                                        <Target className="h-6 w-6" />
                                        <span>Proyectos</span>
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Widget 1: Mis Tareas para Hoy */}
                        <Card className="shadow-lg border bg-card">
                            <CardHeader className="bg-warning text-warning-foreground">
                                <CardTitle className="flex items-center gap-2">
                                    <Target className="h-6 w-6" />
                                    Mis Tareas para Hoy
                                    <Badge variant="secondary" className="bg-warning/10 text-warning ml-auto">
                                        {tareasHoy.length}
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                {tareasHoy.length === 0 ? (
                                    <div className="text-center py-12">
                                        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                            ¡Excelente trabajo!
                                        </h3>
                                        <p className="text-gray-500">
                                            No tienes tareas pendientes para hoy.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {tareasHoy.map((tarea) => {
                                            const TipoIcon = getTipoIcon(tarea.tipo);
                                            return (
                                                <div 
                                                    key={tarea.id} 
                                                    className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                                                >
                                                    <Checkbox 
                                                        checked={false}
                                                        onCheckedChange={() => handleCompletarTarea(tarea.id)}
                                                        className="mt-1"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <TipoIcon className="h-4 w-4 text-gray-500" />
                                                            <Badge className={`text-xs ${getPrioridadColor(tarea.prioridad)}`}>
                                                                {tarea.prioridad.toUpperCase()}
                                                            </Badge>
                                                        </div>
                                                        <p className="font-medium text-gray-900 mb-1">
                                                            {tarea.descripcion}
                                                        </p>
                                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                                            <Link 
                                                                href={`/clientes/${tarea.cliente.id}`}
                                                                className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                                                            >
                                                                {tarea.cliente.nombre} {tarea.cliente.apellido}
                                                            </Link>
                                                            {tarea.cliente.empresa && (
                                                                <span className="flex items-center gap-1">
                                                                    <Building2 className="h-3 w-3" />
                                                                    {tarea.cliente.empresa}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        <div className="pt-4 border-t">
                                            <Link href="/seguimientos">
                                                <Button variant="outline" className="w-full">
                                                    Ver Todos los Seguimientos
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Widget 2: Atención Requerida */}
                        <Card className="shadow-lg border bg-card">
                            <CardHeader className="bg-destructive text-destructive-foreground">
                                <CardTitle className="flex items-center gap-2">
                                    <AlertTriangle className="h-6 w-6" />
                                    Atención Requerida
                                    <Badge variant="secondary" className="bg-destructive/10 text-destructive ml-auto">
                                        {tareasVencidas.length + propuestasPorVencer.length}
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <Tabs defaultValue="vencidas" className="w-full">
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="vencidas" className="relative">
                                            Tareas Vencidas
                                            {tareasVencidas.length > 0 && (
                                                <Badge className="ml-2 bg-destructive text-destructive-foreground text-xs">
                                                    {tareasVencidas.length}
                                                </Badge>
                                            )}
                                        </TabsTrigger>
                                        <TabsTrigger value="propuestas" className="relative">
                                            Por Vencer
                                            {propuestasPorVencer.length > 0 && (
                                                <Badge className="ml-2 bg-warning text-warning-foreground text-xs">
                                                    {propuestasPorVencer.length}
                                                </Badge>
                                            )}
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="vencidas" className="mt-4">
                                        {tareasVencidas.length === 0 ? (
                                            <div className="text-center py-8">
                                                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                                                <p className="text-gray-500">No hay tareas vencidas</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {tareasVencidas.map((tarea) => {
                                                    const diasVencido = getDiasVencido(tarea.fecha_seguimiento);
                                                    const TipoIcon = getTipoIcon(tarea.tipo);
                                                    return (
                                                        <div 
                                                            key={tarea.id} 
                                                            className="p-4 rounded-lg border border-red-200 bg-red-50"
                                                        >
                                                            <div className="flex items-start gap-3">
                                                                <TipoIcon className="h-4 w-4 text-red-600 mt-1" />
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="font-medium text-gray-900 mb-1">
                                                                        {tarea.descripcion}
                                                                    </p>
                                                                    <div className="flex items-center gap-4 text-sm">
                                                                        <Link 
                                                                            href={`/clientes/${tarea.cliente.id}`}
                                                                            className="font-medium text-blue-600 hover:underline"
                                                                        >
                                                                            {tarea.cliente.nombre} {tarea.cliente.apellido}
                                                                        </Link>
                                                                        <span className="text-red-600 font-medium">
                                                                            Vencido hace {diasVencido} día{diasVencido !== 1 ? 's' : ''}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <Checkbox 
                                                                    checked={false}
                                                                    onCheckedChange={() => handleCompletarTarea(tarea.id)}
                                                                />
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </TabsContent>

                                    <TabsContent value="propuestas" className="mt-4">
                                        {propuestasPorVencer.length === 0 ? (
                                            <div className="text-center py-8">
                                                <Clock className="h-12 w-12 text-green-500 mx-auto mb-3" />
                                                <p className="text-gray-500">No hay propuestas por vencer</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {propuestasPorVencer.map((propuesta) => {
                                                    const diasRestantes = getDiasRestantes(propuesta.fecha_limite_respuesta!);
                                                    return (
                                                        <div 
                                                            key={propuesta.id} 
                                                            className="p-4 rounded-lg border border-yellow-200 bg-yellow-50"
                                                        >
                                                            <div className="flex items-start justify-between">
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="font-medium text-gray-900 mb-1">
                                                                        {propuesta.titulo}
                                                                    </p>
                                                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                                                        <Link 
                                                                            href={`/clientes/${propuesta.cliente.id}`}
                                                                            className="font-medium text-blue-600 hover:underline"
                                                                        >
                                                                            {propuesta.cliente.nombre} {propuesta.cliente.apellido}
                                                                        </Link>
                                                                        <span className="font-bold text-green-600">
                                                                            {formatPrice(propuesta.precio_total)}
                                                                        </span>
                                                                    </div>
                                                                    <p className={`text-sm font-medium mt-2 ${
                                                                        diasRestantes <= 2 ? 'text-red-600' : 
                                                                        diasRestantes <= 5 ? 'text-yellow-600' : 'text-yellow-600'
                                                                    }`}>
                                                                        Vence en {diasRestantes} día{diasRestantes !== 1 ? 's' : ''}
                                                                    </p>
                                                                </div>
                                                                <Link href={`/propuestas/${propuesta.id}`}>
                                                                    <Button variant="outline" size="sm">
                                                                        Ver Propuesta
                                                                    </Button>
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>
                    </div>

                    {/* KPIs del Mes - Nueva sección */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                            <TrendingUp className="h-6 w-6 text-purple-600" />
                            Métricas del Mes - {new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Ventas del Mes */}
                            <Card className="bg-card border shadow-lg hover:shadow-xl transition-all">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-muted-foreground text-sm font-medium">💰 Ventas del Mes</p>
                                            <p className="text-3xl font-bold text-success">{formatPrice(kpisMes.ventas_mes)}</p>
                                            <p className="text-muted-foreground text-xs mt-1">
                                                {kpisMes.propuestas_aprobadas_mes} propuestas aprobadas
                                            </p>
                                        </div>
                                        <DollarSign className="h-8 w-8 text-success" />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Propuestas Enviadas */}
                            <Card className="bg-card border shadow-lg hover:shadow-xl transition-all">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-muted-foreground text-sm font-medium">📋 Propuestas Enviadas</p>
                                            <p className="text-3xl font-bold text-info">{kpisMes.propuestas_enviadas_mes}</p>
                                            <p className="text-muted-foreground text-xs mt-1">
                                                este mes
                                            </p>
                                        </div>
                                        <FileText className="h-8 w-8 text-info" />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Tasa de Cierre */}
                            <Card className="bg-card border shadow-lg hover:shadow-xl transition-all">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-muted-foreground text-sm font-medium">🎯 Tasa de Cierre</p>
                                            <p className="text-3xl font-bold text-primary">{kpisMes.tasa_cierre}%</p>
                                            <p className="text-muted-foreground text-xs mt-1">
                                                de {kpisMes.propuestas_resueltas_mes} resueltas
                                            </p>
                                        </div>
                                        <Percent className="h-8 w-8 text-primary" />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Nuevos Clientes */}
                            <Card className="bg-card border shadow-lg hover:shadow-xl transition-all">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-muted-foreground text-sm font-medium">👥 Nuevos Clientes</p>
                                            <p className="text-3xl font-bold text-warning">{kpisMes.nuevos_clientes_mes}</p>
                                            <p className="text-muted-foreground text-xs mt-1">
                                                este mes
                                            </p>
                                        </div>
                                        <UserPlus className="h-8 w-8 text-warning" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Estadísticas Generales */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                            <Briefcase className="h-6 w-6 text-indigo-600" />
                            Estado General del Negocio
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <Card className="bg-card border shadow-lg hover:shadow-xl transition-all">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-muted-foreground text-sm font-medium">Clientes Activos</p>
                                            <p className="text-3xl font-bold text-primary">{estadisticas.clientes_totales}</p>
                                        </div>
                                        <Users className="h-8 w-8 text-primary" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-card border shadow-lg hover:shadow-xl transition-all">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-muted-foreground text-sm font-medium">Propuestas Activas</p>
                                            <p className="text-3xl font-bold text-info">{estadisticas.propuestas_activas}</p>
                                            <p className="text-muted-foreground text-xs mt-1">
                                                {formatPrice(estadisticas.valor_propuestas_enviadas)} en juego
                                            </p>
                                        </div>
                                        <FileText className="h-8 w-8 text-info" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-card border shadow-lg hover:shadow-xl transition-all">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-muted-foreground text-sm font-medium">Proyectos Activos</p>
                                            <p className="text-3xl font-bold text-success">{estadisticas.proyectos_activos}</p>
                                            <p className="text-muted-foreground text-xs mt-1">
                                                {formatPrice(estadisticas.valor_proyectos_activos)} en ejecución
                                            </p>
                                        </div>
                                        <Target className="h-8 w-8 text-success" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Widget de Actividad Reciente */}
                    <Card className="shadow-lg border bg-card">
                        <CardHeader className="bg-info text-info-foreground">
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="h-6 w-6" />
                                Actividad Reciente
                                <Badge variant="secondary" className="bg-info/10 text-info ml-auto">
                                    {actividadesRecientes.length}
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            {actividadesRecientes.length === 0 ? (
                                <div className="text-center py-12">
                                    <Activity className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                        Sin actividad reciente
                                    </h3>
                                    <p className="text-gray-500">
                                        Comienza a usar el CRM y aquí aparecerá tu actividad.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {actividadesRecientes.map((actividad) => (
                                        <div 
                                            key={actividad.id} 
                                            className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                                        >
                                            <div className="text-2xl">{actividad.icon}</div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-gray-900">
                                                    <span className="font-medium">{actividad.title}</span>
                                                    <span className="text-gray-600"> {actividad.description}</span>
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {new Date(actividad.created_at).toLocaleString('es-ES', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    {actividadesRecientes.length >= 7 && (
                                        <div className="pt-4 border-t text-center">
                                            <p className="text-sm text-gray-500">
                                                Mostrando las últimas 7 actividades
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
