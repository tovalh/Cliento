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
    Copy,
    DollarSign,
    Edit,
    Eye,
    FileText,
    Filter,
    Mail,
    Pause,
    Plus,
    Search,
    Send,
    TrendingUp,
    Trash2,
    User,
    X,
    RotateCcw,
    ArrowUpDown,
    ChevronUp,
    ChevronDown,
    ChevronsUpDown,
    AlertTriangle,
    Building2,
    Pencil,
    Building
} from 'lucide-react';
import { useState } from 'react';

type SortField = 'titulo' | 'cliente' | 'estado' | 'precio_total' | 'fecha_limite_respuesta' | 'created_at';
type SortOrder = 'asc' | 'desc';

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

interface Propuesta {
    id: number;
    cliente_id: number;
    user_id: number;
    titulo: string;
    estado: 'borrador' | 'enviada' | 'aprobada' | 'rechazada' | 'negociacion';
    fecha_envio?: string;
    fecha_limite_respuesta?: string;
    descripcion_proyecto: string;
    alcance_incluye: string;
    alcance_no_incluye?: string;
    precio_total: number;
    forma_pago: string;
    tiempo_entrega: string;
    terminos_condiciones?: string;
    fecha_ultimo_followup?: string;
    proximo_recordatorio?: string;
    notas_internas?: string;
    created_at: string;
    updated_at: string;
    cliente: Cliente;
    user: User;
    // Calculated attributes
    estado_color?: string;
    estado_icono?: string;
    precio_formateado?: string;
    dias_restantes?: number;
    esta_vencida?: boolean;
}

interface Props {
    propuestas: {
        data: Propuesta[];
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
        fecha_desde?: string;
        fecha_hasta?: string;
        orden?: string;
        direccion?: string;
    };
    estadisticas: {
        total: number;
        borradores: number;
        enviadas: number;
        aprobadas: number;
        rechazadas: number;
        negociacion: number;
        proximas_vencer: number;
        vencidas: number;
        valor_total_aprobadas: number;
        valor_total_enviadas: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Propuestas',
        href: '/propuestas',
    },
];

