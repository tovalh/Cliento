import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Building2,
    Calendar,
    CheckCircle,
    Clock,
    Copy,
    DollarSign,
    Download,
    Edit,
    FileText,
    Mail,
    MessageSquare,
    Pause,
    Send,
    User,
    X,
    Plus,
    AlertTriangle,
    Rocket
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
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface Proyecto {
    id: number;
    nombre: string;
    estado: string;
    created_at: string;
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
    proyecto?: Proyecto;
}

interface BreadcrumbItem {
    title: string;
    href: string;
}

interface Props {
    propuesta: Propuesta;
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
    {
        title: 'Ver Propuesta',
        href: '#',
    },
];

export default function Show({ propuesta }: Props) {
    const [showEstadoModal, setShowEstadoModal] = useState(false);
    const [showFollowupModal, setShowFollowupModal] = useState(false);

    const { data: estadoData, setData: setEstadoData, post: postEstado, processing: processingEstado } = useForm({
        estado: propuesta.estado,
    });

    const { data: followupData, setData: setFollowupData, post: postFollowup, processing: processingFollowup, reset: resetFollowup } = useForm({
        notas: '',
        proximo_recordatorio: '',
    });

    const handleCambiarEstado = (e: React.FormEvent) => {
        e.preventDefault();
        postEstado(`/propuestas/${propuesta.id}/cambiar-estado`, {
            onSuccess: () => {
                setShowEstadoModal(false);
                router.reload({ only: ['propuesta'] });
            }
        });
    };

    const handleRegistrarFollowup = (e: React.FormEvent) => {
        e.preventDefault();
        postFollowup(`/propuestas/${propuesta.id}/followup`, {
            onSuccess: () => {
                setShowFollowupModal(false);
                resetFollowup();
                router.reload({ only: ['propuesta'] });
            }
        });
    };

    const handleDuplicar = () => {
        router.post(`/propuestas/${propuesta.id}/duplicar`);
    };

    const handleEnviar = () => {
        if (confirm('¿Estás seguro de que quieres marcar esta propuesta como enviada?')) {
            router.post(`/propuestas/${propuesta.id}/enviar`, {}, {
                onSuccess: () => {
                    router.reload({ only: ['propuesta'] });
                }
            });
        }
    };

    const handleConvertirAProyecto = () => {
        if (confirm('¿Estás seguro de que quieres convertir esta propuesta en un proyecto? Esta acción creará un nuevo proyecto basado en esta propuesta.')) {
            router.post(`/propuestas/${propuesta.id}/convertir-proyecto`);
        }
    };

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return 'No definida';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
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
                color: 'bg-gray-100 text-gray-700 border-gray-200', 
                emoji: '🟡', 
                label: 'Borrador',
                description: 'La propuesta está en desarrollo'
            },
            enviada: { 
                color: 'bg-blue-100 text-blue-700 border-blue-200', 
                emoji: '🔵', 
                label: 'Enviada',
                description: 'Esperando respuesta del cliente'
            },
            aprobada: { 
                color: 'bg-green-100 text-green-700 border-green-200', 
                emoji: '🟢', 
                label: 'Aprobada',
                description: 'Cliente ha aceptado la propuesta'
            },
            rechazada: { 
                color: 'bg-red-100 text-red-700 border-red-200', 
                emoji: '❌', 
                label: 'Rechazada',
                description: 'Cliente ha rechazado la propuesta'
            },
            negociacion: { 
                color: 'bg-yellow-100 text-yellow-700 border-yellow-200', 
                emoji: '⏸️', 
                label: 'En Negociación',
                description: 'Se están discutiendo cambios'
            }
        };
        return configs[estado as keyof typeof configs] || configs.borrador;
    };

    const estadoConfig = getEstadoConfig(propuesta.estado);
    const isVencida = propuesta.fecha_limite_respuesta && 
                     new Date(propuesta.fecha_limite_respuesta) < new Date() && 
                     propuesta.estado === 'enviada';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={propuesta.titulo} />
            
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 p-8">
                <div className="mx-auto max-w-6xl space-y-8">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            <div className="flex items-center gap-4">
                                <Link href="/propuestas">
                                    <Button variant="outline" size="sm">
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Volver
                                    </Button>
                                </Link>
                                <div>
                                    <div className="flex items-center gap-4 mb-2">
                                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                                            {propuesta.titulo}
                                        </h1>
                                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border-2 ${estadoConfig.color}`}>
                                            <span className="text-lg">{estadoConfig.emoji}</span>
                                            <span>{estadoConfig.label}</span>
                                        </div>
                                        {isVencida && (
                                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 border border-red-200">
                                                <AlertTriangle className="h-4 w-4" />
                                                <span className="text-sm font-medium">Vencida</span>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-gray-600">
                                        Propuesta para {propuesta.cliente.nombre} {propuesta.cliente.apellido}
                                        {propuesta.cliente.empresa && ` - ${propuesta.cliente.empresa}`}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button variant="outline" onClick={() => setShowFollowupModal(true)}>
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Follow-up
                            </Button>
                            <Button variant="outline" onClick={() => setShowEstadoModal(true)}>
                                <Clock className="mr-2 h-4 w-4" />
                                Cambiar Estado
                            </Button>
                            <Button variant="outline" onClick={handleDuplicar}>
                                <Copy className="mr-2 h-4 w-4" />
                                Duplicar
                            </Button>
                            <Link href={`/propuestas/${propuesta.id}/edit`}>
                                <Button variant="outline">
                                    <Edit className="mr-2 h-4 w-4" />
                                    Editar
                                </Button>
                            </Link>
                            {propuesta.estado === 'borrador' && (
                                <Button onClick={handleEnviar} className="bg-green-600 hover:bg-green-700">
                                    <Send className="mr-2 h-4 w-4" />
                                    Marcar como Enviada
                                </Button>
                            )}
                            {propuesta.estado === 'aprobada' && !propuesta.proyecto && (
                                <Button onClick={handleConvertirAProyecto} className="bg-purple-600 hover:bg-purple-700">
                                    <Rocket className="mr-2 h-4 w-4" />
                                    Convertir en Proyecto
                                </Button>
                            )}
                            {propuesta.proyecto && (
                                <Link href={`/proyectos/${propuesta.proyecto.id}`}>
                                    <Button variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50">
                                        <Rocket className="mr-2 h-4 w-4" />
                                        Ver Proyecto
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Columna Principal */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Descripción del Proyecto */}
                            <Card className="shadow-lg border-0">
                                <CardHeader className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="h-5 w-5" />
                                        Descripción del Proyecto
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="prose max-w-none">
                                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                            {propuesta.descripcion_proyecto}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Alcance del Proyecto */}
                            <Card className="shadow-lg border-0">
                                <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                                    <CardTitle className="flex items-center gap-2">
                                        <Building2 className="h-5 w-5" />
                                        Alcance del Proyecto
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <h4 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                                                <CheckCircle className="h-5 w-5" />
                                                ✅ Qué SÍ incluye
                                            </h4>
                                            <div className="space-y-2">
                                                {propuesta.alcance_incluye.split('\n').filter(line => line.trim()).map((item, index) => (
                                                    <div key={index} className="flex items-start gap-2">
                                                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                                        <span className="text-gray-700">{item.replace(/^-\s*/, '')}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {propuesta.alcance_no_incluye && (
                                            <div>
                                                <h4 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                                                    <X className="h-5 w-5" />
                                                    ❌ Qué NO incluye
                                                </h4>
                                                <div className="space-y-2">
                                                    {propuesta.alcance_no_incluye.split('\n').filter(line => line.trim()).map((item, index) => (
                                                        <div key={index} className="flex items-start gap-2">
                                                            <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                                                            <span className="text-gray-700">{item.replace(/^-\s*/, '')}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Términos y Condiciones */}
                            {propuesta.terminos_condiciones && (
                                <Card className="shadow-lg border-0">
                                    <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                                        <CardTitle className="flex items-center gap-2">
                                            <FileText className="h-5 w-5" />
                                            Términos y Condiciones
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                            {propuesta.terminos_condiciones}
                                        </p>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Notas Internas */}
                            {propuesta.notas_internas && (
                                <Card className="shadow-lg border-0 border-l-4 border-l-yellow-400">
                                    <CardHeader className="bg-yellow-50">
                                        <CardTitle className="flex items-center gap-2 text-yellow-800">
                                            <MessageSquare className="h-5 w-5" />
                                            Notas Internas (Privadas)
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6 bg-yellow-50">
                                        <p className="text-yellow-800 leading-relaxed whitespace-pre-line">
                                            {propuesta.notas_internas}
                                        </p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Información del Cliente */}
                            <Card className="shadow-lg border-0">
                                <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="h-5 w-5" />
                                        Cliente
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 space-y-4">
                                    <div>
                                        <h3 className="font-semibold text-lg">
                                            {propuesta.cliente.nombre} {propuesta.cliente.apellido}
                                        </h3>
                                        {propuesta.cliente.empresa && (
                                            <p className="text-gray-600">{propuesta.cliente.empresa}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Mail className="h-4 w-4 text-gray-400" />
                                            <a href={`mailto:${propuesta.cliente.email}`} className="text-blue-600 hover:underline">
                                                {propuesta.cliente.email}
                                            </a>
                                        </div>
                                        {propuesta.cliente.telefono && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="h-4 w-4 text-gray-400">📞</span>
                                                <span>{propuesta.cliente.telefono}</span>
                                            </div>
                                        )}
                                        {propuesta.cliente.direccion && (
                                            <div className="flex items-start gap-2 text-sm">
                                                <span className="h-4 w-4 text-gray-400 mt-0.5">📍</span>
                                                <span>{propuesta.cliente.direccion}</span>
                                            </div>
                                        )}
                                    </div>
                                    <Link href={`/clientes/${propuesta.cliente.id}`}>
                                        <Button variant="outline" size="sm" className="w-full">
                                            Ver Perfil Completo
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>

                            {/* Información Comercial */}
                            <Card className="shadow-lg border-0">
                                <CardHeader className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
                                    <CardTitle className="flex items-center gap-2">
                                        <DollarSign className="h-5 w-5" />
                                        Información Comercial
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 space-y-4">
                                    <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                                        <p className="text-sm text-green-600 mb-1">Precio Total</p>
                                        <p className="text-3xl font-bold text-green-700">
                                            {formatPrice(propuesta.precio_total)}
                                        </p>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Forma de Pago</p>
                                            <p className="text-gray-900">{propuesta.forma_pago}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Tiempo de Entrega</p>
                                            <p className="text-gray-900">{propuesta.tiempo_entrega}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Fechas Importantes */}
                            <Card className="shadow-lg border-0">
                                <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                                    <CardTitle className="flex items-center gap-2">
                                        <Calendar className="h-5 w-5" />
                                        Fechas Importantes
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 space-y-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Fecha de Creación</p>
                                        <p className="text-gray-900">{formatDate(propuesta.created_at)}</p>
                                    </div>
                                    
                                    {propuesta.fecha_envio && (
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Fecha de Envío</p>
                                            <p className="text-gray-900">{formatDate(propuesta.fecha_envio)}</p>
                                        </div>
                                    )}
                                    
                                    {propuesta.fecha_limite_respuesta && (
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Límite de Respuesta</p>
                                            <p className={`font-medium ${isVencida ? 'text-red-600' : 'text-gray-900'}`}>
                                                {formatDate(propuesta.fecha_limite_respuesta)}
                                                {isVencida && (
                                                    <span className="block text-xs text-red-500 mt-1">
                                                        ⚠️ Propuesta vencida
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                    )}

                                    {propuesta.fecha_ultimo_followup && (
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Último Follow-up</p>
                                            <p className="text-gray-900">{formatDate(propuesta.fecha_ultimo_followup)}</p>
                                        </div>
                                    )}

                                    {propuesta.proximo_recordatorio && (
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Próximo Recordatorio</p>
                                            <p className="text-gray-900">{formatDate(propuesta.proximo_recordatorio)}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Acciones Rápidas */}
                            <Card className="shadow-lg border-0">
                                <CardHeader className="bg-gradient-to-r from-gray-700 to-gray-800 text-white">
                                    <CardTitle>Acciones Rápidas</CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 space-y-3">
                                    <Button variant="outline" className="w-full" onClick={() => router.get(`/propuestas/${propuesta.id}/pdf`)}>
                                        <Download className="mr-2 h-4 w-4" />
                                        Exportar PDF
                                    </Button>
                                    <Button variant="outline" className="w-full" onClick={() => window.print()}>
                                        <FileText className="mr-2 h-4 w-4" />
                                        Imprimir
                                    </Button>
                                    <Button variant="outline" className="w-full" onClick={() => setShowFollowupModal(true)}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Agregar Follow-up
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Modal Cambiar Estado */}
                    {showEstadoModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                                <form onSubmit={handleCambiarEstado}>
                                    <div className="p-6">
                                        <h3 className="text-lg font-semibold mb-4">Cambiar Estado de Propuesta</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <Label htmlFor="estado">Nuevo Estado</Label>
                                                <Select value={estadoData.estado} onValueChange={(value) => setEstadoData('estado', value)}>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="borrador">🟡 Borrador</SelectItem>
                                                        <SelectItem value="enviada">🔵 Enviada</SelectItem>
                                                        <SelectItem value="aprobada">🟢 Aprobada</SelectItem>
                                                        <SelectItem value="rechazada">❌ Rechazada</SelectItem>
                                                        <SelectItem value="negociacion">⏸️ En Negociación</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-3 p-6 border-t">
                                        <Button 
                                            type="button" 
                                            variant="outline" 
                                            onClick={() => setShowEstadoModal(false)}
                                        >
                                            Cancelar
                                        </Button>
                                        <Button type="submit" disabled={processingEstado}>
                                            {processingEstado ? 'Guardando...' : 'Actualizar Estado'}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Modal Follow-up */}
                    {showFollowupModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                                <form onSubmit={handleRegistrarFollowup}>
                                    <div className="p-6">
                                        <h3 className="text-lg font-semibold mb-4">Registrar Follow-up</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <Label htmlFor="notas">Notas del Follow-up *</Label>
                                                <Textarea
                                                    id="notas"
                                                    value={followupData.notas}
                                                    onChange={(e) => setFollowupData('notas', e.target.value)}
                                                    placeholder="Describe el contacto realizado..."
                                                    rows={3}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="proximo_recordatorio">Próximo Recordatorio</Label>
                                                <Input
                                                    id="proximo_recordatorio"
                                                    type="date"
                                                    value={followupData.proximo_recordatorio}
                                                    onChange={(e) => setFollowupData('proximo_recordatorio', e.target.value)}
                                                    min={new Date().toISOString().split('T')[0]}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-3 p-6 border-t">
                                        <Button 
                                            type="button" 
                                            variant="outline" 
                                            onClick={() => setShowFollowupModal(false)}
                                        >
                                            Cancelar
                                        </Button>
                                        <Button type="submit" disabled={processingFollowup}>
                                            {processingFollowup ? 'Guardando...' : 'Registrar Follow-up'}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}