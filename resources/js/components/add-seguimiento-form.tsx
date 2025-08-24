import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { Calendar, Clock, Plus, Phone, Mail, Users, FileText, MapPin, Save, X } from 'lucide-react';
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
        { value: 'llamada', label: 'Llamada', icon: Phone },
        { value: 'email', label: 'Email', icon: Mail },
        { value: 'reunion', label: 'Reunión', icon: Users },
        { value: 'propuesta', label: 'Propuesta', icon: FileText },
        { value: 'otro', label: 'Otro', icon: MapPin },
    ];

    const prioridadOptions = [
        { value: 'baja', label: 'Baja', color: 'text-green-600' },
        { value: 'media', label: 'Media', color: 'text-yellow-600' },
        { value: 'alta', label: 'Alta', color: 'text-red-600' },
    ];

    if (!isOpen) {
        return (
            <div className="space-y-3">
                <div className="flex items-center gap-2 mb-3">
                    <Clock className="h-4 w-4 text-[#FF6B35]" />
                    <h3 className="font-medium text-sm text-gray-700">Agendar Contacto Futuro</h3>
                </div>
                
                {/* Botones rápidos */}
                <div className="grid grid-cols-2 gap-2">
                    <Button 
                        onClick={() => handleQuickSchedule(7, 'Seguimiento semanal')}
                        className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white font-medium px-4 py-2 shadow-sm transition-colors justify-start text-sm"
                    >
                        <Clock className="mr-2 h-3 w-3" />
                        En 1 semana
                    </Button>
                    <Button 
                        onClick={() => handleQuickSchedule(30, 'Seguimiento mensual')}
                        className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white font-medium px-4 py-2 shadow-sm transition-colors justify-start text-sm"
                    >
                        <Calendar className="mr-2 h-3 w-3" />
                        En 1 mes
                    </Button>
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                    <Button 
                        onClick={() => handleQuickSchedule(90, 'Seguimiento trimestral')}
                        className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white font-medium px-4 py-2 shadow-sm transition-colors justify-start text-sm"
                    >
                        <Calendar className="mr-2 h-3 w-3" />
                        En 3 meses
                    </Button>
                </div>

                <Button 
                    onClick={() => setIsOpen(true)}
                    className="w-full bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white font-medium px-4 py-2 shadow-sm transition-colors text-sm"
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
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-[#FF6B35]" />
                        <h3 className="font-semibold text-gray-800">Agendar Seguimiento</h3>
                    </div>
                    <Button 
                        type="button" 
                        onClick={() => setIsOpen(false)}
                        className="border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 font-medium text-sm shadow-sm transition-colors"
                    >
                        <X className="mr-2 h-3 w-3" />
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

                <Button 
                    type="submit" 
                    disabled={processing} 
                    className="w-full bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white font-medium px-8 py-2 shadow-sm transition-colors disabled:opacity-50"
                >
                    <Save className="mr-2 h-4 w-4" />
                    {processing ? 'Agendando...' : 'Agendar Seguimiento'}
                </Button>
            </form>
        </Card>
    );
}