import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AddNotaForm from '@/components/add-nota-form';
import Timeline from '@/components/timeline';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Cliente, type Nota, type Seguimiento, type Propuesta, type Proyecto } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Calendar, Mail, MapPin, Phone, Trash2, User, Edit, MessageSquare, Building2, FileText, ChevronDown, Briefcase, FolderOpen, Clock, Plus, X, Save } from 'lucide-react';
import { useState } from 'react';

interface Props {
    cliente: Cliente;
    notas: Nota[];
    seguimientos?: Seguimiento[];
    propuestas?: Propuesta[];
    proyectos?: Proyecto[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Clientes',
        href: '/clientes',
    },
    {
        title: 'Detalle del Cliente',
        href: '#',
    },
];

export default function Show({ cliente, notas, seguimientos = [], propuestas = [], proyectos = [] }: Props) {
    const [showModal, setShowModal] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        cliente_id: cliente.id,
        titulo: '',
        descripcion: '',
        fecha_seguimiento: '',
        prioridad: 'media' as 'baja' | 'media' | 'alta',
        tipo: 'llamada' as 'llamada' | 'email' | 'reunion' | 'propuesta' | 'otro',
    });

    const handleDelete = () => {
        if (confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
            router.delete(`/clientes/${cliente.id}`);
        }
    };

    const handleQuickSchedule = (days: number, titulo: string) => {
        const fecha = new Date();
        fecha.setDate(fecha.getDate() + days);

        setData({
            ...data,
            titulo,
            fecha_seguimiento: fecha.toISOString().split('T')[0]
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/seguimientos', {
            onSuccess: () => {
                reset();
                setShowModal(false);
            }
        });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${cliente.nombre} ${cliente.apellido}`} />

            <div className="min-h-screen bg-[#F8F9FA]">
                {/* Header naranja */}


                {/* Contenido principal */}
                <div className="mx-auto p-6">
                    {/* Tarjeta principal */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="bg-[#FF6B35]">
                            <div className="mx-auto px-8 py-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center gap-4">
                                            <h1 className="text-[28px] font-bold text-white">
                                                {cliente.nombre} {cliente.apellido}
                                            </h1>
                                            <Badge
                                                variant={cliente.estado === 'activo' ? 'default' : 'secondary'}
                                                className={`${cliente.estado === 'activo'
                                                    ? 'bg-green-500 text-white border-green-600'
                                                    : 'bg-gray-500 text-white border-gray-600'
                                                }`}
                                            >
                                                {cliente.estado === 'activo' ? 'Activo' : 'Inactivo'}
                                            </Badge>
                                        </div>
                                        <p className="text-white text-base opacity-90 mt-1">
                                            Cliente desde {formatDate(cliente.created_at)}
                                        </p>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        {/* Botón Volver */}
                                        <Link href="/clientes">
                                            <Button className="bg-white text-[#FF6B35] hover:bg-gray-50 hover:text-[#FF6B35] font-medium px-6 py-3 rounded-lg transition-colors cursor-pointer shadow-sm">
                                                <ArrowLeft className="mr-2 h-4 w-4" />
                                                Volver a Clientes
                                            </Button>
                                        </Link>

                                        {/* Botón Agregar Seguimiento */}
                                        <Button
                                            onClick={() => setShowModal(true)}
                                            className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white font-medium px-6 py-3 rounded-lg transition-colors cursor-pointer shadow-sm"
                                        >
                                            <Calendar className="mr-2 h-4 w-4" />
                                            {/*<Clock className="mr-2 h-4 w-4" />*/}
                                            Agregar Seguimiento
                                        </Button>

                                        {/* Botón Editar */}
                                        <Link href={`/clientes/${cliente.id}/edit`}>
                                            <Button className="bg-blue-600 text-white hover:bg-blue-700 font-medium px-6 py-3 rounded-lg transition-colors cursor-pointer shadow-sm">
                                                <Edit className="mr-2 h-4 w-4" />
                                                Editar
                                            </Button>
                                        </Link>

                                        {/* Botón Eliminar */}
                                        <Button
                                            onClick={handleDelete}
                                            className="bg-red-600 text-white hover:bg-red-700 font-medium px-6 py-3 rounded-lg transition-colors cursor-pointer shadow-sm"
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Eliminar
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-8">
                            <Tabs defaultValue="general" className="w-full">
                                <TabsList className="grid w-full grid-cols-4 mb-6 bg-gray-100 p-1">
                                    <TabsTrigger
                                        value="general"
                                        className="data-[state=active]:bg-[#FF6B35] data-[state=active]:text-white font-medium"
                                    >
                                        <User className="mr-2 h-4 w-4" />
                                        General
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="timeline"
                                        className="data-[state=active]:bg-[#FF6B35] data-[state=active]:text-white font-medium"
                                    >
                                        <MessageSquare className="mr-2 h-4 w-4" />
                                        Timeline
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="propuestas"
                                        className="data-[state=active]:bg-[#FF6B35] data-[state=active]:text-white font-medium"
                                    >
                                        <Briefcase className="mr-2 h-4 w-4" />
                                        Propuestas
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="proyectos"
                                        className="data-[state=active]:bg-[#FF6B35] data-[state=active]:text-white font-medium"
                                    >
                                        <FolderOpen className="mr-2 h-4 w-4" />
                                        Proyectos
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="general" className="space-y-6">
                                    <div className="w-full space-y-6">

                                        {/* Primera fila: Información Personal e Información Empresarial */}
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            {/* Información Personal */}
                                            <Collapsible defaultOpen className="border border-gray-200 rounded-lg">
                                <CollapsibleTrigger className="flex w-full items-center justify-between px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <User className="h-5 w-5 text-[#FF6B35]" />
                                        <span className="text-lg font-semibold text-[#333]">Información Personal</span>
                                    </div>
                                    <ChevronDown className="h-4 w-4 text-gray-500 transition-transform data-[state=open]:rotate-180" />
                                </CollapsibleTrigger>
                                <CollapsibleContent className="px-6 pb-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-[#333]">Nombre completo</label>
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                <User className="h-4 w-4 text-gray-500" />
                                                <p className="font-medium text-gray-900">{cliente.nombre} {cliente.apellido}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-[#333]">Email</label>
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                <Mail className="h-4 w-4 text-gray-500" />
                                                <p className="font-medium text-gray-900">{cliente.email}</p>
                                            </div>
                                        </div>

                                        {cliente.telefono && (
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-[#333]">Teléfono</label>
                                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                    <Phone className="h-4 w-4 text-gray-500" />
                                                    <p className="font-medium text-gray-900">{cliente.telefono}</p>
                                                </div>
                                            </div>
                                        )}

                                        {cliente.fecha_nacimiento && (
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-[#333]">Fecha de nacimiento</label>
                                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                    <Calendar className="h-4 w-4 text-gray-500" />
                                                    <p className="font-medium text-gray-900">{formatDate(cliente.fecha_nacimiento)}</p>
                                                </div>
                                            </div>
                                        )}

                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-[#333]">Estado</label>
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                <div className={`h-3 w-3 rounded-full ${
                                                    cliente.estado === 'activo' ? 'bg-green-500' : 'bg-gray-500'
                                                }`}></div>
                                                <p className="font-medium text-gray-900">
                                                    {cliente.estado === 'activo' ? 'Activo' : 'Inactivo'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                                </CollapsibleContent>
                                            </Collapsible>

                                            {/* Información Empresarial */}
                                            <Collapsible defaultOpen className="border border-gray-200 rounded-lg">
                                                <CollapsibleTrigger className="flex w-full items-center justify-between px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <Building2 className="h-5 w-5 text-[#FF6B35]" />
                                                        <span className="text-lg font-semibold text-[#333]">Información Empresarial</span>
                                                    </div>
                                                    <ChevronDown className="h-4 w-4 text-gray-500 transition-transform data-[state=open]:rotate-180" />
                                                </CollapsibleTrigger>
                                                <CollapsibleContent className="px-6 pb-6">
                                                    <div className="grid grid-cols-1 gap-6">
                                                        {cliente.empresa && (
                                                            <div className="space-y-2">
                                                                <label className="text-sm font-semibold text-[#333]">Empresa</label>
                                                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                                    <Building2 className="h-4 w-4 text-gray-500" />
                                                                    <p className="font-medium text-gray-900">{cliente.empresa}</p>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {cliente.direccion && (
                                                            <div className="space-y-2">
                                                                <label className="text-sm font-semibold text-[#333]">Dirección</label>
                                                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                                    <MapPin className="h-4 w-4 text-gray-500" />
                                                                    <p className="font-medium text-gray-900">{cliente.direccion}</p>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {cliente.ciudad && (
                                                            <div className="space-y-2">
                                                                <label className="text-sm font-semibold text-[#333]">Ciudad</label>
                                                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                                    <MapPin className="h-4 w-4 text-gray-500" />
                                                                    <p className="font-medium text-gray-900">{cliente.ciudad}</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </CollapsibleContent>
                                            </Collapsible>
                                        </div>

                                        {/* Segunda fila: Notas del Cliente e Información del Sistema */}
                                        <div className="grid grid-cols-1 gap-6">
                                            {/* Notas del Cliente */}
                                            {cliente.notas && (
                                                <Collapsible defaultOpen className="border border-gray-200 rounded-lg">
                                                    <CollapsibleTrigger className="flex w-full items-center justify-between px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                                                        <div className="flex items-center gap-3">
                                                            <FileText className="h-5 w-5 text-[#FF6B35]" />
                                                            <span className="text-lg font-semibold text-[#333]">Notas del Cliente</span>
                                                        </div>
                                                        <ChevronDown className="h-4 w-4 text-gray-500 transition-transform data-[state=open]:rotate-180" />
                                                    </CollapsibleTrigger>
                                                    <CollapsibleContent className="px-6 pb-6">
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-semibold text-[#333]">Notas</label>
                                                            <div className="p-4 bg-gray-50 rounded-lg border">
                                                                <p className="text-sm whitespace-pre-wrap text-gray-700">{cliente.notas}</p>
                                                            </div>
                                                        </div>
                                                    </CollapsibleContent>
                                                </Collapsible>
                                            )}

                                            {/* Información del Sistema */}
                                            <Collapsible className="border border-gray-200 rounded-lg">
                                                <CollapsibleTrigger className="flex w-full items-center justify-between px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <Calendar className="h-5 w-5 text-[#FF6B35]" />
                                                        <span className="text-lg font-semibold text-[#333]">Información del Sistema</span>
                                                    </div>
                                                    <ChevronDown className="h-4 w-4 text-gray-500 transition-transform data-[state=open]:rotate-180" />
                                                </CollapsibleTrigger>
                                                <CollapsibleContent className="px-6 pb-6">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-semibold text-[#333]">Fecha de creación</label>
                                                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                                <Calendar className="h-4 w-4 text-gray-500" />
                                                                <p className="font-medium text-gray-900">{formatDate(cliente.created_at)}</p>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-semibold text-[#333]">Última actualización</label>
                                                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                                <Calendar className="h-4 w-4 text-gray-500" />
                                                                <p className="font-medium text-gray-900">{formatDate(cliente.updated_at)}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CollapsibleContent>
                                            </Collapsible>
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="timeline" className="space-y-6">
                                    <div className="w-full space-y-6">
                                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                                            <MessageSquare className="h-5 w-5 text-[#FF6B35]" />
                                            <h2 className="text-lg font-semibold text-[#333]">Timeline & Notas</h2>
                                            <Badge variant="secondary" className="ml-auto">
                                                {notas.length} {notas.length === 1 ? 'nota' : 'notas'}
                                            </Badge>
                                            <div>
                                                <AddNotaForm clienteId={cliente.id} />
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <Timeline notas={notas} seguimientos={seguimientos} propuestas={propuestas} proyectos={proyectos} />
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="propuestas" className="space-y-6">
                                    <div className="w-full space-y-6">
                                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                                            <Briefcase className="h-5 w-5 text-[#FF6B35]" />
                                            <h2 className="text-lg font-semibold text-[#333]">Propuestas del Cliente</h2>
                                            <Badge variant="secondary" className="ml-auto">
                                                {propuestas.length} {propuestas.length === 1 ? 'propuesta' : 'propuestas'}
                                            </Badge>
                                            {propuestas.length > 0 && (
                                                <Link href={`/propuestas/create?cliente_id=${cliente.id}`}>
                                                    <Button className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white font-medium px-4 py-2 rounded-lg shadow-sm">
                                                        <Plus className="mr-2 h-4 w-4" />
                                                        Nueva Propuesta
                                                    </Button>
                                                </Link>
                                            )}
                                        </div>
                                        {propuestas.length === 0 ? (
                                            <div className="text-center py-12">
                                                <Briefcase className="h-16 w-16 mx-auto mb-6 text-gray-300" />
                                                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                                    No hay propuestas para este cliente
                                                </h3>
                                                <p className="text-gray-500 mb-6">
                                                    Crea la primera propuesta para {cliente.nombre} {cliente.apellido}
                                                </p>
                                                <Link href={`/propuestas/create?cliente_id=${cliente.id}`}>
                                                    <Button className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white font-medium px-6 py-3 rounded-lg shadow-sm">
                                                        <Plus className="mr-2 h-5 w-5" />
                                                        Crear Primera Propuesta
                                                    </Button>
                                                </Link>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {propuestas.map((propuesta) => (
                                                    <div
                                                        key={propuesta.id}
                                                        className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                                                        onClick={() => {
                                                            const currentUrl = window.location.href;
                                                            router.visit(`/propuestas/${propuesta.id}/edit?return_to=${encodeURIComponent(currentUrl)}`);
                                                        }}
                                                    >
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-3 mb-2">
                                                                    <h3 className="text-lg font-semibold text-gray-900">{propuesta.titulo}</h3>
                                                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                                        propuesta.estado === 'aprobada' ? 'bg-green-100 text-green-800' :
                                                                        propuesta.estado === 'enviada' ? 'bg-blue-100 text-blue-800' :
                                                                        propuesta.estado === 'rechazada' ? 'bg-red-100 text-red-800' :
                                                                        propuesta.estado === 'negociacion' ? 'bg-yellow-100 text-yellow-800' :
                                                                        'bg-gray-100 text-gray-800'
                                                                    }`}>
                                                                        {propuesta.estado.charAt(0).toUpperCase() + propuesta.estado.slice(1)}
                                                                    </span>
                                                                </div>
                                                                <p className="text-gray-600 mb-3 line-clamp-2">{propuesta.descripcion_proyecto}</p>
                                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                                    <div>
                                                                        <p className="text-gray-500">Precio</p>
                                                                        <p className="font-medium">${propuesta.precio_total.toLocaleString()}</p>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-gray-500">Tiempo entrega</p>
                                                                        <p className="font-medium">{propuesta.tiempo_entrega}</p>
                                                                    </div>
                                                                    {propuesta.fecha_envio && (
                                                                        <div>
                                                                            <p className="text-gray-500">Fecha envío</p>
                                                                            <p className="font-medium">{formatDate(propuesta.fecha_envio)}</p>
                                                                        </div>
                                                                    )}
                                                                    <div>
                                                                        <p className="text-gray-500">Creada</p>
                                                                        <p className="font-medium">{formatDate(propuesta.created_at)}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </TabsContent>

                                <TabsContent value="proyectos" className="space-y-6">
                                    <div className="w-full space-y-6">
                                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                                            <FolderOpen className="h-5 w-5 text-[#FF6B35]" />
                                            <h2 className="text-lg font-semibold text-[#333]">Proyectos del Cliente</h2>
                                            <Badge variant="secondary" className="ml-auto">
                                                {proyectos.length} {proyectos.length === 1 ? 'proyecto' : 'proyectos'}
                                            </Badge>
                                            {proyectos.length > 0 && (
                                                <Link href={`/propuestas/create?cliente_id=${cliente.id}`}>
                                                    <Button className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white font-medium px-4 py-2 rounded-lg shadow-sm">
                                                        <Plus className="mr-2 h-4 w-4" />
                                                        Nueva Propuesta
                                                    </Button>
                                                </Link>
                                            )}
                                        </div>
                                        {proyectos.length === 0 ? (
                                            <div className="text-center py-12">
                                                <FolderOpen className="h-16 w-16 mx-auto mb-6 text-gray-300" />
                                                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                                    No hay proyectos para este cliente
                                                </h3>
                                                <p className="text-gray-500 mb-4">
                                                    Los proyectos se crean a partir de propuestas aprobadas.
                                                </p>
                                                <p className="text-gray-500 mb-6">
                                                    Crea una propuesta para {cliente.nombre} {cliente.apellido} primero
                                                </p>
                                                <Link href={`/propuestas/create?cliente_id=${cliente.id}`}>
                                                    <Button className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white font-medium px-6 py-3 rounded-lg shadow-sm">
                                                        <Plus className="mr-2 h-5 w-5" />
                                                        Crear Propuesta
                                                    </Button>
                                                </Link>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {proyectos.map((proyecto) => (
                                                    <div
                                                        key={proyecto.id}
                                                        className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                                                        onClick={() => {
                                                            const currentUrl = window.location.href;
                                                            router.visit(`/proyectos/${proyecto.id}/edit?return_to=${encodeURIComponent(currentUrl)}`);
                                                        }}
                                                    >
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-3 mb-2">
                                                                    <h3 className="text-lg font-semibold text-gray-900">{proyecto.nombre}</h3>
                                                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                                        proyecto.estado === 'completado' ? 'bg-green-100 text-green-800' :
                                                                        proyecto.estado === 'en_progreso' ? 'bg-blue-100 text-blue-800' :
                                                                        proyecto.estado === 'en_pausa' ? 'bg-yellow-100 text-yellow-800' :
                                                                        'bg-gray-100 text-gray-800'
                                                                    }`}>
                                                                        {proyecto.estado ? proyecto.estado.replace('_', ' ').charAt(0).toUpperCase() + proyecto.estado.replace('_', ' ').slice(1) : 'Sin estado'}
                                                                    </span>
                                                                </div>
                                                                {proyecto.descripcion && (
                                                                    <p className="text-gray-600 mb-3 line-clamp-2">{proyecto.descripcion}</p>
                                                                )}
                                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                                                                    {proyecto.fecha_inicio && (
                                                                        <div>
                                                                            <p className="text-gray-500">Fecha inicio</p>
                                                                            <p className="font-medium">{formatDate(proyecto.fecha_inicio)}</p>
                                                                        </div>
                                                                    )}
                                                                    {proyecto.fecha_entrega && (
                                                                        <div>
                                                                            <p className="text-gray-500">Fecha entrega</p>
                                                                            <p className="font-medium">{formatDate(proyecto.fecha_entrega)}</p>
                                                                        </div>
                                                                    )}
                                                                    <div>
                                                                        <p className="text-gray-500">Creado</p>
                                                                        <p className="font-medium">{formatDate(proyecto.created_at)}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de Agregar Seguimiento */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
                        {/* Header naranja */}
                        <div className="bg-[#FF6B35] px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-5 w-5 text-white" />
                                    <h2 className="text-xl font-bold text-white">Agendar Seguimiento</h2>
                                </div>
                                <Button
                                    onClick={() => setShowModal(false)}
                                    className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors cursor-pointer"
                                    variant="ghost"
                                >
                                    <X className="h-5 w-5 text-white" />
                                </Button>
                            </div>
                        </div>

                        {/* Contenido del modal */}
                        <div className="p-6">

                            {/* Botones de Períodos Rápidos */}
                            <div className="mb-6">
                                <Label className="text-sm font-semibold text-[#333] mb-3 block">Períodos rápidos</Label>
                                <div className="grid grid-cols-2 gap-3">
                                    <Button
                                        onClick={() => handleQuickSchedule(7, 'Seguimiento semanal')}
                                        className="bg-gray-100 hover:bg-[#FF6B35] hover:text-white text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors text-sm cursor-pointer"
                                        variant="ghost"
                                    >
                                        <Calendar className="mr-2 h-3 w-3" />
                                        1 semana
                                    </Button>
                                    <Button
                                        onClick={() => handleQuickSchedule(30, 'Seguimiento mensual')}
                                        className="bg-gray-100 hover:bg-[#FF6B35] hover:text-white text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors text-sm cursor-pointer"
                                        variant="ghost"
                                    >
                                        <Calendar className="mr-2 h-3 w-3" />
                                        1 mes
                                    </Button>
                                    <Button
                                        onClick={() => handleQuickSchedule(90, 'Seguimiento trimestral')}
                                        className="bg-gray-100 hover:bg-[#FF6B35] hover:text-white text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors text-sm col-span-2 cursor-pointer"
                                        variant="ghost"
                                    >
                                        <Calendar className="mr-2 h-3 w-3" />
                                        3 meses
                                    </Button>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="titulo" className="text-sm font-semibold text-[#333]">Título del seguimiento *</Label>
                                    <Input
                                        id="titulo"
                                        value={data.titulo}
                                        onChange={(e) => setData('titulo', e.target.value)}
                                        placeholder="Ej: Llamar para seguimiento de propuesta"
                                        className={`border-gray-300 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35] focus:ring-opacity-20 placeholder-gray-400 ${errors.titulo ? 'border-red-500' : ''}`}
                                    />
                                    {errors.titulo && (
                                        <p className="text-sm text-red-500">{errors.titulo}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="tipo" className="text-sm font-semibold text-[#333]">Tipo</Label>
                                        <Select value={data.tipo} onValueChange={(value) => setData('tipo', value as 'llamada' | 'email' | 'reunion' | 'propuesta' | 'otro')}>
                                            <SelectTrigger className="border-gray-300 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35] focus:ring-opacity-20">
                                                <SelectValue placeholder="Selecciona el tipo" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="llamada">Llamada</SelectItem>
                                                <SelectItem value="email">Email</SelectItem>
                                                <SelectItem value="reunion">Reunión</SelectItem>
                                                <SelectItem value="propuesta">Propuesta</SelectItem>
                                                <SelectItem value="otro">Otro</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="prioridad" className="text-sm font-semibold text-[#333]">Prioridad</Label>
                                        <Select value={data.prioridad} onValueChange={(value) => setData('prioridad', value as 'baja' | 'media' | 'alta')}>
                                            <SelectTrigger className="border-gray-300 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35] focus:ring-opacity-20">
                                                <SelectValue placeholder="Selecciona la prioridad" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="baja">Baja</SelectItem>
                                                <SelectItem value="media">Media</SelectItem>
                                                <SelectItem value="alta">Alta</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="fecha_seguimiento" className="text-sm font-semibold text-[#333]">Fecha de seguimiento *</Label>
                                    <Input
                                        id="fecha_seguimiento"
                                        type="date"
                                        value={data.fecha_seguimiento}
                                        onChange={(e) => setData('fecha_seguimiento', e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                        className={`border-gray-300 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35] focus:ring-opacity-20 ${errors.fecha_seguimiento ? 'border-red-500' : ''}`}
                                    />
                                    {errors.fecha_seguimiento && (
                                        <p className="text-sm text-red-500">{errors.fecha_seguimiento}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="descripcion" className="text-sm font-semibold text-[#333]">Descripción (opcional)</Label>
                                    <textarea
                                        id="descripcion"
                                        value={data.descripcion}
                                        onChange={(e) => setData('descripcion', e.target.value)}
                                        className="w-full min-h-[80px] px-3 py-2 text-sm border border-gray-300 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35] focus:ring-opacity-20 bg-white rounded-md resize-vertical placeholder-gray-400"
                                        placeholder="Detalles adicionales sobre el seguimiento..."
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 font-medium shadow-sm transition-colors cursor-pointer"
                                        variant="outline"
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="flex-1 bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white font-medium px-4 py-2 shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
                                    >
                                        <Save className="mr-2 h-4 w-4" />
                                        {processing ? 'Agendando...' : 'Guardar'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
