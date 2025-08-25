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
    X
} from 'lucide-react';

// Types
interface Cliente {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    empresa?: string;
}

interface BreadcrumbItem {
    title: string;
    href: string;
}

interface Props {
    clientes: Cliente[];
    clienteSeleccionado?: Cliente;
    redirectToClient?: boolean;
}

// Los breadcrumbs se generarán dinámicamente en el componente

export default function Create({ clientes, clienteSeleccionado, redirectToClient = false }: Props) {
    // Generar breadcrumbs dinámicamente
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        ...(redirectToClient && clienteSeleccionado ? [{
            title: 'Clientes',
            href: '/clientes',
        }, {
            title: `${clienteSeleccionado.nombre} ${clienteSeleccionado.apellido}`,
            href: `/clientes/${clienteSeleccionado.id}`,
        }] : [{
            title: 'Propuestas',
            href: '/propuestas',
        }]),
        {
            title: 'Nueva Propuesta',
            href: '/propuestas/create',
        },
    ];

    const { data, setData, post, processing, errors } = useForm({
        cliente_id: clienteSeleccionado?.id.toString() || '',
        titulo: '',
        descripcion_proyecto: '',
        alcance_incluye: '',
        alcance_no_incluye: '',
        precio_total: '',
        forma_pago: '',
        tiempo_entrega: '',
        terminos_condiciones: '',
        fecha_limite_respuesta: '',
        notas_internas: '',
        redirect_to_client: redirectToClient ? 'true' : 'false',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/propuestas');
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nueva Propuesta" />

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
                                            Crear Propuesta
                                        </h1>
                                        <p className="text-white text-base opacity-90 mt-1">
                                            Crea una propuesta comercial profesional para tu cliente
                                        </p>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        {/* Botón Volver */}
                                        <Link href={redirectToClient && clienteSeleccionado ? `/clientes/${clienteSeleccionado.id}` : '/propuestas'}>
                                            <Button className="bg-white text-[#FF6B35] hover:bg-gray-50 hover:text-[#FF6B35] font-medium px-6 py-3 rounded-lg transition-colors cursor-pointer shadow-sm">
                                                <ArrowLeft className="mr-2 h-4 w-4" />
                                                {redirectToClient && clienteSeleccionado 
                                                    ? `Volver a ${clienteSeleccionado.nombre} ${clienteSeleccionado.apellido}`
                                                    : 'Volver a Propuestas'
                                                }
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Contenido del formulario */}
                        <div className="p-8">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Información Básica */}
                                <div className="mb-8">
                                    <h2 className="text-lg font-semibold text-[#333] mb-6 pb-2 border-b border-gray-200 flex items-center gap-2">
                                        <FileText className="h-5 w-5 text-[#FF6B35]" />
                                        Información Básica
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="cliente_id" className="text-sm font-semibold text-[#333] flex items-center gap-2">
                                                <User className="h-4 w-4 text-[#FF6B35]" />
                                                Cliente *
                                            </Label>
                                            <Select value={data.cliente_id} onValueChange={(value) => setData('cliente_id', value)}>
                                                <SelectTrigger className={`border-gray-300 focus:border-[#FF6B35] focus:ring-[#FF6B35] ${
                                                    errors.cliente_id ? 'border-red-500' : ''
                                                }`}>
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
                                        {clienteSeleccionado && (
                                            <p className="text-sm text-[#FF6B35] flex items-center gap-1">
                                                <User className="h-3 w-3" />
                                                Cliente preseleccionado desde el perfil del cliente
                                            </p>
                                        )}
                                    </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="titulo" className="text-sm font-semibold text-[#333]">
                                                Título de la Propuesta *
                                            </Label>
                                            <Input
                                                id="titulo"
                                                value={data.titulo}
                                                onChange={(e) => setData('titulo', e.target.value)}
                                                placeholder="ej. Desarrollo de Sitio Web Corporativo"
                                                className={`border-gray-300 focus:border-[#FF6B35] focus:ring-[#FF6B35] ${
                                                    errors.titulo ? 'border-red-500' : ''
                                                }`}
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
                                        <Label htmlFor="descripcion_proyecto" className="text-sm font-semibold text-[#333]">
                                            Descripción del Proyecto *
                                        </Label>
                                        <Textarea
                                            id="descripcion_proyecto"
                                            value={data.descripcion_proyecto}
                                            onChange={(e) => setData('descripcion_proyecto', e.target.value)}
                                            placeholder="Describe detalladamente el proyecto o servicio que vas a ofrecer..."
                                            rows={4}
                                            className={`border-gray-300 focus:border-[#FF6B35] focus:ring-[#FF6B35] ${
                                                errors.descripcion_proyecto ? 'border-red-500' : ''
                                            }`}
                                        />
                                    {errors.descripcion_proyecto && (
                                        <p className="text-sm text-red-600 flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" />
                                            {errors.descripcion_proyecto}
                                        </p>
                                    )}
                                </div>
                                </div>

                                {/* Alcance del Proyecto */}
                                <div className="mb-8">
                                    <h2 className="text-lg font-semibold text-[#333] mb-6 pb-2 border-b border-gray-200 flex items-center gap-2">
                                        <Building2 className="h-5 w-5 text-[#FF6B35]" />
                                        Alcance del Proyecto
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="alcance_incluye" className="text-sm font-semibold text-[#333]">
                                                ✅ Qué SÍ incluye *
                                            </Label>
                                            <Textarea
                                                id="alcance_incluye"
                                                value={data.alcance_incluye}
                                                onChange={(e) => setData('alcance_incluye', e.target.value)}
                                                placeholder="- Diseño web responsivo&#10;- Sistema de gestión de contenido&#10;- Optimización SEO básica&#10;- ..."
                                                rows={8}
                                                className={`border-gray-300 focus:border-[#FF6B35] focus:ring-[#FF6B35] ${
                                                    errors.alcance_incluye ? 'border-red-500' : ''
                                                }`}
                                            />
                                            <p className="text-xs text-gray-500">
                                                Tip: Usa guiones (-) para crear una lista
                                            </p>
                                            {errors.alcance_incluye && (
                                                <p className="text-sm text-red-500 flex items-center gap-1">
                                                    <AlertCircle className="h-3 w-3" />
                                                    {errors.alcance_incluye}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="alcance_no_incluye" className="text-sm font-semibold text-[#333]">
                                                ❌ Qué NO incluye
                                            </Label>
                                            <Textarea
                                                id="alcance_no_incluye"
                                                value={data.alcance_no_incluye}
                                                onChange={(e) => setData('alcance_no_incluye', e.target.value)}
                                                placeholder="- E-commerce&#10;- Mantenimiento mensual&#10;- Hosting&#10;- ..."
                                                rows={8}
                                                className="border-gray-300 focus:border-[#FF6B35] focus:ring-[#FF6B35]"
                                            />
                                            <p className="text-xs text-gray-500">
                                                Es importante definir los límites del proyecto
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Pricing y Términos */}
                                <div className="mb-8">
                                    <h2 className="text-lg font-semibold text-[#333] mb-6 pb-2 border-b border-gray-200 flex items-center gap-2">
                                        <DollarSign className="h-5 w-5 text-[#FF6B35]" />
                                        Pricing y Términos Comerciales
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="precio_total" className="text-sm font-semibold text-[#333]">
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
                                                className={`border-gray-300 focus:border-[#FF6B35] focus:ring-[#FF6B35] ${
                                                    errors.precio_total ? 'border-red-500' : ''
                                                }`}
                                            />
                                        {errors.precio_total && (
                                            <p className="text-sm text-red-600 flex items-center gap-1">
                                                <AlertCircle className="h-3 w-3" />
                                                {errors.precio_total}
                                            </p>
                                        )}
                                    </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="forma_pago" className="text-sm font-semibold text-[#333]">
                                                Forma de Pago *
                                            </Label>
                                            <Select value={data.forma_pago} onValueChange={(value) => setData('forma_pago', value)}>
                                                <SelectTrigger className={`border-gray-300 focus:border-[#FF6B35] focus:ring-[#FF6B35] ${
                                                    errors.forma_pago ? 'border-red-500' : ''
                                                }`}>
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
                                            <Label htmlFor="tiempo_entrega" className="text-sm font-semibold text-[#333]">
                                                Tiempo de Entrega *
                                            </Label>
                                            <Select value={data.tiempo_entrega} onValueChange={(value) => setData('tiempo_entrega', value)}>
                                                <SelectTrigger className={`border-gray-300 focus:border-[#FF6B35] focus:ring-[#FF6B35] ${
                                                    errors.tiempo_entrega ? 'border-red-500' : ''
                                                }`}>
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
                                        <Label htmlFor="terminos_condiciones" className="text-sm font-semibold text-[#333]">
                                            Términos y Condiciones
                                        </Label>
                                        <Textarea
                                            id="terminos_condiciones"
                                            value={data.terminos_condiciones}
                                            onChange={(e) => setData('terminos_condiciones', e.target.value)}
                                            placeholder="El proyecto incluye 2 rondas de revisiones. Cambios adicionales se cobrarán por separado. Incluye capacitación del personal..."
                                            rows={4}
                                            className="border-gray-300 focus:border-[#FF6B35] focus:ring-[#FF6B35]"
                                        />
                                    <p className="text-xs text-gray-500">
                                        Define condiciones especiales, revisiones incluidas, garantías, etc.
                                    </p>
                                </div>
                                </div>

                                {/* Configuración Adicional */}
                                <div className="mb-8">
                                    <h2 className="text-lg font-semibold text-[#333] mb-6 pb-2 border-b border-gray-200 flex items-center gap-2">
                                        <Clock className="h-5 w-5 text-[#FF6B35]" />
                                        Configuración Adicional
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="fecha_limite_respuesta" className="text-sm font-semibold text-[#333] flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-[#FF6B35]" />
                                                Fecha Límite de Respuesta
                                            </Label>
                                            <Input
                                                id="fecha_limite_respuesta"
                                                type="date"
                                                value={data.fecha_limite_respuesta}
                                                onChange={(e) => setData('fecha_limite_respuesta', e.target.value)}
                                                min={new Date().toISOString().split('T')[0]}
                                                className="border-gray-300 focus:border-[#FF6B35] focus:ring-[#FF6B35]"
                                            />
                                        <p className="text-xs text-gray-500">
                                            Opcional: Fecha límite para que el cliente responda
                                        </p>
                                    </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="notas_internas" className="text-sm font-semibold text-[#333]">
                                                Notas Internas
                                            </Label>
                                            <Textarea
                                                id="notas_internas"
                                                value={data.notas_internas}
                                                onChange={(e) => setData('notas_internas', e.target.value)}
                                                placeholder="Notas privadas que no verá el cliente..."
                                                rows={3}
                                                className="border-gray-300 focus:border-[#FF6B35] focus:ring-[#FF6B35]"
                                            />
                                        <p className="text-xs text-gray-500">
                                            Estas notas son solo para uso interno
                                        </p>
                                    </div>
                                </div>
                                </div>

                                {/* Botones de acción */}
                                <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
                                    <Link href="/propuestas">
                                        <Button 
                                            type="button" 
                                            variant="outline"
                                            className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2 font-medium"
                                        >
                                            <X className="mr-2 h-4 w-4" />
                                            Cancelar
                                        </Button>
                                    </Link>
                                    <Button 
                                        type="submit" 
                                        disabled={processing}
                                        className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white font-medium px-8 py-2 shadow-sm transition-colors"
                                    >
                                        <Save className="mr-2 h-4 w-4" />
                                        {processing ? 'Guardando...' : 'Crear Propuesta'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}