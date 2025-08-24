import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { Plus, Send, Star, X, FileText, Save } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Props {
    clienteId: number;
}

export default function AddNotaForm({ clienteId }: Props) {
    const [isOpen, setIsOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        cliente_id: clienteId,
        contenido: '',
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

    // Cerrar modal con tecla Escape
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            // Prevenir scroll del body cuando el modal está abierto
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);


    if (!isOpen) {
        return (
            <Button
                onClick={() => setIsOpen(true)}
                className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white font-medium px-4 py-2 rounded-lg shadow-sm cursor-pointer"
            >
                <Plus className="mr-2 h-4 w-4" />
                Nueva Nota
            </Button>
        );
    }

    return (
        <>
            {/* Modal Overlay */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                onClick={() => setIsOpen(false)}
            >
                {/* Modal Content */}
                <div
                    className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header naranja */}
                    <div className="bg-[#FF6B35] px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <FileText className="h-5 w-5 text-white" />
                                <h2 className="text-xl font-bold text-white">Nueva Nota</h2>
                            </div>
                            <Button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors cursor-pointer"
                                variant="ghost"
                            >
                                <X className="h-5 w-5 text-white" />
                            </Button>
                        </div>
                    </div>

                    {/* Contenido del modal */}
                    <div className="p-6">

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="contenido" className="text-sm font-semibold text-[#333]">Contenido *</Label>
                                <textarea
                                    id="contenido"
                                    value={data.contenido}
                                    onChange={(e) => setData('contenido', e.target.value)}
                                    className="w-full min-h-[120px] px-3 py-2 text-sm border border-gray-300 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35] focus:ring-opacity-20 bg-white rounded-md resize-vertical placeholder-gray-400"
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
                                    className="h-4 w-4 text-[#FF6B35] focus:ring-[#FF6B35] border-gray-300 rounded"
                                />
                                <Label htmlFor="importante" className="text-sm flex items-center">
                                    <Star className="h-3 w-3 mr-1 text-[#FF6B35]" />
                                    Marcar como importante
                                </Label>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 font-medium shadow-sm transition-colors cursor-pointer"
                                    variant="outline"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white font-medium px-4 py-2 shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
                                >
                                    <Save className="mr-2 h-4 w-4" />
                                    {processing ? 'Guardando...' : 'Guardar'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
