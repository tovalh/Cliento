import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { Calendar, Clock, Plus } from 'lucide-react';
import { useState } from 'react';

interface Props {
    clienteId: number;
}

export default function AddSeguimientoForm({ clienteId }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        cliente_id: clienteId,
        titulo: '',
        descripcion: '',
        fecha_seguimiento: '',
        prioridad: 'media' as 'baja' | 'media' | 'alta',
        tipo: 'llamada' as 'llamada' | 'email' | 'reunion' | 'propuesta' | 'otro',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/seguimientos', {
            onSuccess: () => {
                reset();
                setIsOpen(false);
            }
        });
    };

    const handleQuickSchedule = (days: number, titulo: string) => {
        const fecha = new Date();
        fecha.setDate(fecha.getDate() + days);
        
        setData({
            ...data,
            titulo,
            fecha_seguimiento: fecha.toISOString().split('T')[0]
        });
        setIsOpen(true);
    };

    const tipoOptions = [
        { value: 'llamada', label: '📞 Llamada', icon: '📞' },
        { value: 'email', label: '📧 Email', icon: '📧' },
        { value: 'reunion', label: '🤝 Reunión', icon: '🤝' },
        { value: 'propuesta', label: '📋 Propuesta', icon: '📋' },
        { value: 'otro', label: '📌 Otro', icon: '📌' },
    ];

    const prioridadOptions = [
        { value: 'baja', label: '🟢 Baja', color: 'text-green-600' },
        { value: 'media', label: '🟡 Media', color: 'text-yellow-600' },
        { value: 'alta', label: '🔴 Alta', color: 'text-red-600' },
    ];

    if (!isOpen) {
        return (
            <div className="space-y-3">
                <h3 className="font-medium text-sm text-muted-foreground">⏰ Agendar Contacto Futuro</h3>
                
                {/* Botones rápidos */}
                <div className="grid grid-cols-2 gap-2">
                    <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleQuickSchedule(7, 'Seguimiento semanal')}
                        className="justify-start"
                    >
                        <Clock className="mr-2 h-3 w-3" />
                        En 1 semana
                    </Button>
                    <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleQuickSchedule(30, 'Seguimiento mensual')}
                        className="justify-start"
                    >
                        <Calendar className="mr-2 h-3 w-3" />
                        En 1 mes
                    </Button>
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                    <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleQuickSchedule(90, 'Seguimiento trimestral')}
                        className="justify-start"
                    >
                        <Calendar className="mr-2 h-3 w-3" />
                        En 3 meses
                    </Button>
                </div>

                <Button 
                    onClick={() => setIsOpen(true)}
                    className="w-full"
                    size="sm"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Personalizar Seguimiento
                </Button>
            </div>
        );
    }

    return (
        <Card className="p-4">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold">⏰ Agendar Seguimiento</h3>
                    <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => setIsOpen(false)}
                    >
                        Cancelar
                    </Button>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="titulo">Título del seguimiento *</Label>
                    <Input
                        id="titulo"
                        value={data.titulo}
                        onChange={(e) => setData('titulo', e.target.value)}
                        placeholder="Ej: Llamar para seguimiento de propuesta"
                        className={errors.titulo ? 'border-red-500' : ''}
                    />
                    {errors.titulo && (
                        <p className="text-sm text-red-500">{errors.titulo}</p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="tipo">Tipo</Label>
                        <select
                            id="tipo"
                            value={data.tipo}
                            onChange={(e) => setData('tipo', e.target.value as any)}
                            className="w-full h-10 px-3 py-2 text-sm border border-input bg-background rounded-md"
                        >
                            {tipoOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="prioridad">Prioridad</Label>
                        <select
                            id="prioridad"
                            value={data.prioridad}
                            onChange={(e) => setData('prioridad', e.target.value as any)}
                            className="w-full h-10 px-3 py-2 text-sm border border-input bg-background rounded-md"
                        >
                            {prioridadOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="fecha_seguimiento">Fecha de seguimiento *</Label>
                    <Input
                        id="fecha_seguimiento"
                        type="date"
                        value={data.fecha_seguimiento}
                        onChange={(e) => setData('fecha_seguimiento', e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className={errors.fecha_seguimiento ? 'border-red-500' : ''}
                    />
                    {errors.fecha_seguimiento && (
                        <p className="text-sm text-red-500">{errors.fecha_seguimiento}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="descripcion">Descripción (opcional)</Label>
                    <textarea
                        id="descripcion"
                        value={data.descripcion}
                        onChange={(e) => setData('descripcion', e.target.value)}
                        className="w-full min-h-[80px] px-3 py-2 text-sm border border-input bg-background rounded-md resize-vertical"
                        placeholder="Detalles adicionales sobre el seguimiento..."
                    />
                </div>

                <Button type="submit" disabled={processing} className="w-full">
                    <Calendar className="mr-2 h-4 w-4" />
                    {processing ? 'Agendando...' : 'Agendar Seguimiento'}
                </Button>
            </form>
        </Card>
    );
}