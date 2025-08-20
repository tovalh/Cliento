import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { type Nota } from '@/types';
import { router } from '@inertiajs/react';
import { Calendar, Edit2, Star, Trash2, User } from 'lucide-react';
import { useState } from 'react';

interface Props {
    notas: Nota[];
}

interface EditingNota {
    id: number;
    contenido: string;
    tipo: 'nota' | 'llamada' | 'reunion' | 'email' | 'tarea';
    importante: boolean;
}

export default function Timeline({ notas }: Props) {
    const [editingNota, setEditingNota] = useState<EditingNota | null>(null);

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
        const icons = {
            nota: '📝',
            llamada: '📞',
            reunion: '🤝',
            email: '📧',
            tarea: '✅'
        };
        return icons[tipo as keyof typeof icons] || '📝';
    };

    const getTipoColor = (tipo: string) => {
        const colors = {
            nota: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
            llamada: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            reunion: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
            email: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
            tarea: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
        };
        return colors[tipo as keyof typeof colors] || colors.nota;
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
            tipo: nota.tipo,
            importante: nota.importante
        });
    };

    const handleUpdate = () => {
        if (!editingNota) return;

        router.put(`/notas/${editingNota.id}`, {
            contenido: editingNota.contenido,
            tipo: editingNota.tipo,
            importante: editingNota.importante
        }, {
            onSuccess: () => setEditingNota(null)
        });
    };

    const tipoOptions = [
        { value: 'nota', label: '📝 Nota' },
        { value: 'llamada', label: '📞 Llamada' },
        { value: 'reunion', label: '🤝 Reunión' },
        { value: 'email', label: '📧 Email' },
        { value: 'tarea', label: '✅ Tarea' },
    ];

    if (notas.length === 0) {
        return (
            <Card className="p-8 text-center">
                <p className="text-muted-foreground">No hay notas registradas para este cliente</p>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {notas.map((nota, index) => (
                <div key={nota.id} className="relative">
                    {/* Timeline line */}
                    {index !== notas.length - 1 && (
                        <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-border"></div>
                    )}
                    
                    <div className="flex gap-4">
                        {/* Timeline dot */}
                        <div className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-background ${getTipoColor(nota.tipo)}`}>
                            <span className="text-lg">{getTipoIcon(nota.tipo)}</span>
                        </div>

                        {/* Content */}
                        <Card className="flex-1 p-4">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTipoColor(nota.tipo)}`}>
                                            {getTipoIcon(nota.tipo)} {nota.tipo.charAt(0).toUpperCase() + nota.tipo.slice(1)}
                                        </span>
                                        {nota.importante && (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                                <Star className="w-3 h-3 mr-1" />
                                                Importante
                                            </span>
                                        )}
                                    </div>

                                    {editingNota && editingNota.id === nota.id ? (
                                        <div className="space-y-3">
                                            <select
                                                value={editingNota.tipo}
                                                onChange={(e) => setEditingNota({
                                                    ...editingNota,
                                                    tipo: e.target.value as any
                                                })}
                                                className="w-full h-10 px-3 py-2 text-sm border border-input bg-background rounded-md"
                                            >
                                                {tipoOptions.map((option) => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                            
                                            <textarea
                                                value={editingNota.contenido}
                                                onChange={(e) => setEditingNota({
                                                    ...editingNota,
                                                    contenido: e.target.value
                                                })}
                                                className="w-full min-h-[80px] px-3 py-2 text-sm border border-input bg-background rounded-md resize-vertical"
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
                                                <Button size="sm" onClick={handleUpdate}>
                                                    Guardar
                                                </Button>
                                                <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    onClick={() => setEditingNota(null)}
                                                >
                                                    Cancelar
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-sm whitespace-pre-wrap">{nota.contenido}</p>
                                    )}

                                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <User className="h-3 w-3" />
                                            {nota.user.name}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {formatDate(nota.created_at)}
                                        </div>
                                    </div>
                                </div>

                                {editingNota?.id !== nota.id && (
                                    <div className="flex gap-1 ml-4">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleEdit(nota)}
                                        >
                                            <Edit2 className="h-3 w-3" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(nota.id)}
                                            className="text-red-600 hover:text-red-700"
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
    );
}