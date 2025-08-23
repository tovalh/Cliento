import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, X, User, Building2, FileText, ChevronDown } from 'lucide-react';

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
        title: 'Crear Cliente',
        href: '/clientes/create',
    },
];

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        empresa: '',
        direccion: '',
        ciudad: '',
        fecha_nacimiento: '',
        estado: 'activo' as 'activo' | 'inactivo',
        notas: '',
    });

    // Función para traducir mensajes de error
    const translateError = (error: string) => {
        const translations: { [key: string]: string } = {
            'The nombre field is required.': 'El campo nombre es obligatorio.',
            'The apellido field is required.': 'El campo apellido es obligatorio.',
            'The email field is required.': 'El campo email es obligatorio.',
            'The email must be a valid email address.': 'El email debe ser una dirección válida.',
            'The telefono field is required.': 'El campo teléfono es obligatorio.',
            'The empresa field is required.': 'El campo empresa es obligatorio.',
            'The direccion field is required.': 'El campo dirección es obligatorio.',
            'The ciudad field is required.': 'El campo ciudad es obligatorio.',
            'The fecha_nacimiento field is required.': 'El campo fecha de nacimiento es obligatorio.',
            'The estado field is required.': 'El campo estado es obligatorio.',
            'The notas field is required.': 'El campo notas es obligatorio.',
        };
        return translations[error] || error;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/clientes');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crear Cliente" />

            <div className="min-h-screen bg-[#F8F9FA]">
                {/* Header naranja */}
                <div className="bg-[#FF6B35]">
                    <div className="mx-auto px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-[28px] font-bold text-white">
                                    Crear Cliente
                                </h1>
                                <p className="text-white text-base opacity-90 mt-1">
                                    Agrega un nuevo cliente al sistema
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
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contenido principal */}
                <div className="mx-auto p-6">
                    {/* Tarjeta del formulario */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="w-full space-y-4">
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
                                            <Label htmlFor="nombre" className="text-sm font-semibold text-[#333]">
                                                Nombre *
                                            </Label>
                                            <Input
                                                id="nombre"
                                                placeholder="Ingresa el nombre..."
                                                value={data.nombre}
                                                onChange={(e) => setData('nombre', e.target.value)}
                                                className={`border-gray-300 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35] focus:ring-opacity-20 placeholder-gray-400 ${
                                                    errors.nombre ? 'border-red-500' : ''
                                                }`}
                                            />
                                            {errors.nombre && (
                                                <p className="text-sm text-red-500">{translateError(errors.nombre)}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="apellido" className="text-sm font-semibold text-[#333]">
                                                Apellido *
                                            </Label>
                                            <Input
                                                id="apellido"
                                                placeholder="Ingresa el apellido..."
                                                value={data.apellido}
                                                onChange={(e) => setData('apellido', e.target.value)}
                                                className={`border-gray-300 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35] focus:ring-opacity-20 placeholder-gray-400 ${
                                                    errors.apellido ? 'border-red-500' : ''
                                                }`}
                                            />
                                            {errors.apellido && (
                                                <p className="text-sm text-red-500">{translateError(errors.apellido)}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-sm font-semibold text-[#333]">
                                                Email *
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="ejemplo@correo.com"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                className={`border-gray-300 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35] focus:ring-opacity-20 placeholder-gray-400 ${
                                                    errors.email ? 'border-red-500' : ''
                                                }`}
                                            />
                                            {errors.email && (
                                                <p className="text-sm text-red-500">{translateError(errors.email)}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="telefono" className="text-sm font-semibold text-[#333]">
                                                Teléfono
                                            </Label>
                                            <Input
                                                id="telefono"
                                                placeholder="+1 (555) 123-4567"
                                                value={data.telefono}
                                                onChange={(e) => setData('telefono', e.target.value)}
                                                className={`border-gray-300 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35] focus:ring-opacity-20 placeholder-gray-400 ${
                                                    errors.telefono ? 'border-red-500' : ''
                                                }`}
                                            />
                                            {errors.telefono && (
                                                <p className="text-sm text-red-500">{translateError(errors.telefono)}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="fecha_nacimiento" className="text-sm font-semibold text-[#333]">
                                                Fecha de Nacimiento
                                            </Label>
                                            <Input
                                                id="fecha_nacimiento"
                                                type="date"
                                                value={data.fecha_nacimiento}
                                                onChange={(e) => setData('fecha_nacimiento', e.target.value)}
                                                className={`border-gray-300 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35] focus:ring-opacity-20 placeholder-gray-400 ${
                                                    errors.fecha_nacimiento ? 'border-red-500' : ''
                                                }`}
                                            />
                                            {errors.fecha_nacimiento && (
                                                <p className="text-sm text-red-500">{translateError(errors.fecha_nacimiento)}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="estado" className="text-sm font-semibold text-[#333]">
                                                Estado *
                                            </Label>
                                            <Select value={data.estado} onValueChange={(value) => setData('estado', value as 'activo' | 'inactivo')}>
                                                <SelectTrigger className={`border-gray-300 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35] focus:ring-opacity-20 ${
                                                    errors.estado ? 'border-red-500' : ''
                                                }`}>
                                                    <SelectValue placeholder="Selecciona un estado" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="activo">Activo</SelectItem>
                                                    <SelectItem value="inactivo">Inactivo</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.estado && (
                                                <p className="text-sm text-red-500">{translateError(errors.estado)}</p>
                                            )}
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
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="empresa" className="text-sm font-semibold text-[#333]">
                                                Empresa
                                            </Label>
                                            <Input
                                                id="empresa"
                                                placeholder="Nombre de la empresa..."
                                                value={data.empresa}
                                                onChange={(e) => setData('empresa', e.target.value)}
                                                className={`border-gray-300 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35] focus:ring-opacity-20 placeholder-gray-400 ${
                                                    errors.empresa ? 'border-red-500' : ''
                                                }`}
                                            />
                                            {errors.empresa && (
                                                <p className="text-sm text-red-500">{translateError(errors.empresa)}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="ciudad" className="text-sm font-semibold text-[#333]">
                                                Ciudad
                                            </Label>
                                            <Input
                                                id="ciudad"
                                                placeholder="Ciudad de residencia..."
                                                value={data.ciudad}
                                                onChange={(e) => setData('ciudad', e.target.value)}
                                                className={`border-gray-300 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35] focus:ring-opacity-20 placeholder-gray-400 ${
                                                    errors.ciudad ? 'border-red-500' : ''
                                                }`}
                                            />
                                            {errors.ciudad && (
                                                <p className="text-sm text-red-500">{translateError(errors.ciudad)}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="direccion" className="text-sm font-semibold text-[#333]">
                                                Dirección Completa
                                            </Label>
                                            <Input
                                                id="direccion"
                                                placeholder="Calle, número, ciudad, código postal..."
                                                value={data.direccion}
                                                onChange={(e) => setData('direccion', e.target.value)}
                                                className={`border-gray-300 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35] focus:ring-opacity-20 placeholder-gray-400 ${
                                                    errors.direccion ? 'border-red-500' : ''
                                                }`}
                                            />
                                            {errors.direccion && (
                                                <p className="text-sm text-red-500">{translateError(errors.direccion)}</p>
                                            )}
                                        </div>
                                    </div>
                                </CollapsibleContent>
                            </Collapsible>

                            {/* Información Adicional */}
                            <Collapsible defaultOpen className="border border-gray-200 rounded-lg">
                                <CollapsibleTrigger className="flex w-full items-center justify-between px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-5 w-5 text-[#FF6B35]" />
                                        <span className="text-lg font-semibold text-[#333]">Información Adicional</span>
                                    </div>
                                    <ChevronDown className="h-4 w-4 text-gray-500 transition-transform data-[state=open]:rotate-180" />
                                </CollapsibleTrigger>
                                <CollapsibleContent className="px-6 pb-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="notas" className="text-sm font-semibold text-[#333]">
                                            Notas
                                        </Label>
                                        <textarea
                                            id="notas"
                                            value={data.notas}
                                            onChange={(e) => setData('notas', e.target.value)}
                                            className={`w-full min-h-[120px] px-3 py-3 text-sm border border-gray-300 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35] focus:ring-opacity-20 bg-white rounded-md resize-vertical placeholder-gray-400 ${
                                                errors.notas ? 'border-red-500' : ''
                                            }`}
                                            placeholder="Notas adicionales sobre el cliente, preferencias, historial, etc..."
                                        />
                                        {errors.notas && (
                                            <p className="text-sm text-red-500">{translateError(errors.notas)}</p>
                                        )}
                                    </div>
                                </CollapsibleContent>
                            </Collapsible>
                        </div>

                        {/* Botones de acción */}
                        <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
                            <Link href="/clientes">
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
                                {processing ? 'Guardando...' : 'Crear Cliente'}
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