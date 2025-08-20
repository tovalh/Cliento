import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import AddNotaForm from '@/components/add-nota-form';
import AddSeguimientoForm from '@/components/add-seguimiento-form';
import Timeline from '@/components/timeline';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Cliente, type Nota } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Calendar, Mail, MapPin, Phone, Trash2, User, Edit, MessageSquare } from 'lucide-react';

interface Props {
    cliente: Cliente;
    notas: Nota[];
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

export default function Show({ cliente, notas }: Props) {
    const handleDelete = () => {
        if (confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
            router.delete(`/clientes/${cliente.id}`);
        }
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
            
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/clientes">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div className="flex-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold tracking-tight">
                                {cliente.nombre} {cliente.apellido}
                            </h1>
                            <Badge 
                                variant={cliente.estado === 'activo' ? 'default' : 'secondary'}
                            >
                                {cliente.estado}
                            </Badge>
                        </div>
                        <p className="text-muted-foreground">
                            Cliente desde {formatDate(cliente.created_at)}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link href={`/clientes/${cliente.id}/edit`}>
                            <Button>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                            </Button>
                        </Link>
                        <Button 
                            variant="destructive" 
                            onClick={handleDelete}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Información del Cliente */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="p-6">
                            <h2 className="text-lg font-semibold mb-4">Información Personal</h2>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="font-medium">{cliente.nombre} {cliente.apellido}</p>
                                        <p className="text-sm text-muted-foreground">Nombre completo</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="font-medium">{cliente.email}</p>
                                        <p className="text-sm text-muted-foreground">Email</p>
                                    </div>
                                </div>

                                {cliente.telefono && (
                                    <div className="flex items-center gap-3">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="font-medium">{cliente.telefono}</p>
                                            <p className="text-sm text-muted-foreground">Teléfono</p>
                                        </div>
                                    </div>
                                )}

                                {cliente.fecha_nacimiento && (
                                    <div className="flex items-center gap-3">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="font-medium">{formatDate(cliente.fecha_nacimiento)}</p>
                                            <p className="text-sm text-muted-foreground">Fecha de nacimiento</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>

                        <Card className="p-6">
                            <h2 className="text-lg font-semibold mb-4">Información Empresarial</h2>
                            <div className="space-y-4">
                                {cliente.empresa && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Empresa</p>
                                        <p className="font-medium">{cliente.empresa}</p>
                                    </div>
                                )}

                                {(cliente.direccion || cliente.ciudad) && (
                                    <div className="flex items-start gap-3">
                                        <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                                        <div>
                                            <div className="space-y-1">
                                                {cliente.direccion && (
                                                    <p className="font-medium">{cliente.direccion}</p>
                                                )}
                                                {cliente.ciudad && (
                                                    <p className="text-sm text-muted-foreground">
                                                        {cliente.ciudad}
                                                    </p>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground">Ubicación</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>

                        {cliente.notas && (
                            <Card className="p-6">
                                <h2 className="text-lg font-semibold mb-4">Notas del Cliente</h2>
                                <div className="bg-muted/50 rounded-lg p-4">
                                    <p className="text-sm whitespace-pre-wrap">{cliente.notas}</p>
                                </div>
                            </Card>
                        )}

                        <Card className="p-6">
                            <h2 className="text-lg font-semibold mb-4">Información del Sistema</h2>
                            <div className="space-y-4 text-sm">
                                <div>
                                    <p className="text-muted-foreground">Fecha de creación</p>
                                    <p className="font-medium">{formatDate(cliente.created_at)}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Última actualización</p>
                                    <p className="font-medium">{formatDate(cliente.updated_at)}</p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6">
                            <AddSeguimientoForm clienteId={cliente.id} />
                        </Card>
                    </div>

                    {/* Timeline y Notas */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <MessageSquare className="h-5 w-5 text-primary" />
                                <h2 className="text-lg font-semibold">Timeline & Notas</h2>
                                <Badge variant="secondary" className="ml-auto">
                                    {notas.length} {notas.length === 1 ? 'nota' : 'notas'}
                                </Badge>
                            </div>
                            
                            <div className="space-y-6">
                                <AddNotaForm clienteId={cliente.id} />
                                <Timeline notas={notas} />
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}