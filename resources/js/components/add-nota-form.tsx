import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { Plus, Send } from 'lucide-react';
import { useState } from 'react';

interface Props {
    clienteId: number;
}

export default function AddNotaForm({ clienteId }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        cliente_id: clienteId,
        contenido: '',
        tipo: 'nota' as 'nota' | 'llamada' | 'reunion' | 'email' | 'tarea',
        importante: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/notas', {
            onSuccess: () => {
                reset();
                setIsOpen(false);
            }
        });
    };

    const tipoOptions = [
        { value: 'nota', label: '📝 Nota', icon: '📝' },
        { value: 'llamada', label: '📞 Llamada', icon: '📞' },
        { value: 'reunion', label: '🤝 Reunión', icon: '🤝' },
        { value: 'email', label: '📧 Email', icon: '📧' },
        { value: 'tarea', label: '✅ Tarea', icon: '✅' },
    ];

    if (!isOpen) {
        return (
            <Button 
                onClick={() => setIsOpen(true)}
                className="w-full"
            >
                <Plus className="mr-2 h-4 w-4" />
                Agregar Nota Rápida
            </Button>
        );
    }

    return (
        <Card className="p-4">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Nueva Nota</h3>
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
                    {errors.tipo && (
                        <p className="text-sm text-red-500">{errors.tipo}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="contenido">Contenido</Label>
                    <textarea
                        id="contenido"
                        value={data.contenido}
                        onChange={(e) => setData('contenido', e.target.value)}
                        className="w-full min-h-[100px] px-3 py-2 text-sm border border-input bg-background rounded-md resize-vertical"
                        placeholder="Ej: Hablé con él el lunes, quiere un presupuesto para el proyecto X..."
                    />
                    {errors.contenido && (
                        <p className="text-sm text-red-500">{errors.contenido}</p>
                    )}
                </div>

                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="importante"
                        checked={data.importante}
                        onChange={(e) => setData('importante', e.target.checked)}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <Label htmlFor="importante" className="text-sm">
                        ⭐ Marcar como importante
                    </Label>
                </div>

                <Button type="submit" disabled={processing} className="w-full">
                    <Send className="mr-2 h-4 w-4" />
                    {processing ? 'Guardando...' : 'Agregar Nota'}
                </Button>
            </form>
        </Card>
    );
}