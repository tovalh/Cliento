import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Building2,
    Calendar,
    DollarSign,
    FileText,
    Save,
    User
} from 'lucide-react';

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
    descripcion_proyecto: string;
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
}

interface BreadcrumbItem {
    title: string;
    href: string;
}

interface Props {
    proyecto: Proyecto;
}

export default function Edit({ proyecto }: Props) {
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
        {
            title: 'Editar',
            href: `/proyectos/${proyecto.id}/edit`,
        },
    ];

    const { data, setData, put, processing, errors } = useForm({
        nombre: proyecto.nombre,
        descripcion: proyecto.descripcion,
        fecha_inicio: proyecto.fecha_inicio || '',
        fecha_entrega: proyecto.fecha_entrega || '',
        precio_total: proyecto.precio_total.toString(),
        forma_pago: proyecto.forma_pago,
        notas: proyecto.notas || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/proyectos/${proyecto.id}`);
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Editar Proyecto: ${proyecto.nombre}`} />
            
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50/30 p-8">
                <div className="mx-auto max-w-4xl space-y-8">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href={`/proyectos/${proyecto.id}`}>
                                <Button variant="outline" size="sm">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Volver
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Editar Proyecto</h1>
                                <p className="text-gray-600">{proyecto.nombre}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Form */}
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="h-5 w-5" />
                                        Información del Proyecto
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div>
                                            <Label htmlFor="nombre">Nombre del Proyecto *</Label>
                                            <Input
                                                id="nombre"
                                                value={data.nombre}
                                                onChange={(e) => setData('nombre', e.target.value)}
                                                className={errors.nombre ? 'border-red-500' : ''}
                                                placeholder="Ej: Desarrollo de sitio web corporativo"
                                                required
                                            />
                                            {errors.nombre && (
                                                <p className="text-sm text-red-600 mt-1">{errors.nombre}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="descripcion">Descripción *</Label>
                                            <Textarea
                                                id="descripcion"
                                                value={data.descripcion}
                                                onChange={(e) => setData('descripcion', e.target.value)}
                                                className={errors.descripcion ? 'border-red-500' : ''}
                                                placeholder="Describe los objetivos y alcance del proyecto..."
                                                rows={4}
                                                required
                                            />
                                            {errors.descripcion && (
                                                <p className="text-sm text-red-600 mt-1">{errors.descripcion}</p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="fecha_inicio">Fecha de Inicio</Label>
                                                <Input
                                                    id="fecha_inicio"
                                                    type="date"
                                                    value={data.fecha_inicio}
                                                    onChange={(e) => setData('fecha_inicio', e.target.value)}
                                                    className={errors.fecha_inicio ? 'border-red-500' : ''}
                                                />
                                                {errors.fecha_inicio && (
                                                    <p className="text-sm text-red-600 mt-1">{errors.fecha_inicio}</p>
                                                )}
                                            </div>

                                            <div>
                                                <Label htmlFor="fecha_entrega">Fecha de Entrega</Label>
                                                <Input
                                                    id="fecha_entrega"
                                                    type="date"
                                                    value={data.fecha_entrega}
                                                    onChange={(e) => setData('fecha_entrega', e.target.value)}
                                                    className={errors.fecha_entrega ? 'border-red-500' : ''}
                                                />
                                                {errors.fecha_entrega && (
                                                    <p className="text-sm text-red-600 mt-1">{errors.fecha_entrega}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="precio_total">Valor Total (USD) *</Label>
                                                <div className="relative">
                                                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                    <Input
                                                        id="precio_total"
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        value={data.precio_total}
                                                        onChange={(e) => setData('precio_total', e.target.value)}
                                                        className={errors.precio_total ? 'border-red-500 pl-10' : 'pl-10'}
                                                        placeholder="0.00"
                                                        required
                                                    />
                                                </div>
                                                {errors.precio_total && (
                                                    <p className="text-sm text-red-600 mt-1">{errors.precio_total}</p>
                                                )}
                                            </div>

                                            <div>
                                                <Label htmlFor="forma_pago">Forma de Pago *</Label>
                                                <Input
                                                    id="forma_pago"
                                                    value={data.forma_pago}
                                                    onChange={(e) => setData('forma_pago', e.target.value)}
                                                    className={errors.forma_pago ? 'border-red-500' : ''}
                                                    placeholder="Ej: 50% inicial, 50% al finalizar"
                                                    required
                                                />
                                                {errors.forma_pago && (
                                                    <p className="text-sm text-red-600 mt-1">{errors.forma_pago}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="notas">Notas Adicionales</Label>
                                            <Textarea
                                                id="notas"
                                                value={data.notas}
                                                onChange={(e) => setData('notas', e.target.value)}
                                                className={errors.notas ? 'border-red-500' : ''}
                                                placeholder="Información adicional, consideraciones especiales, etc."
                                                rows={3}
                                            />
                                            {errors.notas && (
                                                <p className="text-sm text-red-600 mt-1">{errors.notas}</p>
                                            )}
                                        </div>

                                        <div className="flex gap-4 pt-4">
                                            <Button 
                                                type="submit" 
                                                disabled={processing}
                                                className="bg-purple-600 hover:bg-purple-700"
                                            >
                                                <Save className="mr-2 h-4 w-4" />
                                                {processing ? 'Guardando...' : 'Guardar Cambios'}
                                            </Button>
                                            <Link href={`/proyectos/${proyecto.id}`}>
                                                <Button variant="outline">
                                                    Cancelar
                                                </Button>
                                            </Link>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar with Context Info */}
                        <div className="space-y-6">
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
                                    
                                    <Link href={`/clientes/${proyecto.cliente.id}`}>
                                        <Button variant="outline" className="w-full">
                                            Ver Cliente
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
                                    <div>
                                        <Label className="text-sm font-medium text-gray-600">Valor Original</Label>
                                        <p className="mt-1 text-gray-900 font-bold text-green-600">
                                            ${proyecto.propuesta.precio_total.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                                        </p>
                                    </div>
                                    
                                    <Link href={`/propuestas/${proyecto.propuesta.id}`}>
                                        <Button variant="outline" className="w-full">
                                            Ver Propuesta
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>

                            {/* Project Timeline */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Calendar className="h-5 w-5" />
                                        Cronología
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div>
                                        <Label className="text-sm font-medium text-gray-600">Proyecto Creado</Label>
                                        <p className="mt-1 text-gray-900">{formatDate(proyecto.created_at)}</p>
                                    </div>
                                    {proyecto.fecha_inicio && (
                                        <div>
                                            <Label className="text-sm font-medium text-gray-600">Fecha Inicio Actual</Label>
                                            <p className="mt-1 text-gray-900">{formatDate(proyecto.fecha_inicio)}</p>
                                        </div>
                                    )}
                                    {proyecto.fecha_entrega && (
                                        <div>
                                            <Label className="text-sm font-medium text-gray-600">Fecha Entrega Actual</Label>
                                            <p className="mt-1 text-gray-900">{formatDate(proyecto.fecha_entrega)}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}