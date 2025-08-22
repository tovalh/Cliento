import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { type SharedData } from '@/types';
import { Head, Link, usePage, router } from '@inertiajs/react';
import {
    Clock,
    CheckCircle,
    Heart,
    Check,
    ChevronDown,
    Mail,
    Phone,
    ArrowRight,
    Frown,
    AlertTriangle,
    X
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Landing() {
    const { auth } = usePage<SharedData>().props;
    const [email, setEmail] = useState('');
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [name, setName] = useState('');
    const [registeredCount, setRegisteredCount] = useState(0);

    // Cargar contador real al inicializar
    useEffect(() => {
        const fetchLeadsCount = async () => {
            try {
                const response = await fetch('/leads/count');
                const data = await response.json();
                setRegisteredCount(data.count);
            } catch {
                // Si falla, mantener en 0
                setRegisteredCount(0);
            }
        };

        void fetchLeadsCount();
    }, []);

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage(null);

        try {
            const response = await fetch('/leads', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    name,
                    email,
                    source: 'landing_hero'
                }),
            });

            const data = await response.json();

            if (data.success) {
                setMessage({ type: 'success', text: `¡Listo ${name}! Eres parte de la lista prioritaria. Te avisaremos cuando estemos listos.` });
                setName('');
                setEmail('');
                // Actualizar contador
                setRegisteredCount(prev => prev + 1);
            } else {
                setMessage({ type: 'error', text: data.message });
            }
        } catch {
            setMessage({ type: 'error', text: 'Hubo un error. Inténtalo de nuevo.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const painPoints = [
        {
            icon: AlertTriangle,
            title: "Post-its por todos lados",
            description: "Tienes contactos en WhatsApp, Instagram, email... ¿Cómo haces seguimiento?"
        },
        {
            icon: Frown,
            title: "\"Se me olvidó contactarlo\"",
            description: "Ese cliente que parecía interesado... ¿Cuándo fue la última vez que le escribiste?"
        },
        {
            icon: X,
            title: "Perdiste la venta por desorganizado",
            description: "No por falta de talento o precio. Solo porque no hiciste seguimiento."
        }
    ];

    const solution = [
        {
            icon: Heart,
            title: "Simple como un WhatsApp",
            description: "Si sabes usar WhatsApp, ya sabes usar Cliento. Nada de complicaciones."
        },
        {
            icon: Clock,
            title: "Te recordamos todo",
            description: "Nunca más «se te olvide» contactar a alguien. Nosotros te avisamos."
        },
        {
            icon: CheckCircle,
            title: "Hecho por emprendedores",
            description: "Entendemos tu día a día. No somos una corporación, somos como tú."
        }
    ];

    const earlyAccessBenefits = [
        "3 meses completamente gratis al lanzamiento",
        "Precio especial de por vida ($19 en lugar de $29)",
        "Acceso directo al creador para feedback",
        "Tu nombre en los créditos como early adopter",
        "Beta privada desde septiembre"
    ];

    // const expectations = [
    //     {
    //         text: "Espero que sea tan simple como prometen. Estoy cansada de herramientas complicadas.",
    //         type: "Consultora independiente"
    //     },
    //     {
    //         text: "Si realmente me ayuda a no perder clientes por desorganización, va a cambiar mi negocio.",
    //         type: "Coach de vida"
    //     },
    //     {
    //         text: "Me gusta que sea hecho por emprendedores. Seguro entienden mis problemas reales.",
    //         type: "Freelancer de marketing"
    //     }
    // ];

    const faqs = [
        {
            question: "¿Cuándo estará disponible?",
            answer: "Lanzamiento oficial en octubre 2024. Los registrados tendrán acceso a la beta privada en septiembre."
        },
        {
            question: "¿Qué incluye el acceso temprano?",
            answer: "Beta privada, 3 meses gratis, precio especial de por vida, acceso directo al creador y tu nombre en los créditos."
        },
        {
            question: "¿Realmente será tan simple?",
            answer: "Si sabes usar WhatsApp, ya sabes usar Cliento. Esa es nuestra promesa."
        },
        {
            question: "¿Por qué debería confiar en ustedes?",
            answer: "Somos emprendedores como tú. Este problema lo vivimos en carne propia y lo estamos resolviendo para nosotros primero."
        },
        {
            question: "¿Qué pasa si no me gusta?",
            answer: "Durante los 3 meses gratis puedes cancelar cuando quieras, sin preguntas."
        }
    ];

    return (
        <>
            <Head title="Cliento - Pronto: Nunca más pierdas un cliente por desorganización" />

            {/* Header/Navigation */}
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="container mx-auto px-6 py-4">
                    <nav className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-[#FF6B35] rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">C</span>
                            </div>
                            <span className="text-xl font-bold text-[#333333]">Cliento</span>
                        </div>

                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#problema" className="text-[#333333] hover:text-[#FF6B35] transition-colors">
                                El Problema
                            </a>
                            <a href="#solucion" className="text-[#333333] hover:text-[#FF6B35] transition-colors">
                                La Solución
                            </a>
                            <a href="#acceso" className="text-[#333333] hover:text-[#FF6B35] transition-colors">
                                Acceso Temprano
                            </a>
                        </div>

                        <div className="flex items-center space-x-4">
                            {auth.user ? (
                                <Link href={route('dashboard')}>
                                    <Button className="bg-[#FF6B35] hover:bg-[#F7B801] text-white">
                                        Dashboard
                                    </Button>
                                </Link>
                            ) : (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-[#FF6B35]">
                                    🚀 Próximamente en Octubre
                                </span>
                            )}
                        </div>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-white to-[#FFFEF8] py-20">
                <div className="container mx-auto px-6 text-center">
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-6">
                            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-orange-100 text-[#FF6B35] mb-4">
                                🎯 Lanzamiento Octubre 2024
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold text-[#333333] mb-6">
                            ¿Cuántos clientes has perdido por
                            <span className="text-[#FF6B35]"> desorganización?</span>
                        </h1>

                        <p className="text-xl text-[#666666] mb-8 max-w-3xl mx-auto">
                            Somos emprendedores como tú. Sabemos lo frustrante que es perder oportunidades porque "se te olvidó" contactar a alguien.
                            <strong>Cliento cambiará eso para siempre.</strong>
                        </p>

                        {!auth.user && (
                            <div id="email-form" className="bg-white rounded-xl shadow-xl p-8 max-w-lg mx-auto mb-8 border-2 border-orange-100">
                                <div className="text-center mb-6">
                                    <h3 className="text-xl font-bold text-[#333333] mb-2">
                                        🎯 Reserva tu lugar ahora
                                    </h3>
                                    <p className="text-[#666666] text-sm">
                                        Solo para los primeros 500 emprendedores
                                    </p>
                                </div>

                                <form onSubmit={handleEmailSubmit} className="space-y-4">
                                    <Input
                                        type="text"
                                        placeholder="Tu nombre"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full"
                                        required
                                        disabled={isSubmitting}
                                    />
                                    <Input
                                        type="email"
                                        placeholder="tu@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full"
                                        required
                                        disabled={isSubmitting}
                                    />
                                    <Button
                                        type="submit"
                                        className="w-full bg-[#FF6B35] hover:bg-[#F7B801] text-white py-3 text-lg font-semibold"
                                        disabled={isSubmitting || !name.trim() || !email.trim()}
                                    >
                                        {isSubmitting ? 'Reservando tu lugar...' : 'Reservar mi lugar 🚀'}
                                    </Button>
                                </form>

                                {message && (
                                    <div className={`mt-4 text-center p-3 rounded-lg ${
                                        message.type === 'success'
                                            ? 'bg-green-100 text-green-800 border border-green-200'
                                            : 'bg-red-100 text-red-800 border border-red-200'
                                    }`}>
                                        {message.text}
                                    </div>
                                )}

                                <div className="mt-4 text-center text-xs text-[#999999]">
                                    ✓ Sin compromiso • ✓ 3 meses gratis • ✓ Cancela cuando quieras
                                </div>
                            </div>
                        )}

                        <div className="flex items-center justify-center gap-2 text-sm text-[#666666] mb-8">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            <span>{registeredCount} emprendedores ya se registraron</span>
                        </div>

                        {/* Timeline visual */}
                        <div className="bg-white rounded-lg shadow-xl p-10 max-w-3xl mx-auto">
                            <h3 className="text-2xl font-bold text-[#333333] mb-8 text-center">
                                Cronograma de lanzamiento
                            </h3>
                            <div className="relative">
                                {/* Línea conectora vertical */}
                                <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gradient-to-b from-green-500 via-orange-400 to-[#FF6B35]"></div>

                                <div className="space-y-8">
                                    <div className="flex items-start space-x-6 relative">
                                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center z-10 shadow-lg">
                                            <Check className="h-6 w-6 text-white" />
                                        </div>
                                        <div className="flex-1 pt-2">
                                            <span className="text-xl font-bold text-green-700">Agosto 2024</span>
                                            <p className="text-lg text-[#666666] mt-1">Registro anticipado abierto</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-6 relative">
                                        <div className="w-12 h-12 bg-orange-400 rounded-full flex items-center justify-center z-10 shadow-lg">
                                            <Clock className="h-6 w-6 text-white" />
                                        </div>
                                        <div className="flex-1 pt-2">
                                            <span className="text-xl font-bold text-orange-600">Septiembre 2024</span>
                                            <p className="text-lg text-[#666666] mt-1">Beta privada para registrados</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-6 relative">
                                        <div className="w-12 h-12 bg-[#FF6B35] rounded-full flex items-center justify-center z-10 shadow-lg animate-pulse">
                                            <ArrowRight className="h-6 w-6 text-white" />
                                        </div>
                                        <div className="flex-1 pt-2">
                                            <span className="text-xl font-bold text-[#FF6B35]">Octubre 2024</span>
                                            <p className="text-lg text-[#666666] mt-1">Lanzamiento oficial</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pain Points */}
            <section id="problema" className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-[#333333] mb-4">
                            ¿Te suena familiar?
                        </h2>
                        <p className="text-xl text-[#666666] max-w-2xl mx-auto">
                            Estos son los problemas reales de emprendedores reales (incluidos nosotros)
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
                        {/* Pain Points List */}
                        <div className="space-y-8">
                            {painPoints.map((pain, index) => (
                                <div key={index} className="flex items-start space-x-6 p-6 bg-white rounded-lg border border-orange-100 hover:shadow-lg transition-shadow">
                                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <pain.icon className="h-6 w-6 text-red-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold text-[#333333] mb-3">
                                            {pain.title}
                                        </h3>
                                        <p className="text-[#666666] leading-relaxed">
                                            {pain.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Image */}
                        <div className="flex justify-center lg:justify-end">
                            <img
                                src="/images/caos.png"
                                alt="Caos organizacional - emprendedor abrumado con sticky notes y desorganización"
                                className="w-full max-w-md h-auto"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Solution */}
            <section id="solucion" className="py-20 bg-[#F8F9FA]">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-[#333333] mb-4">
                            Nuestra solución (simple y honesta)
                        </h2>
                        <p className="text-xl text-[#666666] max-w-3xl mx-auto">
                            No inventamos la rueda. Solo la hicimos más simple y enfocada en lo que realmente necesitas.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {solution.map((sol, index) => (
                            <Card key={index} className="text-center p-8 bg-white hover:shadow-lg transition-shadow">
                                <CardContent className="pt-6">
                                    <div className="w-16 h-16 bg-[#FF6B35] rounded-full flex items-center justify-center mx-auto mb-6">
                                        <sol.icon className="h-8 w-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-[#333333] mb-4">
                                        {sol.title}
                                    </h3>
                                    <p className="text-[#666666]">
                                        {sol.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>



            {/* Expectations - Comentado por ahora
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-[#333333] mb-4">
                            Lo que esperan emprendedores como tú
                        </h2>
                        <p className="text-lg text-[#666666]">
                            Comentarios reales de quienes ya se registraron
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {expectations.map((expectation, index) => (
                            <Card key={index} className="p-6 border-l-4 border-[#FF6B35]">
                                <CardContent className="pt-6">
                                    <p className="text-[#333333] mb-4 italic">
                                        "{expectation.text}"
                                    </p>

                                    <div className="text-sm text-[#666666] font-medium">
                                        — {expectation.type}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
            */}

            {/* Early Access Benefits */}
            <section id="acceso" className="py-20 bg-[#FFFEF8]">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-[#333333] mb-4">
                            Beneficios del registro temprano
                        </h2>
                        <p className="text-xl text-[#666666]">
                            Por confiar en nosotros desde el principio
                        </p>
                    </div>

                    <div className="max-w-lg mx-auto">
                        <Card className="border-2 border-[#FF6B35] relative bg-white">
                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                <span className="bg-[#FF6B35] text-white px-4 py-2 rounded-full text-sm font-semibold">
                                    🎉 Early Adopter
                                </span>
                            </div>

                            <CardContent className="p-8 text-center">
                                <h3 className="text-2xl font-bold text-[#333333] mb-6">Acceso Prioritario</h3>

                                <ul className="space-y-4 mb-8 text-left">
                                    {earlyAccessBenefits.map((benefit, index) => (
                                        <li key={index} className="flex items-start space-x-3">
                                            <Check className="h-5 w-5 text-[#28A745] mt-0.5 flex-shrink-0" />
                                            <span className="text-[#333333]">{benefit}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Button
                                    className="w-full bg-[#FF6B35] hover:bg-[#F7B801] text-white py-3 mb-4"
                                    onClick={() => document.getElementById('email-form')?.scrollIntoView({behavior: 'smooth'})}
                                >
                                    Ir al formulario ↑
                                </Button>

                                <p className="text-sm text-[#666666]">
                                    Solo para los primeros 500 registrados
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-20 bg-[#F8F9FA]">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-[#333333] mb-4">
                            Preguntas frecuentes
                        </h2>
                    </div>

                    <div className="max-w-3xl mx-auto space-y-4">
                        {faqs.map((faq, index) => (
                            <Collapsible
                                key={index}
                                open={openFaq === index}
                                onOpenChange={() => setOpenFaq(openFaq === index ? null : index)}
                            >
                                <CollapsibleTrigger className="w-full">
                                    <Card className="hover:shadow-md transition-shadow">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-semibold text-[#333333] text-left">
                                                    {faq.question}
                                                </h3>
                                                <ChevronDown
                                                    className={`h-5 w-5 text-[#666666] transition-transform ${
                                                        openFaq === index ? 'rotate-180' : ''
                                                    }`}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <div className="px-6 pb-4">
                                        <p className="text-[#666666]">{faq.answer}</p>
                                    </div>
                                </CollapsibleContent>
                            </Collapsible>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-20 bg-[#FF6B35]">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bold text-white mb-6">
                        ¿Te cansaste los clientes perdidos?
                    </h2>
                    <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                        Reserva tu lugar y no vuelvas a perder una oportunidad por desorganización.
                    </p>

                    <Button
                        size="lg"
                        className="bg-white text-[#FF6B35] hover:bg-gray-100 px-8 py-3 text-lg"
                        onClick={() => document.getElementById('email-form')?.scrollIntoView({behavior: 'smooth'})}
                    >
                        Reservar mi lugar en octubre
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>

                    <p className="text-white/80 mt-4">
                        Sin compromiso • 3 meses gratis si te registras ahora
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer id="contact" className="bg-[#333333] text-white py-12">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="w-8 h-8 bg-[#FF6B35] rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">C</span>
                                </div>
                                <span className="text-xl font-bold">Cliento</span>
                            </div>
                            <p className="text-gray-400 text-sm">
                                Próximamente: La herramienta más simple para que nunca pierdas un cliente por desorganización.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Pre-lanzamiento</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><a href="#problema" className="hover:text-white transition-colors">El Problema</a></li>
                                <li><a href="#solucion" className="hover:text-white transition-colors">La Solución</a></li>
                                <li><a href="#acceso" className="hover:text-white transition-colors">Acceso Temprano</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Soporte</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><a href="#" className="hover:text-white transition-colors">Centro de Ayuda</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Documentación</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Contacto</h4>
                            <div className="space-y-3 text-sm text-gray-400">
                                <div className="flex items-center space-x-2">
                                    <Mail className="h-4 w-4" />
                                    <span>contacto@cliento.cl</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Phone className="h-4 w-4" />
                                    <span>(+56) 9 9968 6639 </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-700 mt-12 pt-8 text-center text-sm text-gray-400">
                        <p>&copy; 2025 Cliento. Lanzamiento octubre 2025. Hecho con ❤️ por emprendedores para emprendedores.</p>
                    </div>
                </div>
            </footer>
        </>
    );
}
