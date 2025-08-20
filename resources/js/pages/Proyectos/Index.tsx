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
    Building2,
    ListTodo,
    Target,
    Timer
} from 'lucide-react';
import { useState } from 'react';

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

    const handleFilter = () => {
        router.get('/proyectos', data, { preserveState: true });
    };

    const handleSort = (campo: string) => {
        const newDirection = data.orden === campo && data.direccion === 'asc' ? 'desc' : 'asc';
        setData({
            ...data,
            orden: campo,
            direccion: newDirection
        });
        router.get('/proyectos', { ...data, orden: campo, direccion: newDirection }, { 
            preserveState: true
        });
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
            <Head title="Proyectos" />
            
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50/30 p-8">
                <div className="mx-auto max-w-7xl space-y-8">
                    {/* Header Section */}
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                                Proyectos
                            </h1>
                            <p className="text-lg text-gray-600">
                                Gestiona y supervisa todos tus proyectos activos
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
                        </div>
                    </div>

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

                    {/* Main Content */}
                    <Card className="bg-white shadow-lg border-0 overflow-hidden">
                        <CardHeader className="bg-gray-50 border-b border-gray-200">
                            <div className="grid grid-cols-12 gap-4 items-center text-sm font-semibold text-gray-600">
                                <div className="col-span-3">
                                    <SortButton campo="nombre">PROYECTO</SortButton>
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
                                    <SortButton campo="fecha_entrega">FECHA ENTREGA</SortButton>
                                </div>
                                <div className="col-span-1">
                                    <SortButton campo="created_at">CREACIÓN</SortButton>
                                </div>
                                <div className="col-span-2 text-center">ACCIONES</div>
                            </div>
                        </CardHeader>

                        <CardContent className="p-0">
                            {proyectos.data.length === 0 ? (
                                <div className="text-center py-16">
                                    <FolderOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                                        No se encontraron proyectos
                                    </h3>
                                    <p className="text-gray-500 mb-4">
                                        Los proyectos se crean automáticamente desde propuestas aprobadas.
                                    </p>
                                    <Link href="/propuestas">
                                        <Button>
                                            Ver Propuestas
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100">
                                    {proyectos.data.map((proyecto) => {
                                        const estadoConfig = getEstadoConfig(proyecto.estado);
                                        
                                        return (
                                            <div 
                                                key={proyecto.id} 
                                                className="p-6 hover:bg-gray-50 transition-all duration-200"
                                            >
                                                <div className="grid grid-cols-12 gap-4 items-center">
                                                    <div className="col-span-3">
                                                        <h3 className="font-semibold text-gray-900 mb-1">
                                                            {proyecto.nombre}
                                                        </h3>
                                                        <p className="text-sm text-gray-600 line-clamp-2">
                                                            {proyecto.descripcion}
                                                        </p>
                                                        {proyecto.progreso !== undefined && (
                                                            <div className="mt-2">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                                        <div 
                                                                            className="bg-blue-600 h-2 rounded-full transition-all"
                                                                            style={{ width: `${proyecto.progreso}%` }}
                                                                        ></div>
                                                                    </div>
                                                                    <span className="text-xs text-gray-500">{proyecto.progreso}%</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="col-span-2">
                                                        <div className="flex items-center gap-2">
                                                            <User className="h-4 w-4 text-gray-400" />
                                                            <span className="font-medium text-gray-900">
                                                                {proyecto.cliente.nombre} {proyecto.cliente.apellido}
                                                            </span>
                                                        </div>
                                                        {proyecto.cliente.empresa && (
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <Building2 className="h-3 w-3 text-gray-400" />
                                                                <p className="text-sm text-gray-500">
                                                                    {proyecto.cliente.empresa}
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
                                                            {formatPrice(proyecto.precio_total)}
                                                        </p>
                                                    </div>

                                                    <div className="col-span-2">
                                                        <div className="space-y-1">
                                                            <p className="text-sm font-medium text-gray-700">
                                                                {formatDate(proyecto.fecha_entrega)}
                                                            </p>
                                                            {proyecto.fecha_entrega && new Date(proyecto.fecha_entrega) < new Date() && proyecto.estado !== 'completado' && (
                                                                <span className="text-xs text-red-600 font-medium">
                                                                    ⚠️ Vencido
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="col-span-1">
                                                        <p className="text-sm text-gray-500">
                                                            {formatDate(proyecto.created_at)}
                                                        </p>
                                                    </div>

                                                    <div className="col-span-2 flex justify-center gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => router.visit(`/proyectos/${proyecto.id}`)}
                                                            className="h-8 w-8 p-0 border-gray-300 hover:bg-purple-50 hover:border-purple-300"
                                                            title="Ver proyecto"
                                                        >
                                                            <Eye className="h-3 w-3" />
                                                        </Button>
                                                        
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => router.visit(`/proyectos/${proyecto.id}/edit`)}
                                                            className="h-8 w-8 p-0 border-gray-300 hover:bg-blue-50 hover:border-blue-300"
                                                            title="Editar proyecto"
                                                        >
                                                            <Edit className="h-3 w-3" />
                                                        </Button>
                                                        
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleDelete(proyecto.id)}
                                                            className="h-8 w-8 p-0 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
                                                            title="Eliminar proyecto"
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
                    {proyectos.last_page > 1 && (
                        <div className="flex justify-center">
                            <div className="flex items-center gap-2 bg-white rounded-lg shadow-md p-2">
                                {proyectos.links.map((link, index) => (
                                    <Button
                                        key={index}
                                        variant={link.active ? "default" : "ghost"}
                                        size="sm"
                                        onClick={() => link.url && router.visit(link.url)}
                                        disabled={!link.url}
                                        className={link.active ? "bg-purple-600 hover:bg-purple-700" : ""}
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