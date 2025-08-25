import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    Calendar,
    CheckCircle,
    Clock,
    DollarSign,
    Edit,
    Eye,
    Filter,
    FolderOpen,
    Pause,
    Play,
    Rocket,
    Search,
    TrendingUp,
    Trash2,
    User,
    RotateCcw,
    ArrowUpDown,
    ChevronUp,
    ChevronDown,
    ChevronsUpDown,
    Building2,
    ListTodo,
    Target,
    Timer,
    Plus,
    Pencil,
    Building
} from 'lucide-react';
import { useState } from 'react';

type SortField = 'nombre' | 'cliente' | 'estado' | 'precio_total' | 'fecha_entrega' | 'created_at';
type SortOrder = 'asc' | 'desc';

// Types
interface Cliente {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    empresa?: string;
    created_at: string;
    updated_at: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
}

interface Propuesta {
    id: number;
    titulo: string;
    precio_total: number;
}

interface ProyectoTarea {
    id: number;
    titulo: string;
    completada: boolean;
    fecha_limite?: string;
}

interface Proyecto {
    id: number;
    propuesta_id: number;
    cliente_id: number;
    user_id: number;
    nombre: string;
    descripcion: string;
    estado: 'por_empezar' | 'en_progreso' | 'en_pausa' | 'completado';
    fecha_inicio?: string;
    fecha_entrega?: string;
    precio_total: number;
    forma_pago: string;
    notas?: string;
    created_at: string;
    updated_at: string;
    cliente: Cliente;
    user: User;
    propuesta: Propuesta;
    tareas?: ProyectoTarea[];
    // Calculated attributes
    estado_color?: string;
    estado_icono?: string;
    precio_formateado?: string;
    progreso?: number;
}

interface BreadcrumbItem {
    title: string;
    href: string;
}

interface Props {
    proyectos: {
        data: Proyecto[];
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
        cliente?: string;
        buscar?: string;
        orden?: string;
        direccion?: string;
    };
    estadisticas: {
        total: number;
        por_empezar: number;
        en_progreso: number;
        en_pausa: number;
        completados: number;
        valor_total: number;
        valor_completados: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Proyectos',
        href: '/proyectos',
    },
];

