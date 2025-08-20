import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Cliente } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Eye, Mail, Pencil, Plus, Trash2 } from 'lucide-react';

interface Props {
    clientes: {
        data: Cliente[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
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
];

export default function Index({ clientes }: Props) {
    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
            router.delete(`/clientes/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Clientes" />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Clientes</h1>
                        <p className="text-muted-foreground">
                            Gestiona la información de tus clientes
                        </p>
                    </div>
                    <Link href="/clientes/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Nuevo Cliente
                        </Button>
                    </Link>
                </div>

                <div className="grid gap-4">
                    {clientes.data.length === 0 ? (
                        <Card className="p-8 text-center">
                            <p className="text-muted-foreground">No hay clientes registrados</p>
                            <Link href="/clientes/create" className="mt-4 inline-block">
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Crear primer cliente
                                </Button>
                            </Link>
                        </Card>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {clientes.data.map((cliente) => (
                                <Card key={cliente.id} className="p-6 cursor-pointer hover:shadow-md transition-shadow">
                                    <Link href={`/clientes/${cliente.id}`} className="block">
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-2 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-semibold">
                                                        {cliente.nombre} {cliente.apellido}
                                                    </h3>
                                                    <Badge 
                                                        variant={cliente.estado === 'activo' ? 'default' : 'secondary'}
                                                    >
                                                        {cliente.estado}
                                                    </Badge>
                                                </div>
                                                
                                                <div className="space-y-1 text-sm text-muted-foreground">
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="h-3 w-3" />
                                                        {cliente.email}
                                                    </div>
                                                    {cliente.empresa && (
                                                        <p>📍 {cliente.empresa}</p>
                                                    )}
                                                    {cliente.telefono && (
                                                        <p>📞 {cliente.telefono}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                    
                                    <div className="flex gap-2 mt-4" onClick={(e) => e.stopPropagation()}>
                                        <Link href={`/clientes/${cliente.id}`}>
                                            <Button variant="outline" size="sm">
                                                <Eye className="h-3 w-3" />
                                            </Button>
                                        </Link>
                                        <Link href={`/clientes/${cliente.id}/edit`}>
                                            <Button variant="outline" size="sm">
                                                <Pencil className="h-3 w-3" />
                                            </Button>
                                        </Link>
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(cliente.id);
                                            }}
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {clientes.last_page > 1 && (
                    <div className="flex justify-center gap-2">
                        {Array.from({ length: clientes.last_page }, (_, i) => i + 1).map((page) => (
                            <Link key={page} href={`/clientes?page=${page}`}>
                                <Button 
                                    variant={page === clientes.current_page ? "default" : "outline"}
                                    size="sm"
                                >
                                    {page}
                                </Button>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}