import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { type Seguimiento } from '@/types';
import { router } from '@inertiajs/react';
import { Calendar, Clock, CheckCircle, AlertTriangle, Users, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function SeguimientosWidget() {
    const [seguimientos, setSeguimientos] = useState<Seguimiento[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSeguimientos();
    }, []);

    const fetchSeguimientos = async () => {
        try {
            const response = await fetch('/api/seguimientos/pendientes');
            const data = await response.json();
            setSeguimientos(data);
        } catch (error) {
            console.error('Error fetching seguimientos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleComplete = async (id: number) => {
        try {
            await router.post(`/seguimientos/${id}/completar`, {}, {
                onSuccess: () => {
                    fetchSeguimientos(); // Refresh the list
                }
            });
        } catch (error) {
            console.error('Error completing seguimiento:', error);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const today = new Date();
        const diffInDays = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffInDays === 0) {
            return 'Hoy';
        } else if (diffInDays === 1) {
            return 'Mañana';
        } else if (diffInDays === -1) {
            return 'Ayer';
        } else if (diffInDays < 0) {
            return `${Math.abs(diffInDays)} días vencido`;
        } else {
            return `En ${diffInDays} días`;
        }
    };

    const getTipoIcon = (tipo: string) => {
        const icons = {
            llamada: '📞',
            email: '📧',
            reunion: '🤝',
            propuesta: '📋',
            otro: '📌'
        };
        return icons[tipo as keyof typeof icons] || '📌';
    };

    const getPrioridadColor = (prioridad: string) => {
        const colors = {
            alta: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
            media: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
            baja: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
        };
        return colors[prioridad as keyof typeof colors] || colors.media;
    };

    const getEstadoColor = (seguimiento: Seguimiento) => {
        const today = new Date();
        const fechaSeguimiento = new Date(seguimiento.fecha_seguimiento);
        
        if (fechaSeguimiento < today) {
            return 'border-l-red-500 bg-red-50 dark:bg-red-950';
        } else if (fechaSeguimiento.toDateString() === today.toDateString()) {
            return 'border-l-orange-500 bg-orange-50 dark:bg-orange-950';
        } else {
            return 'border-l-blue-500 bg-blue-50 dark:bg-blue-950';
        }
    };

    if (loading) {
        return (
            <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Clock className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-semibold">Seguimientos Pendientes</h2>
                </div>
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    ))}
                </div>
            </Card>
        );
    }

    return (
        <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-semibold">Seguimientos Pendientes</h2>
                </div>
                <Badge variant="secondary">
                    {seguimientos.length} {seguimientos.length === 1 ? 'pendiente' : 'pendientes'}
                </Badge>
            </div>

            {seguimientos.length === 0 ? (
                <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                    <p className="text-muted-foreground">¡Excelente! No tienes seguimientos pendientes.</p>
                    <p className="text-sm text-muted-foreground mt-1">
                        Agenda nuevos seguimientos desde las fichas de tus clientes.
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {seguimientos.slice(0, 5).map((seguimiento) => (
                        <div 
                            key={seguimiento.id} 
                            className={`p-4 rounded-lg border-l-4 transition-colors ${getEstadoColor(seguimiento)}`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-lg">{getTipoIcon(seguimiento.tipo)}</span>
                                        <h3 className="font-medium text-sm">{seguimiento.titulo}</h3>
                                        <Badge 
                                            variant="outline" 
                                            className={`text-xs ${getPrioridadColor(seguimiento.prioridad)}`}
                                        >
                                            {seguimiento.prioridad}
                                        </Badge>
                                    </div>
                                    
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Users className="h-3 w-3" />
                                            {seguimiento.cliente.nombre} {seguimiento.cliente.apellido}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {formatDate(seguimiento.fecha_seguimiento)}
                                        </div>
                                    </div>

                                    {seguimiento.descripcion && (
                                        <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                                            {seguimiento.descripcion}
                                        </p>
                                    )}
                                </div>

                                <div className="flex gap-1 ml-3">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => router.visit(`/clientes/${seguimiento.cliente_id}`)}
                                        title="Ver cliente"
                                    >
                                        <ArrowRight className="h-3 w-3" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleComplete(seguimiento.id)}
                                        className="text-green-600 hover:text-green-700"
                                        title="Marcar como completado"
                                    >
                                        <CheckCircle className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {seguimientos.length > 5 && (
                        <div className="text-center pt-3">
                            <p className="text-sm text-muted-foreground">
                                Y {seguimientos.length - 5} seguimientos más...
                            </p>
                        </div>
                    )}
                </div>
            )}

            {seguimientos.some(s => {
                const today = new Date();
                const fechaSeguimiento = new Date(s.fecha_seguimiento);
                return fechaSeguimiento < today;
            }) && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <p className="text-sm text-red-700 dark:text-red-300">
                            Tienes seguimientos vencidos que requieren atención.
                        </p>
                    </div>
                </div>
            )}
        </Card>
    );
}