export default function Index({ proyectos, filtros, estadisticas }: Props) {
    const [activeFilters, setActiveFilters] = useState(false);
    
    const { data, setData, processing } = useForm({
        estado: filtros.estado || '',
        cliente: filtros.cliente || '',
        buscar: filtros.buscar || '',
        orden: filtros.orden || 'created_at',
        direccion: filtros.direccion || 'desc',
    });

    const [sortField, setSortField] = useState<SortField | null>(filtros?.orden as SortField || null);
    const [sortOrder, setSortOrder] = useState<SortOrder>(filtros?.direccion as SortOrder || 'asc');

    const handleFilter = () => {
        router.get('/proyectos', data, { preserveState: true });
    };

    const handleSort = (field: SortField) => {
        let newOrder: SortOrder = 'asc';

        if (sortField === field) {
            newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        }

        setSortField(field);
        setSortOrder(newOrder);

        router.get('/proyectos', {
            buscar: data.buscar,
            estado: data.estado,
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

    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
            router.delete(`/proyectos/${id}`, {
                onSuccess: () => {
                    router.reload({ only: ['proyectos'] });
                }
            });
        }
    };

    const handleCambiarEstado = (proyectoId: number, nuevoEstado: string) => {
        router.post(`/proyectos/${proyectoId}/cambiar-estado`, {
            estado: nuevoEstado
        }, {
            onSuccess: () => {
                router.reload({ only: ['proyectos'] });
            }
        });
    };

    const clearFilters = () => {
        setData({
            estado: '',
            cliente: '',
            buscar: '',
            orden: 'created_at',
            direccion: 'desc',
        });
        router.get('/proyectos', {
            estado: '',
            cliente: '',
            buscar: '',
            orden: 'created_at',
            direccion: 'desc',
        }, { preserveState: true });
    };

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return 'No definida';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    };

    const getEstadoConfig = (estado: string) => {
        const configs = {
            por_empezar: { 
                icon: Timer, 
                color: 'text-gray-700', 
                bg: 'bg-gray-100 border-gray-200', 
                label: 'Por Empezar',
                emoji: '⏳'
            },
            en_progreso: { 
                icon: Rocket, 
                color: 'text-blue-700', 
                bg: 'bg-blue-100 border-blue-200', 
                label: 'En Progreso',
                emoji: '🚀'
            },
            en_pausa: { 
                icon: Pause, 
                color: 'text-yellow-700', 
                bg: 'bg-yellow-100 border-yellow-200', 
                label: 'En Pausa',
                emoji: '⏸️'
            },
            completado: { 
                icon: CheckCircle, 
                color: 'text-green-700', 
                bg: 'bg-green-100 border-green-200', 
                label: 'Completado',
                emoji: '✅'
            }
        };
        return configs[estado as keyof typeof configs] || configs.por_empezar;
    };


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Proyectos" />

            <div className="min-h-screen bg-[#F8F9FA]">
                {/* Contenido principal */}
                <div className="mx-auto p-6">
                    {/* Tarjeta principal que contiene todo */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        {/* Header naranja DENTRO del card */}
                        <div className="bg-[#FF6B35]">
                            <div className="mx-auto px-8 py-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h1 className="text-[28px] font-bold text-white">
                                            Proyectos
                                        </h1>
                                        <p className="text-white text-base opacity-90 mt-1">
                                            Gestiona y supervisa todos tus proyectos activos
                                        </p>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        {/* Barra de búsqueda */}
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input
                                                type="text"
                                                placeholder="Buscar proyectos..."
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

                                        {/* Botón Nuevo Proyecto */}
                                        <Link href="/proyectos/create">
                                            <Button className="bg-white text-[#FF6B35] hover:bg-gray-50 hover:text-[#FF6B35] font-medium px-6 py-3 rounded-lg transition-colors cursor-pointer shadow-sm">
                                                <Plus className="mr-2 h-4 w-4" />
                                                Nuevo Proyecto
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Contenido dentro del card */}
                        <div className="p-6 space-y-8">

                            {/* Statistics Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                                <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-purple-100 text-sm font-medium">Total</p>
                                        <p className="text-3xl font-bold">{estadisticas.total}</p>
                                    </div>
                                    <FolderOpen className="h-8 w-8 text-purple-200" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-gray-500 to-gray-600 text-white shadow-lg hover:shadow-xl transition-all">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-100 text-sm font-medium">Por Empezar</p>
                                        <p className="text-3xl font-bold">{estadisticas.por_empezar}</p>
                                    </div>
                                    <Timer className="h-8 w-8 text-gray-200" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl transition-all">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-blue-100 text-sm font-medium">En Progreso</p>
                                        <p className="text-3xl font-bold">{estadisticas.en_progreso}</p>
                                    </div>
                                    <Rocket className="h-8 w-8 text-blue-200" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white shadow-lg hover:shadow-xl transition-all">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-yellow-100 text-sm font-medium">En Pausa</p>
                                        <p className="text-3xl font-bold">{estadisticas.en_pausa}</p>
                                    </div>
                                    <Pause className="h-8 w-8 text-yellow-200" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl transition-all">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-green-100 text-sm font-medium">Completados</p>
                                        <p className="text-3xl font-bold">{estadisticas.completados}</p>
                                    </div>
                                    <CheckCircle className="h-8 w-8 text-green-200" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                            {/* Value Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-emerald-100 text-sm font-medium">Valor Total</p>
                                        <p className="text-2xl font-bold">{formatPrice(estadisticas.valor_total)}</p>
                                    </div>
                                    <DollarSign className="h-8 w-8 text-emerald-200" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white shadow-lg">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-cyan-100 text-sm font-medium">Valor Completados</p>
                                        <p className="text-2xl font-bold">{formatPrice(estadisticas.valor_completados)}</p>
                                    </div>
                                    <Target className="h-8 w-8 text-cyan-200" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                            {/* Filters Panel */}
                            {activeFilters && (
                        <Card className="bg-white shadow-lg border-0">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                    <Filter className="h-5 w-5" />
                                    Filtros de Búsqueda
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="lg:col-span-2">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input
                                                placeholder="Buscar proyectos..."
                                                value={data.buscar}
                                                onChange={(e) => setData('buscar', e.target.value)}
                                                className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <Select value={data.estado} onValueChange={(value) => setData('estado', value)}>
                                        <SelectTrigger className="bg-gray-50 border-gray-200 focus:bg-white">
                                            <SelectValue placeholder="Estado" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">Todos los estados</SelectItem>
                                            <SelectItem value="por_empezar">⏳ Por Empezar</SelectItem>
                                            <SelectItem value="en_progreso">🚀 En Progreso</SelectItem>
                                            <SelectItem value="en_pausa">⏸️ En Pausa</SelectItem>
                                            <SelectItem value="completado">✅ Completado</SelectItem>
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
                                        className="bg-purple-600 hover:bg-purple-700"
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

                            {/* Tabla de proyectos */}
                            <div className="bg-gray-50 rounded-lg overflow-hidden border">
                        {proyectos.data.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="text-gray-400 mb-4">
                                    <Search className="h-16 w-16 mx-auto" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                                    No se encontraron proyectos
                                </h3>
                                <p className="text-gray-500 mb-6">
                                    {data.buscar
                                        ? 'Ajusta la búsqueda o agrega nuevos proyectos.'
                                        : 'Los proyectos se crean desde propuestas aprobadas.'
                                    }
                                </p>
                                <Link href="/propuestas">
                                    <Button className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white hover:text-white transition-colors cursor-pointer">
                                        <FolderOpen className="mr-2 h-4 w-4 text-white" />
                                        Ver Propuestas
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
                                                onClick={() => handleSort('nombre')}
                                                className="flex items-center text-[#333] font-semibold text-sm hover:text-[#FF6B35] transition-colors cursor-pointer"
                                            >
                                                PROYECTO
                                                {getSortIcon('nombre')}
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
                                        <div className="col-span-2 lg:col-span-1">
                                            <button
                                                onClick={() => handleSort('estado')}
                                                className="flex items-center text-[#333] font-semibold text-sm hover:text-[#FF6B35] transition-colors cursor-pointer"
                                            >
                                                ESTADO
                                                {getSortIcon('estado')}
                                            </button>
                                        </div>
                                        <div className="hidden md:block md:col-span-1">
                                            <button
                                                onClick={() => handleSort('precio_total')}
                                                className="flex items-center text-[#333] font-semibold text-sm hover:text-[#FF6B35] transition-colors cursor-pointer"
                                            >
                                                VALOR
                                                {getSortIcon('precio_total')}
                                            </button>
                                        </div>
                                        <div className="hidden lg:block lg:col-span-2">
                                            <button
                                                onClick={() => handleSort('fecha_entrega')}
                                                className="flex items-center text-[#333] font-semibold text-sm hover:text-[#FF6B35] transition-colors cursor-pointer"
                                            >
                                                FECHA ENTREGA
                                                {getSortIcon('fecha_entrega')}
                                            </button>
                                        </div>
                                        <div className="hidden lg:block lg:col-span-1">
                                            <button
                                                onClick={() => handleSort('created_at')}
                                                className="flex items-center text-[#333] font-semibold text-sm hover:text-[#FF6B35] transition-colors cursor-pointer"
                                            >
                                                CREACIÓN
                                                {getSortIcon('created_at')}
                                            </button>
                                        </div>
                                        <div className="col-span-7 lg:col-span-2 text-right">
                                            <span className="text-[#333] font-semibold text-sm">ACCIONES</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Filas de datos */}
                                <div>
                                    {proyectos.data.map((proyecto, index) => {
                                        const estadoConfig = getEstadoConfig(proyecto.estado);
                                        
                                        return (
                                            <div
                                                key={proyecto.id}
                                                className={`px-5 py-5 border-b border-[#E5E7EB] hover:bg-[#F1F5F9] cursor-pointer transition-colors ${
                                                    index % 2 === 0 ? 'bg-[#F8F9FA]' : 'bg-[#FFFFFF]'
                                                }`}
                                                onClick={() => router.visit(`/proyectos/${proyecto.id}`)}
                                            >
                                                <div className="grid grid-cols-12 gap-4 items-center">
                                                    {/* Columna Proyecto */}
                                                    <div className="col-span-3 lg:col-span-3 flex items-center gap-3">
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                                            proyecto.estado === 'completado' 
                                                                ? 'bg-[#059669]' 
                                                                : proyecto.estado === 'en_progreso'
                                                                ? 'bg-[#0284C7]'
                                                                : proyecto.estado === 'en_pausa'
                                                                ? 'bg-[#D97706]'
                                                                : 'bg-[#FF6B35]'
                                                        }`}>
                                                            {proyecto.estado === 'completado' ? (
                                                                <CheckCircle className="h-5 w-5 text-white" />
                                                            ) : proyecto.estado === 'en_progreso' ? (
                                                                <Rocket className="h-5 w-5 text-white" />
                                                            ) : proyecto.estado === 'en_pausa' ? (
                                                                <Pause className="h-5 w-5 text-white" />
                                                            ) : (
                                                                <FolderOpen className="h-5 w-5 text-white" />
                                                            )}
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <h3 className="text-base font-bold text-[#333] truncate">
                                                                {proyecto.nombre}
                                                            </h3>
                                                            <p className="text-sm text-[#666] truncate">
                                                                {proyecto.descripcion}
                                                            </p>
                                                            {proyecto.progreso !== undefined && (
                                                                <div className="mt-2">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                                                                            <div 
                                                                                className="bg-[#FF6B35] h-1.5 rounded-full transition-all"
                                                                                style={{ width: `${proyecto.progreso}%` }}
                                                                            ></div>
                                                                        </div>
                                                                        <span className="text-xs text-gray-500">{proyecto.progreso}%</span>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Columna Cliente */}
                                                    <div className="hidden lg:block lg:col-span-2">
                                                        <div className="flex items-center gap-2">
                                                            <User className="h-3 w-3 text-[#666] flex-shrink-0" />
                                                            <div>
                                                                <p className="text-sm text-[#666] truncate font-medium">
                                                                    {proyecto.cliente.nombre} {proyecto.cliente.apellido}
                                                                </p>
                                                                {proyecto.cliente.empresa && (
                                                                    <div className="flex items-center gap-1 mt-1">
                                                                        <Building className="h-3 w-3 text-[#666] flex-shrink-0" />
                                                                        <p className="text-xs text-[#666] truncate">
                                                                            {proyecto.cliente.empresa}
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Columna Estado */}
                                                    <div className="col-span-2 lg:col-span-1">
                                                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-xl text-xs font-medium ${
                                                            proyecto.estado === 'completado'
                                                                ? "bg-[#059669] text-white hover:bg-[#059669]"
                                                                : proyecto.estado === 'en_progreso'
                                                                ? "bg-[#0284C7] text-white hover:bg-[#0284C7]"
                                                                : proyecto.estado === 'en_pausa'
                                                                ? "bg-[#D97706] text-white hover:bg-[#D97706]"
                                                                : "bg-[#6B7280] text-white hover:bg-[#6B7280]"
                                                        }`}>
                                                            {estadoConfig.emoji} {estadoConfig.label}
                                                        </div>
                                                    </div>

                                                    {/* Columna Valor */}
                                                    <div className="hidden md:block md:col-span-1">
                                                        <span className="text-sm text-[#059669] font-bold block">
                                                            {formatPrice(proyecto.precio_total)}
                                                        </span>
                                                    </div>

                                                    {/* Columna Fecha Entrega */}
                                                    <div className="hidden lg:block lg:col-span-2">
                                                        <div>
                                                            <span className="text-[13px] text-[#666]">
                                                                {formatDate(proyecto.fecha_entrega)}
                                                            </span>
                                                            {proyecto.fecha_entrega && new Date(proyecto.fecha_entrega) < new Date() && proyecto.estado !== 'completado' && (
                                                                <div className="text-xs text-red-600 font-medium mt-1">
                                                                    ⚠️ Vencido
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Columna Creación */}
                                                    <div className="hidden lg:block lg:col-span-1">
                                                        <span className="text-[13px] text-[#666]">
                                                            {formatDate(proyecto.created_at)}
                                                        </span>
                                                    </div>

                                                    {/* Columna Acciones */}
                                                    <div className="col-span-7 lg:col-span-2 flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                                                        <Link href={`/proyectos/${proyecto.id}`}>
                                                            <button
                                                                className="p-1 text-[#666] hover:text-[#FF6B35] transition-colors"
                                                                title="Ver proyecto"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </button>
                                                        </Link>

                                                        <Link href={`/proyectos/${proyecto.id}/edit`}>
                                                            <button
                                                                className="p-1 text-[#666] hover:text-[#FF6B35] transition-colors"
                                                                title="Editar proyecto"
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </button>
                                                        </Link>

                                                        <button
                                                            onClick={() => handleDelete(proyecto.id)}
                                                            className="p-1 text-[#666] hover:text-[#FF6B35] transition-colors"
                                                            title="Eliminar proyecto"
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

                            {/* Paginación dentro del card */}
                            {proyectos.last_page > 1 && (
                                <div className="flex justify-center py-6 border-t border-gray-200">
                                    <div className="flex items-center space-x-2">
                                        {Array.from({ length: proyectos.last_page }, (_, i) => i + 1).map((page) => (
                                            <Link key={page} href={`/proyectos?page=${page}`}>
                                                <Button
                                                    variant={page === proyectos.current_page ? "default" : "ghost"}
                                                    size="sm"
                                                    className={page === proyectos.current_page ? "bg-[#FF6B35] hover:bg-[#FF6B35]/90 transition-colors cursor-pointer" : "hover:bg-gray-100 transition-colors cursor-pointer"}
                                                >
                                                    {page}
                                                </Button>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}