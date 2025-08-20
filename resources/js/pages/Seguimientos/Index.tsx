import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
// Types
interface Cliente {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    telefono?: string;
    empresa?: string;
    direccion?: string;
    ciudad?: string;
    fecha_nacimiento?: string;
    estado: 'activo' | 'inactivo';
    notas?: string;
    created_at: string;
    updated_at: string;
    nombre_completo?: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
}

interface BreadcrumbItem {
    title: string;
    href: string;
}

interface Seguimiento {
    id: number;
    cliente_id: number;
    user_id: number;
    titulo: string;
    descripcion?: string;
    fecha_seguimiento: string;
    prioridad: 'baja' | 'media' | 'alta';
    tipo: 'llamada' | 'email' | 'reunion' | 'propuesta' | 'otro';
    completado: boolean;
    completado_en?: string;
    created_at: string;
    updated_at: string;
    cliente: Cliente;
    user: User;
    estado?: 'completado' | 'vencido' | 'hoy' | 'pendiente';
    dias_restantes?: number;
}
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    Calendar,
    CheckCircle,
    Clock,
    Eye,
    Filter,
    Plus,
    Search,
    Trash2,
    User,
    Building,
    Phone,
    Mail,
    Users,
    AlertTriangle,
    TrendingUp,
    RotateCcw,
    ArrowUpDown,
    ChevronUp,
    ChevronDown
} from 'lucide-react';
import { useState } from 'react';

