import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/clientes');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crear Cliente" />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <a href="/clientes">
                            <ArrowLeft className="h-4 w-4" />
                        </a>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Crear Cliente</h1>
                        <p className="text-muted-foreground">
                            Agrega un nuevo cliente al sistema
                        </p>
                    </div>
                </div>

                <Card className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="nombre">Nombre *</Label>
                                <Input
                                    id="nombre"
                                    value={data.nombre}
                                    onChange={(e) => setData('nombre', e.target.value)}
                                    className={errors.nombre ? 'border-red-500' : ''}
                                />
                                {errors.nombre && (
                                    <p className="text-sm text-red-500">{errors.nombre}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="apellido">Apellido *</Label>
                                <Input
                                    id="apellido"
                                    value={data.apellido}
                                    onChange={(e) => setData('apellido', e.target.value)}
                                    className={errors.apellido ? 'border-red-500' : ''}
                                />
                                {errors.apellido && (
                                    <p className="text-sm text-red-500">{errors.apellido}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className={errors.email ? 'border-red-500' : ''}
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-500">{errors.email}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="telefono">Teléfono</Label>
                                <Input
                                    id="telefono"
                                    value={data.telefono}
                                    onChange={(e) => setData('telefono', e.target.value)}
                                    className={errors.telefono ? 'border-red-500' : ''}
                                />
                                {errors.telefono && (
                                    <p className="text-sm text-red-500">{errors.telefono}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="empresa">Empresa</Label>
                                <Input
                                    id="empresa"
                                    value={data.empresa}
                                    onChange={(e) => setData('empresa', e.target.value)}
                                    className={errors.empresa ? 'border-red-500' : ''}
                                />
                                {errors.empresa && (
                                    <p className="text-sm text-red-500">{errors.empresa}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="fecha_nacimiento">Fecha de Nacimiento</Label>
                                <Input
                                    id="fecha_nacimiento"
                                    type="date"
                                    value={data.fecha_nacimiento}
                                    onChange={(e) => setData('fecha_nacimiento', e.target.value)}
                                    className={errors.fecha_nacimiento ? 'border-red-500' : ''}
                                />
                                {errors.fecha_nacimiento && (
                                    <p className="text-sm text-red-500">{errors.fecha_nacimiento}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="ciudad">Ciudad</Label>
                                <Input
                                    id="ciudad"
                                    value={data.ciudad}
                                    onChange={(e) => setData('ciudad', e.target.value)}
                                    className={errors.ciudad ? 'border-red-500' : ''}
                                />
                                {errors.ciudad && (
                                    <p className="text-sm text-red-500">{errors.ciudad}</p>
                                )}
                            </div>

                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="direccion">Dirección</Label>
                            <Input
                                id="direccion"
                                value={data.direccion}
                                onChange={(e) => setData('direccion', e.target.value)}
                                className={errors.direccion ? 'border-red-500' : ''}
                            />
                            {errors.direccion && (
                                <p className="text-sm text-red-500">{errors.direccion}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="estado">Estado *</Label>
                            <select
                                id="estado"
                                value={data.estado}
                                onChange={(e) => setData('estado', e.target.value as 'activo' | 'inactivo')}
                                className="w-full h-10 px-3 py-2 text-sm border border-input bg-background rounded-md"
                            >
                                <option value="activo">Activo</option>
                                <option value="inactivo">Inactivo</option>
                            </select>
                            {errors.estado && (
                                <p className="text-sm text-red-500">{errors.estado}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notas">Notas</Label>
                            <textarea
                                id="notas"
                                value={data.notas}
                                onChange={(e) => setData('notas', e.target.value)}
                                className="w-full min-h-[100px] px-3 py-2 text-sm border border-input bg-background rounded-md resize-vertical"
                                placeholder="Notas adicionales sobre el cliente..."
                            />
                            {errors.notas && (
                                <p className="text-sm text-red-500">{errors.notas}</p>
                            )}
                        </div>

                        <div className="flex gap-4">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Guardando...' : 'Crear Cliente'}
                            </Button>
                            <Button variant="outline" type="button" asChild>
                                <a href="/clientes">Cancelar</a>
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}