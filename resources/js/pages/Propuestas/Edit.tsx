import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
    User,
    Clock,
    AlertCircle,
    Eye
} from 'lucide-react';

// Types
interface Cliente {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    empresa?: string;
}

interface User {
    id: number;
    name: string;
    email: string;
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
}

interface BreadcrumbItem {
    title: string;
    href: string;
}

interface Props {
    propuesta: Propuesta;
    clientes: Cliente[];
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
        title: 'Editar Propuesta',
        href: '#',
    },
];

export default function Edit({ propuesta, clientes }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        cliente_id: propuesta.cliente_id.toString(),
        titulo: propuesta.titulo,
        descripcion_proyecto: propuesta.descripcion_proyecto,
        alcance_incluye: propuesta.alcance_incluye,
        alcance_no_incluye: propuesta.alcance_no_incluye || '',
        precio_total: propuesta.precio_total.toString(),
        forma_pago: propuesta.forma_pago,
        tiempo_entrega: propuesta.tiempo_entrega,
        terminos_condiciones: propuesta.terminos_condiciones || '',
        fecha_limite_respuesta: propuesta.fecha_limite_respuesta || '',
        notas_internas: propuesta.notas_internas || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/propuestas/${propuesta.id}`);
    };

    const formasPago = [
        '100% adelanto',
        '50% adelanto, 50% a la entrega',
        '30% adelanto, 70% a la entrega',
        '30% adelanto, 40% desarrollo, 30% entrega',
        '25% adelanto, 25% desarrollo, 25% pruebas, 25% entrega',
        'Pago mensual',
        'Otro (especificar en términos)',
    ];

    const tiemposEntrega = [
        '2 semanas',
        '4 semanas',
        '6 semanas',
        '8 semanas',
        '10 semanas',
        '12 semanas',
        '16 semanas',
        '20 semanas',
        '24 semanas',
        'Más de 6 meses',
    ];

    const getEstadoBadge = (estado: string) => {
        const configs = {
            borrador: { color: 'bg-gray-100 text-gray-700', emoji: '🟡', label: 'Borrador' },
            enviada: { color: 'bg-blue-100 text-blue-700', emoji: '🔵', label: 'Enviada' },
            aprobada: { color: 'bg-green-100 text-green-700', emoji: '🟢', label: 'Aprobada' },
            rechazada: { color: 'bg-red-100 text-red-700', emoji: '❌', label: 'Rechazada' },
            negociacion: { color: 'bg-yellow-100 text-yellow-700', emoji: '⏸️', label: 'En Negociación' }
        };
        const config = configs[estado as keyof typeof configs] || configs.borrador;
        return (
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
                <span>{config.emoji}</span>
                {config.label}
            </div>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Editar: ${propuesta.titulo}`} />
            
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 p-8">
                <div className="mx-auto max-w-4xl space-y-8">
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
                                            Editar Propuesta
                                        </h1>
                                        {getEstadoBadge(propuesta.estado)}
                                    </div>
                                    <p className="text-gray-600">
                                        Modificar propuesta para {propuesta.cliente.nombre} {propuesta.cliente.apellido}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <Link href={`/propuestas/${propuesta.id}`}>
                            <Button variant="outline">
                                <Eye className="mr-2 h-4 w-4" />
                                Ver Propuesta
                            </Button>
                        </Link>
                    </div>

                    {/* Estado de la propuesta - Solo lectura para estados enviados */}
                    {propuesta.estado !== 'borrador' && (
                        <Card className="border-2 border-yellow-200 bg-yellow-50">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-2 text-yellow-800">
                                    <AlertCircle className="h-5 w-5" />
                                    <p className="font-medium">
                                        Esta propuesta ya fue {propuesta.estado === 'enviada' ? 'enviada al cliente' : 
                                        propuesta.estado === 'aprobada' ? 'aprobada' : 
                                        propuesta.estado === 'rechazada' ? 'rechazada' : 'puesta en negociación'}.
                                        Los cambios podrían requerir notificar al cliente.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Información Básica */}
                        <Card className="shadow-lg border-0">
                            <CardHeader className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Información Básica
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="cliente_id" className="flex items-center gap-2">
                                            <User className="h-4 w-4" />
                                            Cliente *
                                        </Label>
                                        <Select value={data.cliente_id} onValueChange={(value) => setData('cliente_id', value)}>
                                            <SelectTrigger className={errors.cliente_id ? 'border-red-300' : ''}>
                                                <SelectValue placeholder="Selecciona un cliente" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {clientes.map((cliente) => (
                                                    <SelectItem key={cliente.id} value={cliente.id.toString()}>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-medium">
                                                                {cliente.nombre} {cliente.apellido}
                                                            </span>
                                                            {cliente.empresa && (
                                                                <span className="text-sm text-gray-500">
                                                                    - {cliente.empresa}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.cliente_id && (
                                            <p className="text-sm text-red-600 flex items-center gap-1">
                                                <AlertCircle className="h-3 w-3" />
                                                {errors.cliente_id}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="titulo">
                                            Título de la Propuesta *
                                        </Label>
                                        <Input
                                            id="titulo"
                                            value={data.titulo}
                                            onChange={(e) => setData('titulo', e.target.value)}
                                            placeholder="ej. Desarrollo de Sitio Web Corporativo"
                                            className={errors.titulo ? 'border-red-300' : ''}
                                        />
                                        {errors.titulo && (
                                            <p className="text-sm text-red-600 flex items-center gap-1">
                                                <AlertCircle className="h-3 w-3" />
                                                {errors.titulo}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="descripcion_proyecto">
                                        Descripción del Proyecto *
                                    </Label>
                                    <Textarea
                                        id="descripcion_proyecto"
                                        value={data.descripcion_proyecto}
                                        onChange={(e) => setData('descripcion_proyecto', e.target.value)}
                                        placeholder="Describe detalladamente el proyecto o servicio que vas a ofrecer..."
                                        rows={4}
                                        className={errors.descripcion_proyecto ? 'border-red-300' : ''}
                                    />
                                    {errors.descripcion_proyecto && (
                                        <p className="text-sm text-red-600 flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" />
                                            {errors.descripcion_proyecto}
                                        </p>
                                    )}
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
                            <CardContent className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="alcance_incluye">
                                            ✅ Qué SÍ incluye *
                                        </Label>
                                        <Textarea
                                            id="alcance_incluye"
                                            value={data.alcance_incluye}
                                            onChange={(e) => setData('alcance_incluye', e.target.value)}
                                            placeholder="- Diseño web responsivo&#10;- Sistema de gestión de contenido&#10;- Optimización SEO básica&#10;- ..."
                                            rows={8}
                                            className={errors.alcance_incluye ? 'border-red-300' : ''}
                                        />
                                        <p className="text-xs text-gray-500">
                                            Tip: Usa guiones (-) para crear una lista
                                        </p>
                                        {errors.alcance_incluye && (
                                            <p className="text-sm text-red-600 flex items-center gap-1">
                                                <AlertCircle className="h-3 w-3" />
                                                {errors.alcance_incluye}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="alcance_no_incluye">
                                            ❌ Qué NO incluye
                                        </Label>
                                        <Textarea
                                            id="alcance_no_incluye"
                                            value={data.alcance_no_incluye}
                                            onChange={(e) => setData('alcance_no_incluye', e.target.value)}
                                            placeholder="- E-commerce&#10;- Mantenimiento mensual&#10;- Hosting&#10;- ..."
                                            rows={8}
                                        />
                                        <p className="text-xs text-gray-500">
                                            Es importante definir los límites del proyecto
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Pricing y Términos */}
                        <Card className="shadow-lg border-0">
                            <CardHeader className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
                                <CardTitle className="flex items-center gap-2">
                                    <DollarSign className="h-5 w-5" />
                                    Pricing y Términos Comerciales
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="precio_total">
                                            Precio Total (USD) *
                                        </Label>
                                        <Input
                                            id="precio_total"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={data.precio_total}
                                            onChange={(e) => setData('precio_total', e.target.value)}
                                            placeholder="15000.00"
                                            className={errors.precio_total ? 'border-red-300' : ''}
                                        />
                                        {errors.precio_total && (
                                            <p className="text-sm text-red-600 flex items-center gap-1">
                                                <AlertCircle className="h-3 w-3" />
                                                {errors.precio_total}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="forma_pago">
                                            Forma de Pago *
                                        </Label>
                                        <Select value={data.forma_pago} onValueChange={(value) => setData('forma_pago', value)}>
                                            <SelectTrigger className={errors.forma_pago ? 'border-red-300' : ''}>
                                                <SelectValue placeholder="Selecciona forma de pago" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {formasPago.map((forma) => (
                                                    <SelectItem key={forma} value={forma}>
                                                        {forma}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.forma_pago && (
                                            <p className="text-sm text-red-600 flex items-center gap-1">
                                                <AlertCircle className="h-3 w-3" />
                                                {errors.forma_pago}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="tiempo_entrega">
                                            Tiempo de Entrega *
                                        </Label>
                                        <Select value={data.tiempo_entrega} onValueChange={(value) => setData('tiempo_entrega', value)}>
                                            <SelectTrigger className={errors.tiempo_entrega ? 'border-red-300' : ''}>
                                                <SelectValue placeholder="Selecciona tiempo" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {tiemposEntrega.map((tiempo) => (
                                                    <SelectItem key={tiempo} value={tiempo}>
                                                        {tiempo}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.tiempo_entrega && (
                                            <p className="text-sm text-red-600 flex items-center gap-1">
                                                <AlertCircle className="h-3 w-3" />
                                                {errors.tiempo_entrega}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="terminos_condiciones">
                                        Términos y Condiciones
                                    </Label>
                                    <Textarea
                                        id="terminos_condiciones"
                                        value={data.terminos_condiciones}
                                        onChange={(e) => setData('terminos_condiciones', e.target.value)}
                                        placeholder="El proyecto incluye 2 rondas de revisiones. Cambios adicionales se cobrarán por separado. Incluye capacitación del personal..."
                                        rows={4}
                                    />
                                    <p className="text-xs text-gray-500">
                                        Define condiciones especiales, revisiones incluidas, garantías, etc.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Configuración Adicional */}
                        <Card className="shadow-lg border-0">
                            <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                                <CardTitle className="flex items-center gap-2">
                                    <Clock className="h-5 w-5" />
                                    Configuración Adicional
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="fecha_limite_respuesta" className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            Fecha Límite de Respuesta
                                        </Label>
                                        <Input
                                            id="fecha_limite_respuesta"
                                            type="date"
                                            value={data.fecha_limite_respuesta}
                                            onChange={(e) => setData('fecha_limite_respuesta', e.target.value)}
                                            min={new Date().toISOString().split('T')[0]}
                                        />
                                        <p className="text-xs text-gray-500">
                                            Opcional: Fecha límite para que el cliente responda
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="notas_internas">
                                            Notas Internas
                                        </Label>
                                        <Textarea
                                            id="notas_internas"
                                            value={data.notas_internas}
                                            onChange={(e) => setData('notas_internas', e.target.value)}
                                            placeholder="Notas privadas que no verá el cliente..."
                                            rows={3}
                                        />
                                        <p className="text-xs text-gray-500">
                                            Estas notas son solo para uso interno
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-4 pt-6">
                            <Link href="/propuestas">
                                <Button variant="outline" type="button">
                                    Cancelar
                                </Button>
                            </Link>
                            <Link href={`/propuestas/${propuesta.id}`}>
                                <Button variant="outline" type="button">
                                    <Eye className="mr-2 h-4 w-4" />
                                    Ver Propuesta
                                </Button>
                            </Link>
                            <Button 
                                type="submit" 
                                disabled={processing}
                                className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800"
                            >
                                <Save className="mr-2 h-4 w-4" />
                                {processing ? 'Guardando...' : 'Actualizar Propuesta'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}