interface Props {
    seguimientos: {
        data: Seguimiento[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
    filtros: {
        estado?: string;
        prioridad?: string;
        tipo?: string;
        cliente?: string;
        buscar?: string;
        orden?: string;
        direccion?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Seguimientos',
        href: '/seguimientos',
    },
];

export default function Index({ seguimientos, filtros }: Props) {
    const [activeFilters, setActiveFilters] = useState(false);

    const { data, setData, processing } = useForm({
        estado: filtros.estado || '',
        prioridad: filtros.prioridad || '',
        tipo: filtros.tipo || '',
        cliente: filtros.cliente || '',
        buscar: filtros.buscar || '',
        orden: filtros.orden || 'fecha_seguimiento',
        direccion: filtros.direccion || 'asc',
    });

    const handleFilter = () => {
        // Filtrar valores vacíos antes de enviar
        const filteredData = Object.fromEntries(
            Object.entries(data).filter(([_, value]) => value !== '' && value !== null && value !== undefined)
        );

        router.get('/seguimientos', filteredData, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleSort = (campo: string) => {
        const newDirection = data.orden === campo && data.direccion === 'asc' ? 'desc' : 'asc';
        setData({
            ...data,
            orden: campo,
            direccion: newDirection
        });
        router.get('/seguimientos', { ...data, orden: campo, direccion: newDirection }, {
            preserveState: true
        });
    };

    const handleComplete = (id: number) => {
        router.post(`/seguimientos/${id}/completar`, {}, {
            onSuccess: () => {
                router.reload({ only: ['seguimientos'] });
            }
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de que quieres eliminar este seguimiento?')) {
            router.delete(`/seguimientos/${id}`, {
                onSuccess: () => {
                    router.reload({ only: ['seguimientos'] });
                }
            });
        }
    };

    const clearFilters = () => {
        setData({
            estado: '',
            prioridad: '',
            tipo: '',
            cliente: '',
            buscar: '',
            orden: 'fecha_seguimiento',
            direccion: 'asc',
        });
        router.get('/seguimientos', {
            orden: 'fecha_seguimiento',
            direccion: 'asc',
        }, { preserveState: true });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const today = new Date();
        const diffInDays = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) {
            return { text: 'Hoy', variant: 'today' };
        } else if (diffInDays === 1) {
            return { text: 'Mañana', variant: 'tomorrow' };
        } else if (diffInDays === -1) {
            return { text: 'Ayer', variant: 'overdue' };
        } else if (diffInDays < 0) {
            return { text: `${Math.abs(diffInDays)} días vencido`, variant: 'overdue' };
        } else {
            return { text: `En ${diffInDays} días`, variant: 'future' };
        }
    };

    const getTipoConfig = (tipo: string) => {
        const configs = {
            llamada: { icon: Phone, color: 'text-blue-800', bg: 'bg-blue-100', label: 'Llamada' },
            email: { icon: Mail, color: 'text-yellow-800', bg: 'bg-yellow-100', label: 'Email' },
            reunion: { icon: Users, color: 'text-purple-800', bg: 'bg-purple-100', label: 'Reunión' },
            propuesta: { icon: Building, color: 'text-orange-800', bg: 'bg-orange-100', label: 'Propuesta' },
            otro: { icon: Calendar, color: 'text-gray-800', bg: 'bg-gray-100', label: 'Otro' }
        };
        return configs[tipo as keyof typeof configs] || configs.otro;
    };

    const getPrioridadConfig = (prioridad: string) => {
        const configs = {
            alta: { color: 'text-red-800', bg: 'bg-red-100', label: 'Alta' },
            media: { color: 'text-amber-800', bg: 'bg-amber-100', label: 'Media' },
            baja: { color: 'text-green-800', bg: 'bg-green-100', label: 'Baja' }
        };
        return configs[prioridad as keyof typeof configs] || configs.media;
    };

    const getStatusColor = (seguimiento: Seguimiento) => {
        if (seguimiento.completado) {
            return 'border-l-green-500'; // Completado
        }

        const today = new Date();
        const fechaSeguimiento = new Date(seguimiento.fecha_seguimiento);

        if (fechaSeguimiento < today) {
            return 'border-l-red-500'; // Vencido
        } else {
            return 'border-l-amber-500'; // Pendiente
        }
    };

    // Statistics calculations
    const totalSeguimientos = seguimientos.total;
    const pendientes = seguimientos.data.filter(s => !s.completado).length;
    const hoy = seguimientos.data.filter(s =>
        !s.completado && new Date(s.fecha_seguimiento).toDateString() === new Date().toDateString()
    ).length;
    const vencidos = seguimientos.data.filter(s =>
        !s.completado && new Date(s.fecha_seguimiento) < new Date()
    ).length;
    const completados = seguimientos.data.filter(s => s.completado).length;

    const SortButton = ({ campo, children }: { campo: string; children: React.ReactNode }) => (
        <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSort(campo)}
            className="h-auto p-1 font-medium text-gray-600 hover:text-gray-900"
        >
            {children}
            <ArrowUpDown className="ml-1 h-3 w-3" />
            {data.orden === campo && (
                data.direccion === 'asc' ?
                <ChevronUp className="ml-1 h-3 w-3 text-blue-600" /> :
                <ChevronDown className="ml-1 h-3 w-3 text-blue-600" />
            )}
        </Button>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Seguimientos" />

            <div className="min-h-screen bg-background p-8">
                <div className="mx-auto max-w-7xl space-y-8">
                    {/* Header Section */}
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                                Seguimientos
                            </h1>
                            <p className="text-lg text-gray-600">
                                Gestiona y organiza todos tus seguimientos de manera eficiente
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <Button
                                variant="outline"
                                onClick={() => setActiveFilters(!activeFilters)}
                                className="bg-white text-slate-700 font-semibold rounded-lg border border-slate-300 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <Filter className="mr-2 h-4 w-4" />
                                Filtros
                            </Button>
                            <Link href="/clientes">
                                <Button className="bg-blue-600 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Nuevo Seguimiento
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                        <Card className="bg-card border shadow-sm hover:shadow-md transition-all">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-muted-foreground text-sm font-medium">Total</p>
                                        <p className="text-3xl font-bold text-slate-900">{totalSeguimientos}</p>
                                    </div>
                                    <TrendingUp className="h-8 w-8 text-blue-600" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-card border shadow-sm hover:shadow-md transition-all">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-muted-foreground text-sm font-medium">Hoy</p>
                                        <p className="text-3xl font-bold text-slate-900">{hoy}</p>
                                    </div>
                                    <Calendar className="h-8 w-8 text-warning" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-card border shadow-sm hover:shadow-md transition-all">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-muted-foreground text-sm font-medium">Vencidos</p>
                                        <p className="text-3xl font-bold text-slate-900">{vencidos}</p>
                                    </div>
                                    <AlertTriangle className="h-8 w-8 text-red-500" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-card border shadow-sm hover:shadow-md transition-all">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-muted-foreground text-sm font-medium">Pendientes</p>
                                        <p className="text-3xl font-bold text-slate-900">{pendientes}</p>
                                    </div>
                                    <Clock className="h-8 w-8 text-amber-500" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-card border shadow-sm hover:shadow-md transition-all">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-muted-foreground text-sm font-medium">Completados</p>
                                        <p className="text-3xl font-bold text-slate-900">{completados}</p>
                                    </div>
                                    <CheckCircle className="h-8 w-8  text-green-500" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Filters Panel */}
                    {activeFilters && (
                        <Card className="bg-card border shadow-lg">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                    <Filter className="h-5 w-5" />
                                    Filtros de Búsqueda
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                                    <div className="lg:col-span-2">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input
                                                placeholder="Buscar seguimientos..."
                                                value={data.buscar}
                                                onChange={(e) => setData('buscar', e.target.value)}
                                                className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <Select value={data.estado || 'todos'} onValueChange={(value) => setData('estado', value === 'todos' ? '' : value)}>
                                        <SelectTrigger className="bg-gray-50 border-gray-200 focus:bg-white">
                                            <SelectValue placeholder="Estado" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="todos">Todos los estados</SelectItem>
                                            <SelectItem value="pendientes">Pendientes</SelectItem>
                                            <SelectItem value="completados">Completados</SelectItem>
                                            <SelectItem value="vencidos">Vencidos</SelectItem>
                                            <SelectItem value="hoy">Hoy</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <Select value={data.prioridad || 'todas'} onValueChange={(value) => setData('prioridad', value === 'todas' ? '' : value)}>
                                        <SelectTrigger className="bg-gray-50 border-gray-200 focus:bg-white">
                                            <SelectValue placeholder="Prioridad" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="todas">Todas</SelectItem>
                                            <SelectItem value="alta">Alta</SelectItem>
                                            <SelectItem value="media">Media</SelectItem>
                                            <SelectItem value="baja">Baja</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <Select value={data.tipo || 'todos'} onValueChange={(value) => setData('tipo', value === 'todos' ? '' : value)}>
                                        <SelectTrigger className="bg-gray-50 border-gray-200 focus:bg-white">
                                            <SelectValue placeholder="Tipo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="todos">Todos</SelectItem>
                                            <SelectItem value="llamada">Llamada</SelectItem>
                                            <SelectItem value="email">Email</SelectItem>
                                            <SelectItem value="reunion">Reunión</SelectItem>
                                            <SelectItem value="propuesta">Propuesta</SelectItem>
                                            <SelectItem value="otro">Otro</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <Input
                                        placeholder="Cliente..."
                                        value={data.cliente}
                                        onChange={(e) => setData('cliente', e.target.value)}
                                        className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                    />
                                </div>

                                <div className="flex items-center gap-3 pt-2">
                                    <Button
                                        onClick={handleFilter}
                                        disabled={processing}
                                        className="bg-blue-600 hover:bg-blue-700"
                                    >
                                        Aplicar Filtros
                                    </Button>
                                    <Button variant="outline" onClick={clearFilters}>
                                        <RotateCcw className="mr-2 h-4 w-4" />
                                        Limpiar
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Main Content */}
                    <Card className="bg-card border shadow-lg overflow-hidden">
                        <CardHeader className="bg-gray-50 border-b border-gray-200">
                            <div className="grid grid-cols-12 gap-4 items-center text-sm font-semibold text-gray-600">
                                <div className="col-span-3">
                                    <SortButton campo="titulo">SEGUIMIENTO</SortButton>
                                </div>
                                <div className="col-span-2">
                                    <SortButton campo="cliente">CLIENTE</SortButton>
                                </div>
                                <div className="col-span-2">
                                    <SortButton campo="fecha_seguimiento">FECHA</SortButton>
                                </div>
                                <div className="col-span-1 text-center">
                                    <SortButton campo="tipo">TIPO</SortButton>
                                </div>
                                <div className="col-span-1 text-center">
                                    <SortButton campo="prioridad">PRIORIDAD</SortButton>
                                </div>
                                <div className="col-span-3 text-center">
                                    <span className="text-sm font-semibold text-gray-600">ACCIONES</span>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="p-0">
                            {seguimientos.data.length === 0 ? (
                                <div className="text-center py-16">
                                    <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                                        No se encontraron seguimientos
                                    </h3>
                                    <p className="text-gray-500">
                                        Ajusta los filtros o agrega nuevos seguimientos desde las fichas de clientes.
                                    </p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100">
                                    {seguimientos.data.map((seguimiento) => {
                                        const dateInfo = formatDate(seguimiento.fecha_seguimiento);
                                        const tipoConfig = getTipoConfig(seguimiento.tipo);
                                        const prioridadConfig = getPrioridadConfig(seguimiento.prioridad);

                                        return (
                                            <div
                                                key={seguimiento.id}
                                                className={`p-6 border-l-2 hover:bg-gray-50 transition-all duration-200 ${getStatusColor(seguimiento)}`}
                                            >
                                                <div className="grid grid-cols-12 gap-4 items-center">
                                                    <div className="col-span-3">
                                                        <h3 className="font-semibold text-gray-900 mb-1 truncate">
                                                            {seguimiento.titulo}
                                                        </h3>
                                                        {seguimiento.descripcion && (
                                                            <p className="text-sm text-gray-600 truncate">
                                                                {seguimiento.descripcion}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="col-span-2">
                                                        <div className="font-medium text-gray-900 truncate">
                                                            {seguimiento.cliente.nombre} {seguimiento.cliente.apellido}
                                                        </div>
                                                        {seguimiento.cliente.empresa && (
                                                            <p className="text-sm text-gray-500 mt-1 truncate">
                                                                {seguimiento.cliente.empresa}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="col-span-2">
                                                        <div className="space-y-1">
                                                            <p className={`text-sm font-semibold ${
                                                                dateInfo.variant === 'overdue' ? 'text-slate-700' :
                                                                dateInfo.variant === 'today' ? 'text-slate-700' :
                                                                dateInfo.variant === 'tomorrow' ? 'text-slate-700' :
                                                                'text-slate-700'
                                                            }`}>
                                                                {dateInfo.text}
                                                            </p>
                                                            <p className="text-xs text-slate-500">
                                                                {new Date(seguimiento.fecha_seguimiento).toLocaleDateString('es-ES', {
                                                                    weekday: 'short',
                                                                    day: 'numeric',
                                                                    month: 'short'
                                                                })}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="col-span-1 flex justify-center">
                                                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${tipoConfig.bg}`}>
                                                            <tipoConfig.icon className={`h-3 w-3 ${tipoConfig.color}`} />
                                                            <span className={`text-xs font-semibold ${tipoConfig.color}`}>
                                                                {tipoConfig.label}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="col-span-1 flex justify-center">
                                                        <div className={`inline-flex items-center px-2 py-1 rounded-full ${prioridadConfig.bg}`}>
                                                            <span className={`text-xs font-semibold ${prioridadConfig.color}`}>
                                                                {prioridadConfig.label}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="col-span-3 flex justify-center gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => router.visit(`/clientes/${seguimiento.cliente_id}`)}
                                                            className="h-8 w-8 p-0 border-gray-300 hover:bg-blue-50 hover:border-blue-300"
                                                            title="Ver cliente"
                                                        >
                                                            <Eye className="h-3 w-3" />
                                                        </Button>

                                                        {!seguimiento.completado && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleComplete(seguimiento.id)}
                                                                className="h-8 w-8 p-0 border-green-300 text-green-600 hover:bg-green-50 hover:border-green-400"
                                                                title="Marcar como completado"
                                                            >
                                                                <CheckCircle className="h-3 w-3" />
                                                            </Button>
                                                        )}

                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleDelete(seguimiento.id)}
                                                            className="h-8 w-8 p-0 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
                                                            title="Eliminar"
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Pagination */}
                    {seguimientos.last_page > 1 && (
                        <div className="flex justify-center">
                            <div className="flex items-center gap-2 bg-white rounded-lg shadow-md p-2">
                                {seguimientos.links.map((link, index) => (
                                    <Button
                                        key={index}
                                        variant={link.active ? "default" : "ghost"}
                                        size="sm"
                                        onClick={() => link.url && router.visit(link.url)}
                                        disabled={!link.url}
                                        className={link.active ? "bg-blue-600 hover:bg-blue-700" : ""}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
