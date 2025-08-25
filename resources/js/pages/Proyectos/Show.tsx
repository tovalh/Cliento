import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Building2,
    Calendar,
    CheckCircle,
    Clock,
    DollarSign,
    Edit,
    FileText,
    ListTodo,
    Mail,
    MapPin,
    Pause,
    Phone,
    Play,
    Plus,
    Rocket,
    Timer,
    Trash2,
    User,
    X,
    Target,
    AlertCircle,
    Sparkles
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
    descripcion_proyecto: string;
    alcance_incluye: string;
    forma_pago: string;
    tiempo_entrega: string;
}

interface ProyectoTarea {
    id: number;
    proyecto_id: number;
    user_id: number;
    titulo: string;
    descripcion?: string;
    completada: boolean;
    fecha_limite?: string;
    orden: number;
    completada_en?: string;
    created_at: string;
    updated_at: string;
    user: User;
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
    tareas: ProyectoTarea[];
    // Calculated attributes
    progreso?: number;
}

interface BreadcrumbItem {
    title: string;
    href: string;
}

interface Props {
    proyecto: Proyecto;
}

export default function Show({ proyecto }: Props) {
    const [showNewTaskForm, setShowNewTaskForm] = useState(false);
    const [editingTask, setEditingTask] = useState<number | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Proyectos',
            href: '/proyectos',
        },
        {
            title: proyecto.nombre,
            href: `/proyectos/${proyecto.id}`,
        },
    ];

    const { data: newTaskData, setData: setNewTaskData, post: postNewTask, processing: processingNewTask, reset: resetNewTask } = useForm({
        titulo: '',
        descripcion: '',
        fecha_limite: '',
    });

    const { data: taskEditData, setData: setTaskEditData, put: putTask, processing: processingTaskEdit } = useForm({
        titulo: '',
        descripcion: '',
        fecha_limite: '',
        completada: false,
    });

    const { data: statusData, setData: setStatusData } = useForm({
        estado: proyecto.estado,
    });

    const handleCreateTask = (e: React.FormEvent) => {
        e.preventDefault();
        postNewTask(`/proyectos/${proyecto.id}/tareas`, {
            onSuccess: () => {
                resetNewTask();
                setShowNewTaskForm(false);
                router.reload({ only: ['proyecto'] });
            }
        });
    };

    const handleToggleTask = (tarea: ProyectoTarea) => {
        router.put(`/tareas/${tarea.id}`, {
            ...tarea,
            completada: !tarea.completada
        }, {
            onSuccess: () => {
                router.reload({ only: ['proyecto'] });
            }
        });
    };

    const handleEditTask = (tarea: ProyectoTarea) => {
        setTaskEditData({
            titulo: tarea.titulo,
            descripcion: tarea.descripcion || '',
            fecha_limite: tarea.fecha_limite || '',
            completada: tarea.completada,
        });
        setEditingTask(tarea.id);
    };

    const handleUpdateTask = (tareaId: number) => {
        putTask(`/tareas/${tareaId}`, {
            onSuccess: () => {
                setEditingTask(null);
                router.reload({ only: ['proyecto'] });
            }
        });
    };

    const handleDeleteTask = (tareaId: number) => {
        if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
            router.delete(`/tareas/${tareaId}`, {
                onSuccess: () => {
                    router.reload({ only: ['proyecto'] });
                }
            });
        }
    };

    const handleChangeStatus = (nuevoEstado: string) => {
        router.post(`/proyectos/${proyecto.id}/cambiar-estado`, {
            estado: nuevoEstado
        }, {
            onSuccess: () => {
                router.reload({ only: ['proyecto'] });
            }
        });
    };

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return 'No definida';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    };

    const handleExportPDF = () => {
        window.open(`/proyectos/${proyecto.id}/export-pdf`, '_blank');
    };

    const getEstadoConfig = (estado: string) => {
        const configs = {
            por_empezar: { 
                icon: Timer, 
                color: 'text-gray-700', 
                bg: 'bg-gray-100 border-gray-200 text-gray-700', 
                label: 'Por Empezar',
                emoji: '⏳'
            },
            en_progreso: { 
                icon: Rocket, 
                color: 'text-blue-700', 
                bg: 'bg-blue-100 border-blue-200 text-blue-700', 
                label: 'En Progreso',
                emoji: '🚀'
            },
            en_pausa: { 
                icon: Pause, 
                color: 'text-yellow-700', 
                bg: 'bg-yellow-100 border-yellow-200 text-yellow-700', 
                label: 'En Pausa',
                emoji: '⏸️'
            },
            completado: { 
                icon: CheckCircle, 
                color: 'text-green-700', 
                bg: 'bg-green-100 border-green-200 text-green-700', 
                label: 'Completado',
                emoji: '✅'
            }
        };
        return configs[estado as keyof typeof configs] || configs.por_empezar;
    };

    const estadoConfig = getEstadoConfig(proyecto.estado);
    const tareasCompletadas = proyecto.tareas.filter(t => t.completada).length;
    const totalTareas = proyecto.tareas.length;
    const progreso = totalTareas > 0 ? Math.round((tareasCompletadas / totalTareas) * 100) : 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Proyecto: ${proyecto.nombre}`} />
            
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
                                        <div className="flex items-center gap-4">
                                            <h1 className="text-[28px] font-bold text-white">
                                                {proyecto.nombre}
                                            </h1>
                                            <Badge className={`px-3 py-1 text-sm font-medium border ${estadoConfig.bg} bg-white`}>
                                                {estadoConfig.emoji} {estadoConfig.label}
                                            </Badge>
                                        </div>
                                        <p className="text-white text-base opacity-90 mt-1">
                                            Proyecto #{proyecto.id}
                                        </p>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        {/* Botón Volver */}
                                        <Link href="/proyectos">
                                            <Button className="bg-white text-[#FF6B35] hover:bg-gray-50 hover:text-[#FF6B35] font-medium px-6 py-3 rounded-lg transition-colors cursor-pointer shadow-sm">
                                                <ArrowLeft className="mr-2 h-4 w-4" />
                                                Volver a Proyectos
                                            </Button>
                                        </Link>

                                        {/* Botón PDF Mágico */}
                                        <Button 
                                            onClick={handleExportPDF}
                                            className="cursor-pointer rounded-lg bg-purple-600 px-6 py-3 font-medium text-white shadow-sm transition-colors hover:bg-purple-700"
                                        >
                                            <Sparkles className="mr-2 h-4 w-4" />
                                            PDF Mágico
                                        </Button>

                                        {/* Botón Editar */}
                                        <Link href={`/proyectos/${proyecto.id}/edit`}>
                                            <Button className="bg-blue-600 text-white hover:bg-blue-700 font-medium px-6 py-3 rounded-lg transition-colors cursor-pointer shadow-sm">
                                                <Edit className="mr-2 h-4 w-4" />
                                                Editar
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Contenido dentro del card */}
                        <div className="p-8">

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Main Content */}
                                <div className="lg:col-span-2 space-y-6">
                            {/* Project Overview */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="h-5 w-5" />
                                        Información del Proyecto
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label className="text-sm font-medium text-gray-600">Descripción</Label>
                                        <p className="mt-1 text-gray-900">{proyecto.descripcion}</p>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-sm font-medium text-gray-600">Fecha Inicio</Label>
                                            <p className="mt-1 text-gray-900">{formatDate(proyecto.fecha_inicio)}</p>
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium text-gray-600">Fecha Entrega</Label>
                                            <p className="mt-1 text-gray-900">{formatDate(proyecto.fecha_entrega)}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-sm font-medium text-gray-600">Valor Total</Label>
                                            <p className="mt-1 text-xl font-bold text-green-600">{formatPrice(proyecto.precio_total)}</p>
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium text-gray-600">Forma de Pago</Label>
                                            <p className="mt-1 text-gray-900">{proyecto.forma_pago}</p>
                                        </div>
                                    </div>

                                    {proyecto.notas && (
                                        <div>
                                            <Label className="text-sm font-medium text-gray-600">Notas</Label>
                                            <p className="mt-1 text-gray-900 whitespace-pre-wrap">{proyecto.notas}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Tasks Management */}
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="flex items-center gap-2">
                                            <ListTodo className="h-5 w-5" />
                                            Tareas del Proyecto
                                            <Badge variant="secondary">{tareasCompletadas}/{totalTareas}</Badge>
                                        </CardTitle>
                                        <Button 
                                            onClick={() => setShowNewTaskForm(true)}
                                            className="bg-purple-600 hover:bg-purple-700"
                                        >
                                            <Plus className="mr-2 h-4 w-4" />
                                            Nueva Tarea
                                        </Button>
                                    </div>
                                    {totalTareas > 0 && (
                                        <div className="mt-4">
                                            <div className="flex items-center justify-between text-sm mb-2">
                                                <span>Progreso</span>
                                                <span>{progreso}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div 
                                                    className="bg-purple-600 h-2 rounded-full transition-all"
                                                    style={{ width: `${progreso}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}
                                </CardHeader>
                                <CardContent>
                                    {/* New Task Form */}
                                    {showNewTaskForm && (
                                        <form onSubmit={handleCreateTask} className="bg-gray-50 p-4 rounded-lg mb-4 space-y-4">
                                            <h4 className="font-medium">Nueva Tarea</h4>
                                            <div>
                                                <Label htmlFor="titulo">Título *</Label>
                                                <Input
                                                    id="titulo"
                                                    value={newTaskData.titulo}
                                                    onChange={(e) => setNewTaskData('titulo', e.target.value)}
                                                    placeholder="Título de la tarea"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="descripcion">Descripción</Label>
                                                <Textarea
                                                    id="descripcion"
                                                    value={newTaskData.descripcion}
                                                    onChange={(e) => setNewTaskData('descripcion', e.target.value)}
                                                    placeholder="Descripción opcional"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="fecha_limite">Fecha Límite</Label>
                                                <Input
                                                    id="fecha_limite"
                                                    type="date"
                                                    value={newTaskData.fecha_limite}
                                                    onChange={(e) => setNewTaskData('fecha_limite', e.target.value)}
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                <Button type="submit" disabled={processingNewTask}>
                                                    Crear Tarea
                                                </Button>
                                                <Button 
                                                    type="button" 
                                                    variant="outline" 
                                                    onClick={() => setShowNewTaskForm(false)}
                                                >
                                                    Cancelar
                                                </Button>
                                            </div>
                                        </form>
                                    )}

                                    {/* Tasks List */}
                                    <div className="space-y-3">
                                        {proyecto.tareas.length === 0 ? (
                                            <div className="text-center py-8 text-gray-500">
                                                <ListTodo className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                                                <p>No hay tareas en este proyecto</p>
                                                <p className="text-sm">Agrega la primera tarea para comenzar</p>
                                            </div>
                                        ) : (
                                            proyecto.tareas.map((tarea) => (
                                                <div 
                                                    key={tarea.id}
                                                    className={`border rounded-lg p-4 ${tarea.completada ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}
                                                >
                                                    {editingTask === tarea.id ? (
                                                        <div className="space-y-3">
                                                            <Input
                                                                value={taskEditData.titulo}
                                                                onChange={(e) => setTaskEditData('titulo', e.target.value)}
                                                                placeholder="Título de la tarea"
                                                            />
                                                            <Textarea
                                                                value={taskEditData.descripcion}
                                                                onChange={(e) => setTaskEditData('descripcion', e.target.value)}
                                                                placeholder="Descripción"
                                                            />
                                                            <Input
                                                                type="date"
                                                                value={taskEditData.fecha_limite}
                                                                onChange={(e) => setTaskEditData('fecha_limite', e.target.value)}
                                                            />
                                                            <div className="flex gap-2">
                                                                <Button 
                                                                    size="sm" 
                                                                    onClick={() => handleUpdateTask(tarea.id)}
                                                                    disabled={processingTaskEdit}
                                                                >
                                                                    Guardar
                                                                </Button>
                                                                <Button 
                                                                    size="sm" 
                                                                    variant="outline" 
                                                                    onClick={() => setEditingTask(null)}
                                                                >
                                                                    Cancelar
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-start gap-3">
                                                            <Checkbox
                                                                checked={tarea.completada}
                                                                onCheckedChange={() => handleToggleTask(tarea)}
                                                                className="mt-1"
                                                            />
                                                            <div className="flex-1">
                                                                <h5 className={`font-medium ${tarea.completada ? 'line-through text-gray-500' : ''}`}>
                                                                    {tarea.titulo}
                                                                </h5>
                                                                {tarea.descripcion && (
                                                                    <p className={`text-sm mt-1 ${tarea.completada ? 'line-through text-gray-400' : 'text-gray-600'}`}>
                                                                        {tarea.descripcion}
                                                                    </p>
                                                                )}
                                                                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                                                    {tarea.fecha_limite && (
                                                                        <span className="flex items-center gap-1">
                                                                            <Calendar className="h-3 w-3" />
                                                                            {formatDate(tarea.fecha_limite)}
                                                                        </span>
                                                                    )}
                                                                    <span>Por {tarea.user.name}</span>
                                                                    {tarea.completada && tarea.completada_en && (
                                                                        <span className="text-green-600">
                                                                            ✓ Completada el {formatDate(tarea.completada_en)}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-1">
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    onClick={() => handleEditTask(tarea)}
                                                                    className="h-8 w-8 p-0"
                                                                >
                                                                    <Edit className="h-3 w-3" />
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    onClick={() => handleDeleteTask(tarea.id)}
                                                                    className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                                                                >
                                                                    <Trash2 className="h-3 w-3" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                                {/* Sidebar */}
                                <div className="space-y-6">
                            {/* Status Management */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Target className="h-5 w-5" />
                                        Gestión de Estado
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label>Estado Actual</Label>
                                        <div className={`mt-1 inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${estadoConfig.bg}`}>
                                            {estadoConfig.emoji} {estadoConfig.label}
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <Label>Cambiar Estado</Label>
                                        <Select onValueChange={handleChangeStatus}>
                                            <SelectTrigger className="mt-1">
                                                <SelectValue placeholder="Seleccionar nuevo estado" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="por_empezar">⏳ Por Empezar</SelectItem>
                                                <SelectItem value="en_progreso">🚀 En Progreso</SelectItem>
                                                <SelectItem value="en_pausa">⏸️ En Pausa</SelectItem>
                                                <SelectItem value="completado">✅ Completado</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {totalTareas > 0 && (
                                        <div>
                                            <Label>Progreso de Tareas</Label>
                                            <div className="mt-2 text-center">
                                                <div className="text-2xl font-bold text-purple-600">{progreso}%</div>
                                                <div className="text-sm text-gray-500">{tareasCompletadas} de {totalTareas} completadas</div>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Client Info */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="h-5 w-5" />
                                        Cliente
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {proyecto.cliente.nombre} {proyecto.cliente.apellido}
                                        </p>
                                        {proyecto.cliente.empresa && (
                                            <div className="flex items-center gap-2 mt-1">
                                                <Building2 className="h-4 w-4 text-gray-400" />
                                                <p className="text-sm text-gray-600">{proyecto.cliente.empresa}</p>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-4 w-4 text-gray-400" />
                                            <span className="text-sm text-gray-600">{proyecto.cliente.email}</span>
                                        </div>
                                        {proyecto.cliente.telefono && (
                                            <div className="flex items-center gap-2">
                                                <Phone className="h-4 w-4 text-gray-400" />
                                                <span className="text-sm text-gray-600">{proyecto.cliente.telefono}</span>
                                            </div>
                                        )}
                                        {proyecto.cliente.direccion && (
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4 text-gray-400" />
                                                <span className="text-sm text-gray-600">
                                                    {proyecto.cliente.direccion}
                                                    {proyecto.cliente.ciudad && `, ${proyecto.cliente.ciudad}`}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <Link href={`/clientes/${proyecto.cliente.id}`}>
                                        <Button variant="outline" className="w-full">
                                            Ver Perfil Cliente
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>

                            {/* Propuesta Original */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="h-5 w-5" />
                                        Propuesta Original
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div>
                                        <Label className="text-sm font-medium text-gray-600">Título</Label>
                                        <p className="mt-1 text-gray-900">{proyecto.propuesta.titulo}</p>
                                    </div>
                                    
                                    <Link href={`/propuestas/${proyecto.propuesta.id}`}>
                                        <Button variant="outline" className="w-full">
                                            Ver Propuesta
                                        </Button>
                                    </Link>
                                </CardContent>
                                </Card>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}