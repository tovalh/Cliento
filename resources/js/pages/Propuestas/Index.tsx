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
    AlertTriangle,
    Building2
} from 'lucide-react';
import { useState } from 'react';

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

    const handleFilter = () => {
        router.get('/propuestas', data, { preserveState: true });
    };

    const handleSort = (campo: string) => {
        const newDirection = data.orden === campo && data.direccion === 'asc' ? 'desc' : 'asc';
        setData({
            ...data,
            orden: campo,
            direccion: newDirection
        });
        router.get('/propuestas', { ...data, orden: campo, direccion: newDirection }, { 
            preserveState: true
        });
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
            <Head title="Propuestas" />
            
            <div className="min-h-screen bg-background p-8">
                <div className="mx-auto max-w-7xl space-y-8">
                    {/* Header Section */}
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                                Propuestas Comerciales
                            </h1>
                            <p className="text-lg text-gray-600">
                                Gestiona y organiza todas tus propuestas de negocio
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <Button
                                variant="outline"
                                onClick={() => setActiveFilters(!activeFilters)}
                                className="bg-white shadow-sm hover:shadow-md transition-all"
                            >
                                <Filter className="mr-2 h-4 w-4" />
                                Filtros
                            </Button>
                            <Link href="/propuestas/create">
                                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Nueva Propuesta
                                </Button>
                            </Link>
                        </div>
                    </div>

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

                    {/* Main Content */}
                    <Card className="bg-card border shadow-lg overflow-hidden">
                        <CardHeader className="bg-gray-50 border-b border-gray-200">
                            <div className="grid grid-cols-12 gap-4 items-center text-sm font-semibold text-gray-600">
                                <div className="col-span-3">
                                    <SortButton campo="titulo">PROPUESTA</SortButton>
                                </div>
                                <div className="col-span-2">
                                    <SortButton campo="cliente">CLIENTE</SortButton>
                                </div>
                                <div className="col-span-1">
                                    <SortButton campo="estado">ESTADO</SortButton>
                                </div>
                                <div className="col-span-1">
                                    <SortButton campo="precio_total">VALOR</SortButton>
                                </div>
                                <div className="col-span-2">
                                    <SortButton campo="fecha_limite_respuesta">FECHA LÍMITE</SortButton>
                                </div>
                                <div className="col-span-1">
                                    <SortButton campo="created_at">CREACIÓN</SortButton>
                                </div>
                                <div className="col-span-2 text-center">ACCIONES</div>
                            </div>
                        </CardHeader>

                        <CardContent className="p-0">
                            {propuestas.data.length === 0 ? (
                                <div className="text-center py-16">
                                    <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                                        No se encontraron propuestas
                                    </h3>
                                    <p className="text-gray-500 mb-4">
                                        Ajusta los filtros o crea tu primera propuesta comercial.
                                    </p>
                                    <Link href="/propuestas/create">
                                        <Button>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Crear Primera Propuesta
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100">
                                    {propuestas.data.map((propuesta) => {
                                        const estadoConfig = getEstadoConfig(propuesta.estado);
                                        
                                        return (
                                            <div 
                                                key={propuesta.id} 
                                                className="p-6 hover:bg-gray-50 transition-all duration-200"
                                            >
                                                <div className="grid grid-cols-12 gap-4 items-center">
                                                    <div className="col-span-3">
                                                        <h3 className="font-semibold text-gray-900 mb-1">
                                                            {propuesta.titulo}
                                                        </h3>
                                                        <p className="text-sm text-gray-600 line-clamp-2">
                                                            {propuesta.descripcion_proyecto}
                                                        </p>
                                                    </div>

                                                    <div className="col-span-2">
                                                        <div className="flex items-center gap-2">
                                                            <User className="h-4 w-4 text-gray-400" />
                                                            <span className="font-medium text-gray-900">
                                                                {propuesta.cliente.nombre} {propuesta.cliente.apellido}
                                                            </span>
                                                        </div>
                                                        {propuesta.cliente.empresa && (
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <Building2 className="h-3 w-3 text-gray-400" />
                                                                <p className="text-sm text-gray-500">
                                                                    {propuesta.cliente.empresa}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="col-span-1">
                                                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${estadoConfig.bg}`}>
                                                            <span className="text-sm">
                                                                {estadoConfig.emoji}
                                                            </span>
                                                            <span className={`text-xs font-medium ${estadoConfig.color}`}>
                                                                {estadoConfig.label}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="col-span-1">
                                                        <p className="font-bold text-green-600">
                                                            {formatPrice(propuesta.precio_total)}
                                                        </p>
                                                    </div>

                                                    <div className="col-span-2">
                                                        <div className="space-y-1">
                                                            <p className="text-sm font-medium text-gray-700">
                                                                {formatDate(propuesta.fecha_limite_respuesta)}
                                                            </p>
                                                            {propuesta.fecha_limite_respuesta && new Date(propuesta.fecha_limite_respuesta) < new Date() && propuesta.estado === 'enviada' && (
                                                                <span className="text-xs text-red-600 font-medium">
                                                                    ⚠️ Vencida
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="col-span-1">
                                                        <p className="text-sm text-gray-500">
                                                            {formatDate(propuesta.created_at)}
                                                        </p>
                                                    </div>

                                                    <div className="col-span-2 flex justify-center gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => router.visit(`/propuestas/${propuesta.id}`)}
                                                            className="h-8 w-8 p-0 border-gray-300 hover:bg-indigo-50 hover:border-indigo-300"
                                                            title="Ver propuesta"
                                                        >
                                                            <Eye className="h-3 w-3" />
                                                        </Button>
                                                        
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => router.visit(`/propuestas/${propuesta.id}/edit`)}
                                                            className="h-8 w-8 p-0 border-gray-300 hover:bg-blue-50 hover:border-blue-300"
                                                            title="Editar propuesta"
                                                        >
                                                            <Edit className="h-3 w-3" />
                                                        </Button>

                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleDuplicar(propuesta.id)}
                                                            className="h-8 w-8 p-0 border-gray-300 hover:bg-green-50 hover:border-green-300"
                                                            title="Duplicar propuesta"
                                                        >
                                                            <Copy className="h-3 w-3" />
                                                        </Button>
                                                        
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleDelete(propuesta.id)}
                                                            className="h-8 w-8 p-0 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
                                                            title="Eliminar propuesta"
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