export default function Index({ propuestas, filtros, estadisticas }: Props) {
    const [activeFilters, setActiveFilters] = useState(false);
    
    const { data, setData, processing } = useForm({
        estado: filtros.estado || '',
        cliente: filtros.cliente || '',
        buscar: filtros.buscar || '',
        fecha_desde: filtros.fecha_desde || '',
        fecha_hasta: filtros.fecha_hasta || '',
        orden: filtros.orden || 'created_at',
        direccion: filtros.direccion || 'desc',
    });

    const [sortField, setSortField] = useState<SortField | null>(filtros?.orden as SortField || null);
    const [sortOrder, setSortOrder] = useState<SortOrder>(filtros?.direccion as SortOrder || 'asc');

    const handleFilter = () => {
        router.get('/propuestas', data, { preserveState: true });
    };

    const handleSort = (field: SortField) => {
        let newOrder: SortOrder = 'asc';

        if (sortField === field) {
            newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        }

        setSortField(field);
        setSortOrder(newOrder);

        router.get('/propuestas', {
            buscar: data.buscar,
            estado: data.estado,
            cliente: data.cliente,
            fecha_desde: data.fecha_desde,
            fecha_hasta: data.fecha_hasta,
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
        if (confirm('¿Estás seguro de que quieres eliminar esta propuesta?')) {
            router.delete(`/propuestas/${id}`, {
                onSuccess: () => {
                    router.reload({ only: ['propuestas'] });
                }
            });
        }
    };

    const handleCambiarEstado = (propuestaId: number, nuevoEstado: string) => {
        router.post(`/propuestas/${propuestaId}/cambiar-estado`, {
            estado: nuevoEstado
        }, {
            onSuccess: () => {
                router.reload({ only: ['propuestas'] });
            }
        });
    };

    const handleDuplicar = (propuestaId: number) => {
        router.post(`/propuestas/${propuestaId}/duplicar`);
    };

    const clearFilters = () => {
        setData({
            estado: '',
            cliente: '',
            buscar: '',
            fecha_desde: '',
            fecha_hasta: '',
            orden: 'created_at',
            direccion: 'desc',
        });
        router.get('/propuestas', {
            estado: '',
            cliente: '',
            buscar: '',
            fecha_desde: '',
            fecha_hasta: '',
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
            borrador: { 
                icon: FileText, 
                color: 'text-gray-700', 
                bg: 'bg-gray-100 border-gray-200', 
                label: 'Borrador',
                emoji: '🟡'
            },
            enviada: { 
                icon: Send, 
                color: 'text-blue-700', 
                bg: 'bg-blue-100 border-blue-200', 
                label: 'Enviada',
                emoji: '🔵'
            },
            aprobada: { 
                icon: CheckCircle, 
                color: 'text-green-700', 
                bg: 'bg-green-100 border-green-200', 
                label: 'Aprobada',
                emoji: '🟢'
            },
            rechazada: { 
                icon: X, 
                color: 'text-red-700', 
                bg: 'bg-red-100 border-red-200', 
                label: 'Rechazada',
                emoji: '❌'
            },
            negociacion: { 
                icon: Pause, 
                color: 'text-yellow-700', 
                bg: 'bg-yellow-100 border-yellow-200', 
                label: 'En Negociación',
                emoji: '⏸️'
            }
        };
        return configs[estado as keyof typeof configs] || configs.borrador;
    };


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Propuestas" />

            <div className="min-h-screen bg-[#F8F9FA]">
                {/* Header naranja */}
                <div className="bg-[#FF6B35]">
                    <div className="mx-auto px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-[28px] font-bold text-white">
                                    Propuestas
                                </h1>
                                <p className="text-white text-base opacity-90 mt-1">
                                    Gestiona y organiza todas tus propuestas comerciales
                                </p>
                            </div>

                            <div className="flex items-center space-x-4">
                                {/* Barra de búsqueda */}
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        type="text"
                                        placeholder="Buscar propuestas..."
                                        value={data.buscar}
                                        onChange={(e) => setData('buscar', e.target.value)}
                                        onBlur={() => {
                                            router.get('/propuestas', {
                                                buscar: data.buscar,
                                                estado: data.estado,
                                                cliente: data.cliente,
                                                fecha_desde: data.fecha_desde,
                                                fecha_hasta: data.fecha_hasta,
                                                orden: data.orden,
                                                direccion: data.direccion,
                                            }, {
                                                preserveState: true,
                                                preserveScroll: true
                                            });
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleFilter();
                                            }
                                        }}
                                        className="pl-10 w-[300px] bg-white border-0"
                                    />
                                </div>

                                <Button
                                    variant="outline"
                                    onClick={() => setActiveFilters(!activeFilters)}
                                    className="bg-white text-[#FF6B35] hover:bg-gray-50 hover:text-[#FF6B35] font-medium px-6 py-3 rounded-lg transition-colors cursor-pointer shadow-sm"
                                >
                                    <Filter className="mr-2 h-4 w-4" />
                                    Filtros
                                </Button>

                                {/* Botón Nueva Propuesta */}
                                <Link href="/propuestas/create">
                                    <Button className="bg-white text-[#FF6B35] hover:bg-gray-50 hover:text-[#FF6B35] font-medium px-6 py-3 rounded-lg transition-colors cursor-pointer shadow-sm">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Nueva Propuesta
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contenido principal */}
                <div className="mx-auto p-6 space-y-8">

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
                        <Card className="bg-card border shadow-lg hover:shadow-xl transition-all">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-muted-foreground text-sm font-medium">Total</p>
                                        <p className="text-3xl font-bold text-primary">{estadisticas.total}</p>
                                    </div>
                                    <TrendingUp className="h-8 w-8 text-primary" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-card border shadow-lg hover:shadow-xl transition-all">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-muted-foreground text-sm font-medium">Borradores</p>
                                        <p className="text-3xl font-bold text-muted-foreground">{estadisticas.borradores}</p>
                                    </div>
                                    <FileText className="h-8 w-8 text-muted-foreground" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-card border shadow-lg hover:shadow-xl transition-all">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-muted-foreground text-sm font-medium">Enviadas</p>
                                        <p className="text-3xl font-bold text-info">{estadisticas.enviadas}</p>
                                    </div>
                                    <Send className="h-8 w-8 text-info" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-card border shadow-lg hover:shadow-xl transition-all">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-muted-foreground text-sm font-medium">Aprobadas</p>
                                        <p className="text-3xl font-bold text-success">{estadisticas.aprobadas}</p>
                                    </div>
                                    <CheckCircle className="h-8 w-8 text-success" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-card border shadow-lg hover:shadow-xl transition-all">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-muted-foreground text-sm font-medium">Negociación</p>
                                        <p className="text-3xl font-bold text-warning">{estadisticas.negociacion}</p>
                                    </div>
                                    <Pause className="h-8 w-8 text-warning" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-card border shadow-lg hover:shadow-xl transition-all">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-muted-foreground text-sm font-medium">Vencidas</p>
                                        <p className="text-3xl font-bold text-destructive">{estadisticas.vencidas}</p>
                                    </div>
                                    <AlertTriangle className="h-8 w-8 text-destructive" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Value Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="bg-card border shadow-lg">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-muted-foreground text-sm font-medium">Valor Aprobadas</p>
                                        <p className="text-2xl font-bold text-success">{formatPrice(estadisticas.valor_total_aprobadas)}</p>
                                    </div>
                                    <DollarSign className="h-8 w-8 text-success" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-card border shadow-lg">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-muted-foreground text-sm font-medium">Valor Enviadas</p>
                                        <p className="text-2xl font-bold text-info">{formatPrice(estadisticas.valor_total_enviadas)}</p>
                                    </div>
                                    <DollarSign className="h-8 w-8 text-info" />
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
                                                placeholder="Buscar propuestas..."
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
                                            <SelectItem value="borrador">🟡 Borrador</SelectItem>
                                            <SelectItem value="enviada">🔵 Enviada</SelectItem>
                                            <SelectItem value="aprobada">🟢 Aprobada</SelectItem>
                                            <SelectItem value="rechazada">❌ Rechazada</SelectItem>
                                            <SelectItem value="negociacion">⏸️ En Negociación</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <Input
                                        placeholder="Cliente..."
                                        value={data.cliente}
                                        onChange={(e) => setData('cliente', e.target.value)}
                                        className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                    />

                                    <Input
                                        type="date"
                                        placeholder="Desde..."
                                        value={data.fecha_desde}
                                        onChange={(e) => setData('fecha_desde', e.target.value)}
                                        className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                    />

                                    <Input
                                        type="date"
                                        placeholder="Hasta..."
                                        value={data.fecha_hasta}
                                        onChange={(e) => setData('fecha_hasta', e.target.value)}
                                        className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                    />
                                </div>

                                <div className="flex items-center gap-3 pt-2">
                                    <Button 
                                        onClick={handleFilter} 
                                        disabled={processing}
                                        className="bg-primary hover:bg-primary/90"
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

                    {/* Tabla de propuestas */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        {propuestas.data.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="text-gray-400 mb-4">
                                    <Search className="h-16 w-16 mx-auto" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                                    No se encontraron propuestas
                                </h3>
                                <p className="text-gray-500 mb-6">
                                    {data.buscar
                                        ? 'Ajusta la búsqueda o agrega nuevas propuestas.'
                                        : 'Comienza agregando tu primera propuesta.'
                                    }
                                </p>
                                <Link href="/propuestas/create">
                                    <Button className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white hover:text-white transition-colors cursor-pointer">
                                        <Plus className="mr-2 h-4 w-4 text-white" />
                                        Crear primera propuesta
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
                                                PROPUESTA
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
                                                onClick={() => handleSort('fecha_limite_respuesta')}
                                                className="flex items-center text-[#333] font-semibold text-sm hover:text-[#FF6B35] transition-colors cursor-pointer"
                                            >
                                                FECHA LÍMITE
                                                {getSortIcon('fecha_limite_respuesta')}
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
                                    {propuestas.data.map((propuesta, index) => {
                                        const estadoConfig = getEstadoConfig(propuesta.estado);
                                        
                                        return (
                                            <div
                                                key={propuesta.id}
                                                className={`px-5 py-5 border-b border-[#E5E7EB] hover:bg-[#F1F5F9] cursor-pointer transition-colors ${
                                                    index % 2 === 0 ? 'bg-[#F8F9FA]' : 'bg-[#FFFFFF]'
                                                }`}
                                                onClick={() => router.visit(`/propuestas/${propuesta.id}`)}
                                            >
                                                <div className="grid grid-cols-12 gap-4 items-center">
                                                    {/* Columna Propuesta */}
                                                    <div className="col-span-3 lg:col-span-3 flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-[#FF6B35] rounded-full flex items-center justify-center flex-shrink-0">
                                                            <FileText className="h-5 w-5 text-white" />
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <h3 className="text-base font-bold text-[#333] truncate">
                                                                {propuesta.titulo}
                                                            </h3>
                                                            <p className="text-sm text-[#666] truncate">
                                                                {propuesta.descripcion_proyecto}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Columna Cliente */}
                                                    <div className="hidden lg:block lg:col-span-2">
                                                        <div className="flex items-center gap-2">
                                                            <User className="h-3 w-3 text-[#666] flex-shrink-0" />
                                                            <div>
                                                                <p className="text-sm text-[#666] truncate font-medium">
                                                                    {propuesta.cliente.nombre} {propuesta.cliente.apellido}
                                                                </p>
                                                                {propuesta.cliente.empresa && (
                                                                    <div className="flex items-center gap-1 mt-1">
                                                                        <Building className="h-3 w-3 text-[#666] flex-shrink-0" />
                                                                        <p className="text-xs text-[#666] truncate">
                                                                            {propuesta.cliente.empresa}
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Columna Estado */}
                                                    <div className="col-span-2 lg:col-span-1">
                                                        <Badge
                                                            className={`rounded-xl px-3 py-1 text-xs font-medium ${
                                                                propuesta.estado === 'aprobada'
                                                                    ? "bg-[#059669] text-white hover:bg-[#059669]"
                                                                    : propuesta.estado === 'enviada'
                                                                    ? "bg-[#0284C7] text-white hover:bg-[#0284C7]"
                                                                    : propuesta.estado === 'rechazada'
                                                                    ? "bg-[#DC2626] text-white hover:bg-[#DC2626]"
                                                                    : propuesta.estado === 'negociacion'
                                                                    ? "bg-[#D97706] text-white hover:bg-[#D97706]"
                                                                    : "bg-[#6B7280] text-white hover:bg-[#6B7280]"
                                                            }`}
                                                        >
                                                            {estadoConfig.emoji} {estadoConfig.label}
                                                        </Badge>
                                                    </div>

                                                    {/* Columna Valor */}
                                                    <div className="hidden md:block md:col-span-1">
                                                        <span className="text-sm text-[#059669] font-bold block">
                                                            {formatPrice(propuesta.precio_total)}
                                                        </span>
                                                    </div>

                                                    {/* Columna Fecha Límite */}
                                                    <div className="hidden lg:block lg:col-span-2">
                                                        <div>
                                                            <span className="text-[13px] text-[#666]">
                                                                {formatDate(propuesta.fecha_limite_respuesta)}
                                                            </span>
                                                            {propuesta.fecha_limite_respuesta && new Date(propuesta.fecha_limite_respuesta) < new Date() && propuesta.estado === 'enviada' && (
                                                                <div className="text-xs text-red-600 font-medium mt-1">
                                                                    ⚠️ Vencida
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Columna Creación */}
                                                    <div className="hidden lg:block lg:col-span-1">
                                                        <span className="text-[13px] text-[#666]">
                                                            {formatDate(propuesta.created_at)}
                                                        </span>
                                                    </div>

                                                    {/* Columna Acciones */}
                                                    <div className="col-span-7 lg:col-span-2 flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                                                        <Link href={`/propuestas/${propuesta.id}`}>
                                                            <button
                                                                className="p-1 text-[#666] hover:text-[#FF6B35] transition-colors"
                                                                title="Ver propuesta"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </button>
                                                        </Link>

                                                        <Link href={`/propuestas/${propuesta.id}/edit`}>
                                                            <button
                                                                className="p-1 text-[#666] hover:text-[#FF6B35] transition-colors"
                                                                title="Editar propuesta"
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </button>
                                                        </Link>

                                                        <button
                                                            onClick={() => handleDuplicar(propuesta.id)}
                                                            className="p-1 text-[#666] hover:text-[#FF6B35] transition-colors"
                                                            title="Duplicar propuesta"
                                                        >
                                                            <Copy className="h-4 w-4" />
                                                        </button>

                                                        <button
                                                            onClick={() => handleDelete(propuesta.id)}
                                                            className="p-1 text-[#666] hover:text-[#FF6B35] transition-colors"
                                                            title="Eliminar propuesta"
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
                    {propuestas.last_page > 1 && (
                        <div className="flex justify-center">
                            <div className="flex items-center gap-2 bg-white rounded-lg shadow-md p-2">
                                {propuestas.links.map((link, index) => (
                                    <Button
                                        key={index}
                                        variant={link.active ? "default" : "ghost"}
                                        size="sm"
                                        onClick={() => link.url && router.visit(link.url)}
                                        disabled={!link.url}
                                        className={link.active ? "bg-primary hover:bg-primary/90" : ""}
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