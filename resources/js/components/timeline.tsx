import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type Nota, type Seguimiento, type Propuesta, type Proyecto } from '@/types';
import { router } from '@inertiajs/react';
import { Calendar, Edit2, Star, Trash2, User, FileText, Phone, Users, Mail, CheckCircle2, Briefcase, FolderOpen, Filter, CalendarDays } from 'lucide-react';
import { useState } from 'react';

interface Props {
    notas: Nota[];
    seguimientos?: Seguimiento[];
    propuestas?: Propuesta[];
    proyectos?: Proyecto[];
}

interface EditingNota {
    id: number;
    contenido: string;
    importante: boolean;
}

interface EditingSeguimiento {
    id: number;
    titulo: string;
    descripcion: string;
    fecha_seguimiento: string;
    prioridad: 'baja' | 'media' | 'alta';
    tipo: 'llamada' | 'email' | 'reunion' | 'propuesta' | 'otro';
}

export default function Timeline({ notas, seguimientos = [], propuestas = [], proyectos = [] }: Props) {
    const [editingNota, setEditingNota] = useState<EditingNota | null>(null);
    const [editingSeguimiento, setEditingSeguimiento] = useState<EditingSeguimiento | null>(null);
    const [filters, setFilters] = useState({
        tipo: 'todos', // todos, notas, seguimientos, propuestas, proyectos
        soloImportantes: false,
        fechaDesde: '',
        fechaHasta: ''
    });
    
    // Combinar y ordenar notas, seguimientos, propuestas y proyectos por fecha
    const allTimelineItems = [
        ...notas.map(nota => ({ ...nota, itemType: 'nota' as const })),
        ...seguimientos.map(seguimiento => ({ ...seguimiento, itemType: 'seguimiento' as const })),
        ...propuestas.map(propuesta => ({ ...propuesta, itemType: 'propuesta' as const })),
        ...proyectos.map(proyecto => ({ ...proyecto, itemType: 'proyecto' as const }))
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    // Aplicar filtros
    const timelineItems = allTimelineItems.filter((item) => {
        // Filtro por tipo
        if (filters.tipo !== 'todos') {
            const tipoMap = {
                'notas': 'nota',
                'seguimientos': 'seguimiento', 
                'propuestas': 'propuesta',
                'proyectos': 'proyecto'
            };
            if (item.itemType !== tipoMap[filters.tipo as keyof typeof tipoMap]) {
                return false;
            }
        }
        
        // Filtro por importantes (solo aplica a notas)
        if (filters.soloImportantes) {
            if (item.itemType === 'nota' && !item.importante) {
                return false;
            }
        }
        
        // Filtro por fecha desde
        if (filters.fechaDesde) {
            const itemDate = new Date(item.created_at);
            const filterDate = new Date(filters.fechaDesde);
            if (itemDate < filterDate) {
                return false;
            }
        }
        
        // Filtro por fecha hasta
        if (filters.fechaHasta) {
            const itemDate = new Date(item.created_at);
            const filterDate = new Date(filters.fechaHasta);
            filterDate.setHours(23, 59, 59); // Final del día
            if (itemDate > filterDate) {
                return false;
            }
        }
        
        return true;
    });

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
        
        if (diffInHours < 1) {
            const diffInMinutes = Math.floor(diffInHours * 60);
            return `Hace ${diffInMinutes} minutos`;
        } else if (diffInHours < 24) {
            return `Hace ${Math.floor(diffInHours)} horas`;
        } else if (diffInHours < 48) {
            return 'Ayer';
        } else {
            return date.toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    };

    const getTipoIcon = (tipo: string) => {
        return FileText; // Todas las notas usan el mismo icono
    };

    const getTipoColor = (itemType?: string) => {
        if (itemType === 'propuesta') {
            return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
        }
        if (itemType === 'proyecto') {
            return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
        }
        // Todas las notas tendrán el mismo color
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    };

    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de que quieres eliminar esta nota?')) {
            router.delete(`/notas/${id}`);
        }
    };

    const handleEdit = (nota: Nota) => {
        setEditingNota({
            id: nota.id,
            contenido: nota.contenido,
            importante: nota.importante
        });
    };

    const handleUpdate = () => {
        if (!editingNota) return;

        router.put(`/notas/${editingNota.id}`, {
            contenido: editingNota.contenido,
            importante: editingNota.importante
        }, {
            onSuccess: () => setEditingNota(null)
        });
    };

    const handleToggleSeguimiento = (seguimientoId: number, completed: boolean) => {
        router.post(`/seguimientos/${seguimientoId}/completar`, {
            completado: completed
        });
    };

    const handleEditSeguimiento = (seguimiento: any) => {
        setEditingSeguimiento({
            id: seguimiento.id,
            titulo: seguimiento.titulo,
            descripcion: seguimiento.descripcion || '',
            fecha_seguimiento: seguimiento.fecha_seguimiento,
            prioridad: seguimiento.prioridad,
            tipo: seguimiento.tipo
        });
    };

    const handleUpdateSeguimiento = () => {
        if (!editingSeguimiento) return;

        router.put(`/seguimientos/${editingSeguimiento.id}`, {
            titulo: editingSeguimiento.titulo,
            descripcion: editingSeguimiento.descripcion,
            fecha_seguimiento: editingSeguimiento.fecha_seguimiento,
            prioridad: editingSeguimiento.prioridad,
            tipo: editingSeguimiento.tipo
        }, {
            onSuccess: () => setEditingSeguimiento(null)
        });
    };

    const handleEditItem = (item: any) => {
        if (item.itemType === 'nota') {
            handleEdit(item);
        } else if (item.itemType === 'seguimiento') {
            handleEditSeguimiento(item);
        } else if (item.itemType === 'propuesta') {
            const currentUrl = window.location.href;
            router.visit(`/propuestas/${item.id}/edit?return_to=${encodeURIComponent(currentUrl)}`);
        } else if (item.itemType === 'proyecto') {
            const currentUrl = window.location.href;
            router.visit(`/proyectos/${item.id}/edit?return_to=${encodeURIComponent(currentUrl)}`);
        }
    };

    const handleDeleteItem = (item: any) => {
        if (item.itemType === 'nota') {
            handleDelete(item.id);
        } else if (item.itemType === 'seguimiento') {
            if (confirm('¿Estás seguro de que quieres eliminar este seguimiento?')) {
                router.delete(`/seguimientos/${item.id}`);
            }
        } else if (item.itemType === 'propuesta') {
            if (confirm('¿Estás seguro de que quieres eliminar esta propuesta?')) {
                router.delete(`/propuestas/${item.id}`);
            }
        } else if (item.itemType === 'proyecto') {
            if (confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
                router.delete(`/proyectos/${item.id}`);
            }
        }
    };


    return (
        <div className="space-y-4">
            {/* Filtros sutiles */}
            <div className="flex flex-wrap gap-3 text-sm text-gray-600 border-b border-gray-100 pb-4">
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span className="font-medium">Filtros:</span>
                </div>
                
                <select 
                    value={filters.tipo}
                    onChange={(e) => setFilters({...filters, tipo: e.target.value})}
                    className="px-2 py-1 border border-gray-300 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35] focus:ring-opacity-20 rounded text-xs bg-white hover:bg-gray-50"
                >
                    <option value="todos">Todos</option>
                    <option value="notas">Solo Notas</option>
                    <option value="seguimientos">Solo Seguimientos</option>
                    <option value="propuestas">Solo Propuestas</option>
                    <option value="proyectos">Solo Proyectos</option>
                </select>
                
                <label className="flex items-center gap-1">
                    <input 
                        type="checkbox" 
                        checked={filters.soloImportantes}
                        onChange={(e) => setFilters({...filters, soloImportantes: e.target.checked})}
                        className="h-3 w-3 text-[#FF6B35] focus:ring-[#FF6B35] border-gray-300 rounded"
                    />
                    <Star className="h-3 w-3 text-orange-500" />
                    <span className="text-xs">Solo importantes</span>
                </label>
                
                <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    <input 
                        type="date" 
                        value={filters.fechaDesde}
                        onChange={(e) => setFilters({...filters, fechaDesde: e.target.value})}
                        className="px-2 py-1 border border-gray-300 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35] focus:ring-opacity-20 rounded text-xs bg-white"
                        placeholder="Desde"
                    />
                    <span className="text-xs">-</span>
                    <input 
                        type="date" 
                        value={filters.fechaHasta}
                        onChange={(e) => setFilters({...filters, fechaHasta: e.target.value})}
                        className="px-2 py-1 border border-gray-300 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35] focus:ring-opacity-20 rounded text-xs bg-white"
                        placeholder="Hasta"
                    />
                </div>
                
                {(filters.tipo !== 'todos' || filters.soloImportantes || filters.fechaDesde || filters.fechaHasta) && (
                    <button
                        onClick={() => setFilters({ tipo: 'todos', soloImportantes: false, fechaDesde: '', fechaHasta: '' })}
                        className="text-xs text-gray-500 hover:text-gray-700 underline"
                    >
                        Limpiar filtros
                    </button>
                )}
                
                <span className="text-xs text-gray-400 ml-auto">
                    {timelineItems.length} de {allTimelineItems.length} elementos
                </span>
            </div>

            {timelineItems.length === 0 ? (
                <Card className="p-8 text-center">
                    <p className="text-muted-foreground">
                        {allTimelineItems.length === 0 
                            ? "No hay actividad registrada para este cliente"
                            : "No hay actividad que coincida con los filtros seleccionados"
                        }
                    </p>
                </Card>
            ) : (
                <div className="space-y-4">
            {timelineItems.map((item, index) => (
                <div key={`${item.itemType}-${item.id}`} className="relative">
                    {/* Timeline line */}
                    {index !== timelineItems.length - 1 && (
                        <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-border"></div>
                    )}
                    
                    <div className="flex gap-4">
                        
                        {/* Timeline dot */}
                        <div 
                            className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-background ${
                                item.itemType === 'seguimiento' 
                                    ? item.completado
                                        ? 'bg-emerald-100 text-emerald-800 cursor-pointer hover:bg-emerald-200 transition-colors'
                                        : 'bg-orange-100 text-orange-800 cursor-pointer hover:bg-orange-200 transition-colors'
                                    : item.itemType === 'propuesta'
                                    ? 'bg-indigo-100 text-indigo-800'
                                    : item.itemType === 'proyecto'
                                    ? 'bg-purple-100 text-purple-800'
                                    : getTipoColor(item.itemType)
                            }`}
                            onClick={item.itemType === 'seguimiento' ? () => handleToggleSeguimiento(item.id, !item.completado) : undefined}
                        >
                            {(() => {
                                if (item.itemType === 'seguimiento') {
                                    return item.completado 
                                        ? <CheckCircle2 className="h-5 w-5" />
                                        : <Calendar className="h-5 w-5" />;
                                } else if (item.itemType === 'propuesta') {
                                    return <Briefcase className="h-5 w-5" />;
                                } else if (item.itemType === 'proyecto') {
                                    return <FolderOpen className="h-5 w-5" />;
                                } else {
                                    const IconComponent = getTipoIcon(item.tipo);
                                    return <IconComponent className="h-5 w-5" />;
                                }
                            })()}
                        </div>

                        {/* Content */}
                        <Card className="flex-1 p-4 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => handleEditItem(item)}>
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        {item.itemType === 'seguimiento' ? (
                                            <>
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                                    <Calendar className="h-3 w-3 mr-1" />
                                                    Seguimiento - {item.tipo.charAt(0).toUpperCase() + item.tipo.slice(1)}
                                                </span>
                                                {item.completado ? (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                                        <CheckCircle2 className="w-3 h-3 mr-1" />
                                                        Completado
                                                    </span>
                                                ) : (
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                        item.prioridad === 'alta' ? 'bg-red-100 text-red-800' :
                                                        item.prioridad === 'media' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-green-100 text-green-800'
                                                    }`}>
                                                        {item.prioridad.charAt(0).toUpperCase() + item.prioridad.slice(1)}
                                                    </span>
                                                )}
                                            </>
                                        ) : item.itemType === 'propuesta' ? (
                                            <>
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                                    <Briefcase className="h-3 w-3 mr-1" />
                                                    Propuesta
                                                </span>
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                    item.estado === 'aprobada' ? 'bg-green-100 text-green-800' :
                                                    item.estado === 'enviada' ? 'bg-blue-100 text-blue-800' :
                                                    item.estado === 'rechazada' ? 'bg-red-100 text-red-800' :
                                                    item.estado === 'negociacion' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {item.estado.charAt(0).toUpperCase() + item.estado.slice(1)}
                                                </span>
                                            </>
                                        ) : item.itemType === 'proyecto' ? (
                                            <>
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                    <FolderOpen className="h-3 w-3 mr-1" />
                                                    Proyecto
                                                </span>
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                    item.estado === 'completado' ? 'bg-green-100 text-green-800' :
                                                    item.estado === 'en_progreso' ? 'bg-blue-100 text-blue-800' :
                                                    item.estado === 'en_pausa' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {item.estado ? item.estado.replace('_', ' ').charAt(0).toUpperCase() + item.estado.replace('_', ' ').slice(1) : 'Sin estado'}
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTipoColor(item.itemType)}`}>
                                                    <FileText className="h-3 w-3 mr-1" />
                                                    Nota
                                                </span>
                                                {item.importante && (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                                        <Star className="w-3 h-3 mr-1" />
                                                        Importante
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </div>

                                    {item.itemType === 'seguimiento' ? (
                                        editingSeguimiento && editingSeguimiento.id === item.id ? (
                                            <div className="space-y-3">
                                                <div className="space-y-2">
                                                    <input
                                                        value={editingSeguimiento.titulo}
                                                        onChange={(e) => setEditingSeguimiento({
                                                            ...editingSeguimiento,
                                                            titulo: e.target.value
                                                        })}
                                                        className="w-full px-3 py-2 text-sm border border-gray-300 focus:!border-[#FF6B35] focus:!ring-2 focus:!ring-[#FF6B35] focus:!ring-opacity-20 !outline-none bg-white rounded-md font-medium placeholder-gray-400"
                                                        placeholder="Título del seguimiento"
                                                        autoFocus={false}
                                                    />
                                                </div>
                                                
                                                <textarea
                                                    value={editingSeguimiento.descripcion}
                                                    onChange={(e) => setEditingSeguimiento({
                                                        ...editingSeguimiento,
                                                        descripcion: e.target.value
                                                    })}
                                                    className="w-full min-h-[80px] px-3 py-2 text-sm border border-gray-300 focus:!border-[#FF6B35] focus:!ring-2 focus:!ring-[#FF6B35] focus:!ring-opacity-20 bg-white rounded-md resize-vertical placeholder-gray-400"
                                                    placeholder="Descripción"
                                                />
                                                
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="text-xs text-gray-500 mb-1 block">Fecha</label>
                                                        <input
                                                            type="date"
                                                            value={editingSeguimiento.fecha_seguimiento}
                                                            onChange={(e) => setEditingSeguimiento({
                                                                ...editingSeguimiento,
                                                                fecha_seguimiento: e.target.value
                                                            })}
                                                            className="w-full px-2 py-1 text-xs border border-gray-300 focus:!border-[#FF6B35] focus:!ring-2 focus:!ring-[#FF6B35] focus:!ring-opacity-20 bg-white rounded-md"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs text-gray-500 mb-1 block">Prioridad</label>
                                                        <Select 
                                                            value={editingSeguimiento.prioridad} 
                                                            onValueChange={(value) => setEditingSeguimiento({
                                                                ...editingSeguimiento,
                                                                prioridad: value as 'baja' | 'media' | 'alta'
                                                            })}
                                                        >
                                                            <SelectTrigger className="w-full px-2 py-1 text-xs border border-gray-300 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35] focus:ring-opacity-20 bg-white rounded-md">
                                                                <SelectValue placeholder="Selecciona prioridad" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="baja">Baja</SelectItem>
                                                                <SelectItem value="media">Media</SelectItem>
                                                                <SelectItem value="alta">Alta</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                                
                                                
                                                <div className="flex gap-2">
                                                    <Button 
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleUpdateSeguimiento();
                                                        }}
                                                        className="bg-white text-[#FF6B35] hover:bg-gray-50 hover:text-[#FF6B35] font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer shadow-sm border border-gray-200"
                                                    >
                                                        Guardar
                                                    </Button>
                                                    <Button 
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setEditingSeguimiento(null);
                                                        }}
                                                        className="bg-white text-[#FF6B35] hover:bg-gray-50 hover:text-[#FF6B35] font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer shadow-sm border border-gray-200"
                                                    >
                                                        Cancelar
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <h4 className="font-medium text-gray-900 mb-1">{item.titulo}</h4>
                                                {item.descripcion && (
                                                    <p className="text-sm text-gray-600 whitespace-pre-wrap mb-2">{item.descripcion}</p>
                                                )}
                                                <div className="text-xs text-gray-500 mb-2">
                                                    Programado para: {new Date(item.fecha_seguimiento).toLocaleDateString('es-ES')}
                                                </div>
                                            </>
                                        )
                                    ) : item.itemType === 'propuesta' ? (
                                        <>
                                            <h4 className="font-medium text-gray-900 mb-1">{item.titulo}</h4>
                                            <p className="text-sm text-gray-600 whitespace-pre-wrap mb-2 line-clamp-2">{item.descripcion_proyecto}</p>
                                            <div className="text-xs text-gray-500 mb-2">
                                                Precio: ${item.precio_total.toLocaleString()} | Tiempo: {item.tiempo_entrega}
                                                {item.fecha_envio && (
                                                    <span> | Enviada: {new Date(item.fecha_envio).toLocaleDateString('es-ES')}</span>
                                                )}
                                            </div>
                                        </>
                                    ) : item.itemType === 'proyecto' ? (
                                        <>
                                            <h4 className="font-medium text-gray-900 mb-1">{item.nombre}</h4>
                                            {item.descripcion && (
                                                <p className="text-sm text-gray-600 whitespace-pre-wrap mb-2 line-clamp-2">{item.descripcion}</p>
                                            )}
                                            <div className="text-xs text-gray-500 mb-2">
                                                Precio: ${item.precio_total.toLocaleString()}
                                                {item.fecha_inicio && (
                                                    <span> | Inicio: {new Date(item.fecha_inicio).toLocaleDateString('es-ES')}</span>
                                                )}
                                                {item.fecha_entrega && (
                                                    <span> | Entrega: {new Date(item.fecha_entrega).toLocaleDateString('es-ES')}</span>
                                                )}
                                            </div>
                                        </>
                                    ) : editingNota && editingNota.id === item.id ? (
                                        <div className="space-y-3">
                                            
                                            <textarea
                                                value={editingNota.contenido}
                                                onChange={(e) => setEditingNota({
                                                    ...editingNota,
                                                    contenido: e.target.value
                                                })}
                                                className="w-full min-h-[80px] px-3 py-2 text-sm border border-gray-300 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35] focus:ring-opacity-20 bg-white rounded-md resize-vertical placeholder-gray-400"
                                            />
                                            
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    checked={editingNota.importante}
                                                    onChange={(e) => setEditingNota({
                                                        ...editingNota,
                                                        importante: e.target.checked
                                                    })}
                                                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                                />
                                                <label className="text-sm">Importante</label>
                                            </div>
                                            
                                            <div className="flex gap-2">
                                                <Button 
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleUpdate();
                                                    }}
                                                    className="bg-white text-[#FF6B35] hover:bg-gray-50 hover:text-[#FF6B35] font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer shadow-sm border border-gray-200"
                                                >
                                                    Guardar
                                                </Button>
                                                <Button 
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setEditingNota(null);
                                                    }}
                                                    className="bg-white text-[#FF6B35] hover:bg-gray-50 hover:text-[#FF6B35] font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer shadow-sm border border-gray-200"
                                                >
                                                    Cancelar
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p 
                                            className={`text-sm whitespace-pre-wrap ${
                                                item.itemType === 'nota' ? 'cursor-pointer hover:bg-gray-50 p-2 rounded' : ''
                                            }`}
                                            onClick={() => item.itemType === 'nota' ? handleEdit(item) : undefined}
                                            title={item.itemType === 'nota' ? 'Click para editar' : undefined}
                                        >
                                            {item.contenido || (item.itemType === 'nota' ? item.contenido : item.descripcion || item.titulo || item.nombre)}
                                        </p>
                                    )}

                                    <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
                                        <Calendar className="h-3 w-3" />
                                        {formatDate(item.created_at)}
                                    </div>
                                </div>

                                {/* Botones de acción para todos los items */}
                                {!(item.itemType === 'nota' && editingNota?.id === item.id) && 
                                 !(item.itemType === 'seguimiento' && editingSeguimiento?.id === item.id) && (
                                    <div className="flex gap-1 ml-4" onClick={(e) => e.stopPropagation()}>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDeleteItem(item)}
                                            className="text-red-600 hover:text-red-700"
                                            title="Eliminar"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>
                </div>
            ))}
                </div>
            )}
        </div>
    );
}