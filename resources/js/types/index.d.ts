import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Cliente {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    telefono?: string;
    empresa?: string;
    direccion?: string;
    ciudad?: string;
    fecha_nacimiento?: string;
    estado: 'activo' | 'inactivo';
    notas?: string;
    created_at: string;
    updated_at: string;
    nombre_completo?: string;
}

export interface Nota {
    id: number;
    cliente_id: number;
    user_id: number;
    contenido: string;
    tipo: 'nota' | 'llamada' | 'reunion' | 'email' | 'tarea';
    importante: boolean;
    created_at: string;
    updated_at: string;
    user: User;
}

export interface Seguimiento {
    id: number;
    cliente_id: number;
    user_id: number;
    titulo: string;
    descripcion?: string;
    fecha_seguimiento: string;
    prioridad: 'baja' | 'media' | 'alta';
    tipo: 'llamada' | 'email' | 'reunion' | 'propuesta' | 'otro';
    completado: boolean;
    completado_en?: string;
    created_at: string;
    updated_at: string;
    cliente: Cliente;
    user: User;
    estado?: 'completado' | 'vencido' | 'hoy' | 'pendiente';
    dias_restantes?: number;
}

export interface Propuesta {
    id: number;
    cliente_id: number;
    user_id: number;
    titulo: string;
    estado: 'borrador' | 'enviada' | 'aprobada' | 'rechazada' | 'negociacion';
    fecha_envio?: string;
    fecha_limite_respuesta?: string;
    descripcion_proyecto: string;
    alcance_incluye: string;
    alcance_no_incluye?: string;
    precio_total: number;
    forma_pago: string;
    tiempo_entrega: string;
    terminos_condiciones?: string;
    fecha_ultimo_followup?: string;
    proximo_recordatorio?: string;
    notas_internas?: string;
    created_at: string;
    updated_at: string;
    cliente: Cliente;
    user: User;
    // Calculated attributes
    estado_color?: string;
    estado_icono?: string;
    precio_formateado?: string;
    dias_restantes?: number;
    esta_vencida?: boolean;
}

export interface Proyecto {
    id: number;
    propuesta_id?: number;
    cliente_id: number;
    user_id: number;
    nombre: string;
    descripcion?: string;
    estado: 'por_empezar' | 'en_progreso' | 'en_pausa' | 'completado';
    fecha_inicio?: string;
    fecha_entrega?: string;
    precio_total: number;
    forma_pago: string;
    notas?: string;
    created_at: string;
    updated_at: string;
    cliente: Cliente;
    user: User;
    propuesta?: Propuesta;
    // Calculated attributes
    estado_color?: string;
    estado_icono?: string;
    precio_formateado?: string;
    progreso?: number;
}
