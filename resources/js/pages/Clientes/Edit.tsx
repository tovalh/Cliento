import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Cliente } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, X } from 'lucide-react';

interface Props {
    cliente: Cliente;
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
        title: 'Editar Cliente',
        href: '#',
    },
];

export default function Edit({ cliente }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        nombre: cliente.nombre || '',
        apellido: cliente.apellido || '',
        email: cliente.email || '',
        telefono: cliente.telefono || '',
        empresa: cliente.empresa || '',
        direccion: cliente.direccion || '',
        ciudad: cliente.ciudad || '',
        fecha_nacimiento: cliente.fecha_nacimiento || '',
        estado: cliente.estado || 'activo' as 'activo' | 'inactivo',
        notas: cliente.notas || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/clientes/${cliente.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Editar ${cliente.nombre} ${cliente.apellido}`} />

            <div className="min-h-screen bg-[#F8F9FA]">
                {/* Header naranja */}
                <div className="bg-[#FF6B35]">
                    <div className="mx-auto px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-[28px] font-bold text-white">
                                    Editar Cliente
                                </h1>
                                <p className="text-white text-base opacity-90 mt-1">
                                    Modifica la información de {cliente.nombre} {cliente.apellido}
                                </p>
                            </div>

                            <div className="flex items-center space-x-4">
                                {/* Botón Volver */}
                                <Link href={`/clientes/${cliente.id}`}>
                                    <Button className="bg-white text-[#FF6B35] hover:bg-gray-50 hover:text-[#FF6B35] font-medium px-6 py-3 rounded-lg transition-colors cursor-pointer shadow-sm">
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Volver al Cliente
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
                        {/* Información Personal */}
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold text-[#333] mb-6 pb-2 border-b border-gray-200">
                                Información Personal
                            </h2>
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
                                        className={`border-gray-300 focus:border-[#FF6B35] focus:ring-[#FF6B35] ${
                                            errors.nombre ? 'border-red-500' : ''
                                        }`}
                                    />
                                    {errors.nombre && (
                                        <p className="text-sm text-red-500">{errors.nombre}</p>
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
                                        className={`border-gray-300 focus:border-[#FF6B35] focus:ring-[#FF6B35] ${
                                            errors.apellido ? 'border-red-500' : ''
                                        }`}
                                    />
                                    {errors.apellido && (
                                        <p className="text-sm text-red-500">{errors.apellido}</p>
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
                                        className={`border-gray-300 focus:border-[#FF6B35] focus:ring-[#FF6B35] ${
                                            errors.email ? 'border-red-500' : ''
                                        }`}
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-red-500">{errors.email}</p>
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
                                        className={`border-gray-300 focus:border-[#FF6B35] focus:ring-[#FF6B35] ${
                                            errors.telefono ? 'border-red-500' : ''
                                        }`}
                                    />
                                    {errors.telefono && (
                                        <p className="text-sm text-red-500">{errors.telefono}</p>
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
                                        className={`border-gray-300 focus:border-[#FF6B35] focus:ring-[#FF6B35] ${
                                            errors.fecha_nacimiento ? 'border-red-500' : ''
                                        }`}
                                    />
                                    {errors.fecha_nacimiento && (
                                        <p className="text-sm text-red-500">{errors.fecha_nacimiento}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="estado" className="text-sm font-semibold text-[#333]">
                                        Estado *
                                    </Label>
                                    <Select value={data.estado} onValueChange={(value) => setData('estado', value as 'activo' | 'inactivo')}>
                                        <SelectTrigger className={`border-gray-300 focus:border-[#FF6B35] focus:ring-[#FF6B35] ${
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
                                        <p className="text-sm text-red-500">{errors.estado}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Información Empresarial */}
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold text-[#333] mb-6 pb-2 border-b border-gray-200">
                                Información Empresarial
                            </h2>
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
                                        className={`border-gray-300 focus:border-[#FF6B35] focus:ring-[#FF6B35] ${
                                            errors.empresa ? 'border-red-500' : ''
                                        }`}
                                    />
                                    {errors.empresa && (
                                        <p className="text-sm text-red-500">{errors.empresa}</p>
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
                                        className={`border-gray-300 focus:border-[#FF6B35] focus:ring-[#FF6B35] ${
                                            errors.ciudad ? 'border-red-500' : ''
                                        }`}
                                    />
                                    {errors.ciudad && (
                                        <p className="text-sm text-red-500">{errors.ciudad}</p>
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
                                        className={`border-gray-300 focus:border-[#FF6B35] focus:ring-[#FF6B35] ${
                                            errors.direccion ? 'border-red-500' : ''
                                        }`}
                                    />
                                    {errors.direccion && (
                                        <p className="text-sm text-red-500">{errors.direccion}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Información Adicional */}
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold text-[#333] mb-6 pb-2 border-b border-gray-200">
                                Información Adicional
                            </h2>
                            <div className="space-y-2">
                                <Label htmlFor="notas" className="text-sm font-semibold text-[#333]">
                                    Notas
                                </Label>
                                <textarea
                                    id="notas"
                                    value={data.notas}
                                    onChange={(e) => setData('notas', e.target.value)}
                                    className={`w-full min-h-[120px] px-3 py-3 text-sm border border-gray-300 focus:border-[#FF6B35] focus:ring-[#FF6B35] bg-white rounded-md resize-vertical ${
                                        errors.notas ? 'border-red-500' : ''
                                    }`}
                                    placeholder="Notas adicionales sobre el cliente, preferencias, historial, etc..."
                                />
                                {errors.notas && (
                                    <p className="text-sm text-red-500">{errors.notas}</p>
                                )}
                            </div>
                        </div>

                        {/* Botones de acción */}
                        <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
                            <Link href={`/clientes/${cliente.id}`}>
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
                                {processing ? 'Guardando...' : 'Actualizar Cliente'}
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