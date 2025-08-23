import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Cliente } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Eye, Pencil, Plus, Trash2, Search, Building, ChevronUp, ChevronDown, ChevronsUpDown, X } from 'lucide-react';
import { useState } from 'react';

type SortField = 'nombre' | 'empresa' | 'email' | 'estado' | 'created_at';
type SortOrder = 'asc' | 'desc';

interface Props {
    clientes: {
        data: Cliente[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filtros?: {
        buscar?: string;
        sort_field?: SortField;
        sort_order?: SortOrder;
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

export default function Index({ clientes, filtros }: Props) {
    const { data, setData } = useForm({
        buscar: filtros?.buscar || '',
    });

    const [sortField, setSortField] = useState<SortField | null>(filtros?.sort_field || null);
    const [sortOrder, setSortOrder] = useState<SortOrder>(filtros?.sort_order || 'asc');

    // Generar iniciales para avatar
    const getInitials = (nombre: string, apellido: string) => {
        return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
    };

    // Formatear fecha de último contacto
    const getLastContactText = (fecha: string) => {
        const date = new Date(fecha);
        const today = new Date();
        const diffInDays = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) return 'Hoy';
        if (diffInDays === 1) return 'Ayer';
        if (diffInDays < 7) return `Hace ${diffInDays} días`;
        if (diffInDays < 30) return `Hace ${Math.floor(diffInDays / 7)} semana${Math.floor(diffInDays / 7) > 1 ? 's' : ''}`;
        return `Hace ${Math.floor(diffInDays / 30)} mes${Math.floor(diffInDays / 30) > 1 ? 'es' : ''}`;
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/clientes', {
            buscar: data.buscar,
            sort_field: sortField,
            sort_order: sortOrder,
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };


    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
            router.delete(`/clientes/${id}`);
        }
    };

    const handleSort = (field: SortField) => {
        let newOrder: SortOrder = 'asc';

        if (sortField === field) {
            newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        }

        setSortField(field);
        setSortOrder(newOrder);

        router.get('/clientes', {
            buscar: data.buscar,
            sort_field: field,
            sort_order: newOrder,
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const getSortIcon = (field: SortField) => {
        if (sortField !== field) {
            return <ChevronsUpDown className="ml-1 h-3 w-3 text-gray-400" />;
        }

        return sortOrder === 'asc'
            ? <ChevronUp className="ml-1 h-3 w-3 text-[#FF6B35]" />
            : <ChevronDown className="ml-1 h-3 w-3 text-[#FF6B35]" />;
    };


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Clientes" />

            <div className="min-h-screen bg-[#F8F9FA]">
                {/* Header naranja */}
                <div className="bg-[#FF6B35]">
                    <div className="mx-auto px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-[28px] font-bold text-white">
                                    Clientes
                                </h1>
                                <p className="text-white text-base opacity-90 mt-1">
                                    Gestiona la información de tus clientes
                                </p>
                            </div>

                            <div className="flex items-center space-x-4">
                                {/* Barra de búsqueda */}
                                <form onSubmit={handleSearch} className="flex">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            type="text"
                                            placeholder="Buscar clientes..."
                                            value={data.buscar}
                                            onChange={(e) => setData('buscar', e.target.value)}
                                            onBlur={() => {
                                                router.get('/clientes', {
                                                    buscar: data.buscar,
                                                    sort_field: sortField,
                                                    sort_order: sortOrder,
                                                }, {
                                                    preserveState: true,
                                                    preserveScroll: true
                                                });
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleSearch(e);
                                                }
                                            }}
                                            className="pl-10 w-[300px] bg-white border-0"
                                        />
                                    </div>
                                </form>


                                {/* Botón Nuevo Cliente */}
                                <Link href="/clientes/create">
                                    <Button className="bg-white text-[#FF6B35] hover:bg-gray-50 hover:text-[#FF6B35] font-medium px-6 py-3 rounded-lg transition-colors cursor-pointer shadow-sm">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Nuevo Cliente
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>



                {/* Contenido principal */}
                <div className=" mx-auto p-6">
                    {/* Tabla de clientes */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        {clientes.data.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="text-gray-400 mb-4">
                                    <Search className="h-16 w-16 mx-auto" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                                    No se encontraron clientes
                                </h3>
                                <p className="text-gray-500 mb-6">
                                    {data.buscar
                                        ? 'Ajusta la búsqueda o agrega nuevos clientes.'
                                        : 'Comienza agregando tu primer cliente.'
                                    }
                                </p>
                                <Link href="/clientes/create">
                                    <Button className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white hover:text-white transition-colors cursor-pointer">
                                        <Plus className="mr-2 h-4 w-4 text-white" />
                                        Crear primer cliente
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <>
                                {/* Header de tabla */}
                                <div className="bg-[#E5E7EB] px-5 py-4 border-b border-[#E5E7EB]">
                                    <div className="grid grid-cols-12 gap-4 items-center">
                                        <div className="col-span-4 lg:col-span-3">
                                            <button
                                                onClick={() => handleSort('nombre')}
                                                className="flex items-center text-[#333] font-semibold text-sm hover:text-[#FF6B35] transition-colors cursor-pointer"
                                            >
                                                NOMBRE
                                                {getSortIcon('nombre')}
                                            </button>
                                        </div>
                                        <div className="hidden lg:block lg:col-span-2">
                                            <button
                                                onClick={() => handleSort('empresa')}
                                                className="flex items-center text-[#333] font-semibold text-sm hover:text-[#FF6B35] transition-colors cursor-pointer"
                                            >
                                                EMPRESA
                                                {getSortIcon('empresa')}
                                            </button>
                                        </div>
                                        <div className="hidden md:block md:col-span-3">
                                            <button
                                                onClick={() => handleSort('email')}
                                                className="flex items-center text-[#333] font-semibold text-sm hover:text-[#FF6B35] transition-colors cursor-pointer"
                                            >
                                                EMAIL
                                                {getSortIcon('email')}
                                            </button>
                                        </div>
                                        <div className="col-span-2 lg:col-span-1">
                                            <button
                                                onClick={() => handleSort('estado')}
                                                className="flex items-center text-[#333] font-semibold text-sm hover:text-[#FF6B35] transition-colors cursor-pointer"
                                            >
                                                ESTADO
                                                {getSortIcon('estado')}
                                            </button>
                                        </div>
                                        <div className="hidden lg:block lg:col-span-2">
                                            <button
                                                onClick={() => handleSort('created_at')}
                                                className="flex items-center text-[#333] font-semibold text-sm hover:text-[#FF6B35] transition-colors cursor-pointer"
                                            >
                                                ÚLTIMO CONTACTO
                                                {getSortIcon('created_at')}
                                            </button>
                                        </div>
                                        <div className="col-span-6 lg:col-span-1 text-right">
                                            <span className="text-[#333] font-semibold text-sm">ACCIONES</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Filas de datos */}
                                <div>
                                    {clientes.data.map((cliente, index) => (
                                        <div
                                            key={cliente.id}
                                            className={`px-5 py-5 border-b border-[#E5E7EB] hover:bg-[#F1F5F9] cursor-pointer transition-colors ${
                                                index % 2 === 0 ? 'bg-[#F8F9FA]' : 'bg-[#FFFFFF]'
                                            }`}
                                            onClick={() => router.visit(`/clientes/${cliente.id}`)}
                                        >
                                            <div className="grid grid-cols-12 gap-4 items-center">
                                                {/* Columna Cliente */}
                                                <div className="col-span-4 lg:col-span-3 flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-[#FF6B35] rounded-full flex items-center justify-center flex-shrink-0">
                                                        <span className="text-white font-semibold text-sm">
                                                            {getInitials(cliente.nombre, cliente.apellido)}
                                                        </span>
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <h3 className="text-base font-bold text-[#333] truncate">
                                                            {cliente.nombre} {cliente.apellido}
                                                        </h3>
                                                        <div className="lg:hidden">
                                                            {cliente.empresa && (
                                                                <p className="text-sm text-[#666] truncate">
                                                                    {cliente.empresa}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Columna Empresa */}
                                                <div className="hidden lg:block lg:col-span-2">
                                                    {cliente.empresa ? (
                                                        <div className="flex items-center gap-2">
                                                            <Building className="h-3 w-3 text-[#666] flex-shrink-0" />
                                                            <span className="text-sm text-[#666] truncate">
                                                                {cliente.empresa}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm text-[#666]">-</span>
                                                    )}
                                                </div>

                                                {/* Columna Email */}
                                                <div className="hidden md:block md:col-span-3">
                                                    <span className="text-sm text-[#666] block">
                                                        {cliente.email}
                                                    </span>
                                                </div>

                                                {/* Columna Estado */}
                                                <div className="col-span-2 lg:col-span-1">
                                                    <Badge
                                                        className={`rounded-xl px-3 py-1 text-xs font-medium ${
                                                            cliente.estado === 'activo'
                                                                ? "bg-[#059669] text-white hover:bg-[#059669]"
                                                                : "bg-[#6B7280] text-white hover:bg-[#6B7280]"
                                                        }`}
                                                    >
                                                        {cliente.estado === 'activo' ? 'Activo' : 'Inactivo'}
                                                    </Badge>
                                                </div>

                                                {/* Columna Último contacto */}
                                                <div className="hidden lg:block lg:col-span-2">
                                                    <span className="text-[13px] text-[#666]">
                                                        {getLastContactText(cliente.created_at)}
                                                    </span>
                                                </div>

                                                {/* Columna Acciones */}
                                                <div className="col-span-6 lg:col-span-1 flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                                                    <Link href={`/clientes/${cliente.id}`}>
                                                        <button
                                                            className="p-1 text-[#666] hover:text-[#FF6B35] transition-colors"
                                                            title="Ver cliente"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </button>
                                                    </Link>

                                                    <Link href={`/clientes/${cliente.id}/edit`}>
                                                        <button
                                                            className="p-1 text-[#666] hover:text-[#FF6B35] transition-colors"
                                                            title="Editar cliente"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </button>
                                                    </Link>

                                                    <button
                                                        onClick={() => handleDelete(cliente.id)}
                                                        className="p-1 text-[#666] hover:text-[#FF6B35] transition-colors"
                                                        title="Eliminar cliente"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Paginación */}
                    {clientes.last_page > 1 && (
                        <div className="flex justify-center mt-6">
                            <div className="flex items-center space-x-2 bg-white rounded-lg shadow-sm p-2">
                                {Array.from({ length: clientes.last_page }, (_, i) => i + 1).map((page) => (
                                    <Link key={page} href={`/clientes?page=${page}`}>
                                        <Button
                                            variant={page === clientes.current_page ? "default" : "ghost"}
                                            size="sm"
                                            className={page === clientes.current_page ? "bg-[#FF6B35] hover:bg-[#FF6B35]/90 transition-colors cursor-pointer" : "hover:bg-gray-100 transition-colors cursor-pointer"}
                                        >
                                            {page}
                                        </Button>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
