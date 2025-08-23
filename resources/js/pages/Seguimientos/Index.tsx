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
    ChevronDown,
    ChevronsUpDown,
    Pencil
} from 'lucide-react';
import { useState } from 'react';

type SortField = 'titulo' | 'cliente' | 'fecha_seguimiento' | 'tipo' | 'prioridad' | 'completado';
type SortOrder = 'asc' | 'desc';

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

    const [sortField, setSortField] = useState<SortField | null>(filtros?.orden as SortField || null);
    const [sortOrder, setSortOrder] = useState<SortOrder>(filtros?.direccion as SortOrder || 'asc');

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

    const handleSort = (field: SortField) => {
        let newOrder: SortOrder = 'asc';

        if (sortField === field) {
            newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        }

        setSortField(field);
        setSortOrder(newOrder);

        router.get('/seguimientos', {
            buscar: data.buscar,
            estado: data.estado,
            prioridad: data.prioridad,
            tipo: data.tipo,
            cliente: data.cliente,
            orden: field,
            direccion: newOrder,
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const getSortIcon = (field: SortField) => {
        if (sortField !== field) {
            return <ChevronsUpDown className="ml-1 h-3 w-3 text-gray-400" />;
        }

        return sortOrder === 'asc'
            ? <ChevronUp className="ml-1 h-3 w-3 text-[#FF6B35]" />
            : <ChevronDown className="ml-1 h-3 w-3 text-[#FF6B35]" />;
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


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Seguimientos" />

            <div className="min-h-screen bg-[#F8F9FA]">
                {/* Header naranja */}
                <div className="bg-[#FF6B35]">
                    <div className="mx-auto px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-[28px] font-bold text-white">
                                    Seguimientos
                                </h1>
                                <p className="text-white text-base opacity-90 mt-1">
                                    Gestiona y organiza todos tus seguimientos de manera eficiente
                                </p>
                            </div>

                            <div className="flex items-center space-x-4">
                                {/* Barra de búsqueda */}
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        type="text"
                                        placeholder="Buscar seguimientos..."
                                        value={data.buscar}
                                        onChange={(e) => setData('buscar', e.target.value)}
                                        onBlur={() => {
                                            handleFilter();
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleFilter();
                                            }
                                        }}
                                        className="pl-10 w-[300px] bg-white border-0"
                                    />
                                </div>

                                {/* Botón Nuevo Seguimiento */}
                                <Link href="/seguimientos/create">
                                    <Button className="bg-white text-[#FF6B35] hover:bg-gray-50 hover:text-[#FF6B35] font-medium px-6 py-3 rounded-lg transition-colors cursor-pointer shadow-sm">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Nuevo Seguimiento
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contenido principal */}
                <div className="mx-auto p-6 space-y-8">

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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


      {/*                  <Card className="bg-card border shadow-sm hover:shadow-md transition-all">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-muted-foreground text-sm font-medium">Hoy</p>
                                        <p className="text-3xl font-bold text-slate-900">{hoy}</p>
                                    </div>
                                    <Calendar className="h-8 w-8 text-warning" />
                                </div>
                            </CardContent>
                        </Card>*/}

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

                    {/* Tabla de seguimientos */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        {seguimientos.data.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="text-gray-400 mb-4">
                                    <Search className="h-16 w-16 mx-auto" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                                    No se encontraron seguimientos
                                </h3>
                                <p className="text-gray-500 mb-6">
                                    {data.buscar
                                        ? 'Ajusta la búsqueda o agrega nuevos seguimientos.'
                                        : 'Comienza agregando tu primer seguimiento.'
                                    }
                                </p>
                                <Link href="/seguimientos/create">
                                    <Button className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white hover:text-white transition-colors cursor-pointer">
                                        <Plus className="mr-2 h-4 w-4 text-white" />
                                        Crear primer seguimiento
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <>
                                {/* Header de tabla */}
                                <div className="bg-[#E5E7EB] px-5 py-4 border-b border-[#E5E7EB]">
                                    <div className="grid grid-cols-12 gap-4 items-center">
                                        <div className="col-span-3 lg:col-span-3">
                                            <button
                                                onClick={() => handleSort('titulo')}
                                                className="flex items-center text-[#333] font-semibold text-sm hover:text-[#FF6B35] transition-colors cursor-pointer"
                                            >
                                                SEGUIMIENTO
                                                {getSortIcon('titulo')}
                                            </button>
                                        </div>
                                        <div className="hidden lg:block lg:col-span-2">
                                            <button
                                                onClick={() => handleSort('cliente')}
                                                className="flex items-center text-[#333] font-semibold text-sm hover:text-[#FF6B35] transition-colors cursor-pointer"
                                            >
                                                CLIENTE
                                                {getSortIcon('cliente')}
                                            </button>
                                        </div>
                                        <div className="hidden md:block md:col-span-2">
                                            <button
                                                onClick={() => handleSort('fecha_seguimiento')}
                                                className="flex items-center text-[#333] font-semibold text-sm hover:text-[#FF6B35] transition-colors cursor-pointer"
                                            >
                                                FECHA
                                                {getSortIcon('fecha_seguimiento')}
                                            </button>
                                        </div>
                                        <div className="col-span-2 lg:col-span-1">
                                            <button
                                                onClick={() => handleSort('tipo')}
                                                className="flex items-center text-[#333] font-semibold text-sm hover:text-[#FF6B35] transition-colors cursor-pointer"
                                            >
                                                TIPO
                                                {getSortIcon('tipo')}
                                            </button>
                                        </div>
                                        <div className="hidden lg:block lg:col-span-1">
                                            <button
                                                onClick={() => handleSort('prioridad')}
                                                className="flex items-center text-[#333] font-semibold text-sm hover:text-[#FF6B35] transition-colors cursor-pointer"
                                            >
                                                PRIORIDAD
                                                {getSortIcon('prioridad')}
                                            </button>
                                        </div>
                                        <div className="col-span-7 lg:col-span-3 text-right">
                                            <span className="text-[#333] font-semibold text-sm">ACCIONES</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Filas de datos */}
                                <div>
                                    {seguimientos.data.map((seguimiento, index) => {
                                        const dateInfo = formatDate(seguimiento.fecha_seguimiento);
                                        const tipoConfig = getTipoConfig(seguimiento.tipo);
                                        const prioridadConfig = getPrioridadConfig(seguimiento.prioridad);

                                        return (
                                            <div
                                                key={seguimiento.id}
                                                className={`px-5 py-5 border-b border-[#E5E7EB] hover:bg-[#F1F5F9] cursor-pointer transition-colors ${
                                                    index % 2 === 0 ? 'bg-[#F8F9FA]' : 'bg-[#FFFFFF]'
                                                }`}
                                                onClick={() => router.visit(`/clientes/${seguimiento.cliente_id}`)}
                                            >
                                                <div className="grid grid-cols-12 gap-4 items-center">
                                                    {/* Columna Seguimiento */}
                                                    <div className="col-span-3 lg:col-span-3 flex items-center gap-3">
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                                            seguimiento.completado 
                                                                ? 'bg-[#059669]' 
                                                                : new Date(seguimiento.fecha_seguimiento) < new Date() 
                                                                ? 'bg-[#DC2626]' 
                                                                : 'bg-[#FF6B35]'
                                                        }`}>
                                                            {seguimiento.completado ? (
                                                                <CheckCircle className="h-5 w-5 text-white" />
                                                            ) : (
                                                                <Clock className="h-5 w-5 text-white" />
                                                            )}
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <h3 className="text-base font-bold text-[#333] truncate">
                                                                {seguimiento.titulo}
                                                            </h3>
                                                            {seguimiento.descripcion && (
                                                                <p className="text-sm text-[#666] truncate">
                                                                    {seguimiento.descripcion}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Columna Cliente */}
                                                    <div className="hidden lg:block lg:col-span-2">
                                                        <div className="flex items-center gap-2">
                                                            <User className="h-3 w-3 text-[#666] flex-shrink-0" />
                                                            <div>
                                                                <p className="text-sm text-[#666] truncate font-medium">
                                                                    {seguimiento.cliente.nombre} {seguimiento.cliente.apellido}
                                                                </p>
                                                                {seguimiento.cliente.empresa && (
                                                                    <div className="flex items-center gap-1 mt-1">
                                                                        <Building className="h-3 w-3 text-[#666] flex-shrink-0" />
                                                                        <p className="text-xs text-[#666] truncate">
                                                                            {seguimiento.cliente.empresa}
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Columna Fecha */}
                                                    <div className="hidden md:block md:col-span-2">
                                                        <div>
                                                            <span className={`text-sm font-medium ${
                                                                dateInfo.variant === 'overdue' ? 'text-red-600' :
                                                                dateInfo.variant === 'today' ? 'text-amber-600' :
                                                                dateInfo.variant === 'tomorrow' ? 'text-blue-600' :
                                                                'text-[#666]'
                                                            }`}>
                                                                {dateInfo.text}
                                                            </span>
                                                            <p className="text-xs text-[#666] mt-1">
                                                                {new Date(seguimiento.fecha_seguimiento).toLocaleDateString('es-ES', {
                                                                    day: 'numeric',
                                                                    month: 'short'
                                                                })}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Columna Tipo */}
                                                    <div className="col-span-2 lg:col-span-1">
                                                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-xl text-xs font-medium ${tipoConfig.bg} ${tipoConfig.color}`}>
                                                            <tipoConfig.icon className="h-3 w-3" />
                                                            {tipoConfig.label}
                                                        </div>
                                                    </div>

                                                    {/* Columna Prioridad */}
                                                    <div className="hidden lg:block lg:col-span-1">
                                                        <div className={`inline-flex items-center px-2 py-1 rounded-xl text-xs font-medium ${prioridadConfig.bg} ${prioridadConfig.color}`}>
                                                            {prioridadConfig.label}
                                                        </div>
                                                    </div>

                                                    {/* Columna Acciones */}
                                                    <div className="col-span-7 lg:col-span-3 flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                                                        <Link href={`/clientes/${seguimiento.cliente_id}`}>
                                                            <button
                                                                className="p-1 text-[#666] hover:text-[#FF6B35] transition-colors"
                                                                title="Ver cliente"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </button>
                                                        </Link>

                                                        {!seguimiento.completado && (
                                                            <button
                                                                onClick={() => handleComplete(seguimiento.id)}
                                                                className="p-1 text-[#666] hover:text-[#FF6B35] transition-colors"
                                                                title="Marcar como completado"
                                                            >
                                                                <CheckCircle className="h-4 w-4" />
                                                            </button>
                                                        )}

                                                        <button
                                                            onClick={() => handleDelete(seguimiento.id)}
                                                            className="p-1 text-[#666] hover:text-[#FF6B35] transition-colors"
                                                            title="Eliminar seguimiento"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        )}
                    </div>

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