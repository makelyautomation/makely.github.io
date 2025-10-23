import React, { useState, useEffect, useRef } from 'react';
import AnimatedBackground from './AnimatedBackground';

// --- SVG Icons ---
const icons = {
  agencies: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
  ecommerce: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
  services: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  marketing: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  assistants: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
  reports: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  onboarding: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-1a6 6 0 00-5.197-5.975M15 10a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
};


// Interfaces for props
interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

interface NicheCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  points: string[];
  highlighted?: boolean;
}

interface Testimonial {
  quote: string;
  name: string;
  company: string;
  avatarInitial: string;
}

interface CaseStudy {
  client: string;
  challenge: string;
  solution: string;
  results: { icon: string; text: string }[];
}

interface TestimonialCardProps extends Testimonial {}
interface CaseStudyCardProps extends CaseStudy {}


// --- Animation Component ---
interface ScrollAnimatorProps {
  children: React.ReactNode;
  animation?: 'fade-in' | 'slide-in-up' | 'slide-in-left' | 'slide-in-right' | 'zoom-in';
  delay?: number; // in ms
  className?: string;
}

const ScrollAnimator: React.FC<ScrollAnimatorProps> = ({ children, animation = 'fade-in', delay = 0, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target); // Animate only once
        }
      },
      {
        threshold: 0.1, // Trigger when 10% of the element is visible
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const animationClasses = {
    'slide-in-up': 'opacity-0 translate-y-8',
    'slide-in-left': 'opacity-0 -translate-x-8',
    'slide-in-right': 'opacity-0 translate-x-8',
    'zoom-in': 'opacity-0 scale-90',
    'fade-in': 'opacity-0',
  };
  
  const visibleClasses = 'opacity-100 translate-y-0 translate-x-0 scale-100';

  const selectedAnimation = animationClasses[animation] || animationClasses['fade-in'];

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`${className} transition-all duration-700 ease-out transform ${isVisible ? visibleClasses : selectedAnimation}`}
    >
      {children}
    </div>
  );
};


// Helper Components

const NavLink: React.FC<NavLinkProps> = ({ href, children, onClick, className = '' }) => {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.substring(1);
            if (targetId) { 
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }
        onClick?.();
    };

    return (
        <a href={href} onClick={handleClick} className={`text-sm font-semibold text-brand-light-accent hover:text-white transition-colors ${className}`}>
            {children}
        </a>
    );
};

const PrimaryButton: React.FC<{ href: string; children: React.ReactNode; className?: string; onClick?: () => void; }> = ({ href, children, className = '', onClick }) => {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.substring(1);
            if (targetId) { 
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }
        onClick?.();
    };

    return (
        <a
            href={href}
            onClick={handleClick}
            className={`inline-block bg-brand-primary text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-brand-primary/20 transform hover:-translate-y-1 transition-all duration-300 hover:bg-gradient-to-r hover:from-brand-primary hover:to-brand-secondary hover:shadow-[0_10px_24px_rgba(255,107,0,0.35)] ${className}`}
        >
            {children}
        </a>
    );
};


const FloatingCTAButton: React.FC<{ isVisible: boolean }> = ({ isVisible }) => {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const targetElement = document.getElementById('cta-final');
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <a
          href="#cta-final"
          onClick={handleClick}
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold p-4 rounded-full shadow-2xl shadow-brand-primary/40 transition-all duration-300 ease-in-out transform hover:scale-105 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="hidden sm:inline">Agendar Diagnóstico</span>
        </a>
    );
};

const NicheCard: React.FC<NicheCardProps> = ({ icon, title, description }) => (
  <div className="futuristic-card p-8 h-full">
    <ScrollAnimator animation="zoom-in" delay={200}>
        <div className="text-white icon-glow">{icon}</div>
    </ScrollAnimator>
    <h3 className="text-xl font-bold text-white mt-4 mb-2">{title}</h3>
    <p className="text-brand-light-accent">{description}</p>
  </div>
);

const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, points, highlighted = false }) => {
    const cardClasses = highlighted
      ? 'bg-gradient-to-br from-brand-secondary to-brand-primary text-white shadow-2xl shadow-brand-primary/20 rounded-2xl'
      : 'futuristic-card';
    const iconColor = 'text-white';
    const titleColor = 'text-white';
    const checkColor = highlighted ? 'text-brand-accent-light/80' : 'text-brand-primary';

    return (
        <div className={`p-8 flex flex-col h-full ${cardClasses} transition-all duration-300`}>
            <ScrollAnimator animation="zoom-in" delay={200}>
                <div className={`${iconColor} ${!highlighted ? 'icon-glow' : ''}`}>{icon}</div>
            </ScrollAnimator>
            <h3 className={`text-xl font-bold mt-4 mb-4 ${titleColor}`}>{title}</h3>
            <ul className="space-y-3 list-inside mt-auto">
                {points.map((point, index) => (
                    <li key={index} className="flex items-start">
                        <svg className={`w-5 h-5 ${checkColor} mr-2 flex-shrink-0 mt-1`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>{point}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const StarIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
);

const TestimonialCard: React.FC<TestimonialCardProps> = ({ quote, name, company, avatarInitial }) => (
  <div className="futuristic-card p-8 h-full flex flex-col">
    <div className="flex text-yellow-400 mb-4">
      {[...Array(5)].map((_, i) => <StarIcon key={i} className="w-5 h-5" />)}
    </div>
    <p className="text-brand-light-accent italic">"{quote}"</p>
    <div className="mt-auto pt-6 flex items-center">
      <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center mr-4 ring-2 ring-brand-primary/30">
        <span className="text-xl font-bold text-brand-accent-light">{avatarInitial}</span>
      </div>
      <div>
        <h4 className="font-bold text-white">{name}</h4>
        <p className="text-sm text-brand-light-muted">{company}</p>
      </div>
    </div>
  </div>
);

const CaseStudyCard: React.FC<CaseStudyCardProps> = ({ client, challenge, solution, results }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="futuristic-card overflow-hidden">
            <button
                className="w-full text-left p-6 flex justify-between items-center transition-colors hover:bg-gray-700"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
            >
                <h3 className="text-xl font-bold text-white">{client}</h3>
                <svg
                    className={`w-6 h-6 text-brand-light-accent transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="p-6 border-t border-gray-600/30">
                    <div className="mb-4">
                        <h4 className="font-semibold text-brand-primary mb-1">El Reto</h4>
                        <p className="text-brand-light-accent">{challenge}</p>
                    </div>
                    <div className="mb-6">
                        <h4 className="font-semibold text-brand-primary mb-1">La Solución</h4>
                        <p className="text-brand-light-accent">{solution}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-brand-primary mb-2">Resultados</h4>
                        <ul className="space-y-2">
                            {results.map((result, index) => (
                                <li key={index} className="flex items-center">
                                    <span className="text-2xl mr-3">{result.icon}</span>
                                    <span className="text-brand-light-accent">{result.text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Contact Form Component ---
const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [responseMessage, setResponseMessage] = useState('');
  const accessKey = '9a97eb6e-954b-4d51-aa34-237f62afe4d3';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionStatus('idle');

    const data = {
      ...formData,
      access_key: accessKey,
      subject: `Nuevo Diagnóstico de ${formData.name} - ${formData.company}`,
    };

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setResponseMessage('¡Gracias! Hemos recibido tu solicitud. Te contactaremos pronto.');
        setSubmissionStatus('success');
        setFormData({ name: '', company: '', phone: '', message: '' }); // Reset form
      } else {
        setResponseMessage(result.message || 'Ocurrió un error al enviar el formulario. Por favor, inténtalo de nuevo.');
        setSubmissionStatus('error');
      }
    } catch (error) {
      setResponseMessage('Ocurrió un error de red. Por favor, verifica tu conexión e inténtalo de nuevo.');
      setSubmissionStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="mt-10 max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-brand-light-accent text-left mb-2">Nombre Completo</label>
            <input type="text" name="name" id="name" required value={formData.name} onChange={handleChange} className="form-input" placeholder="Tu nombre" />
          </div>
          <div>
            <label htmlFor="company" className="block text-sm font-semibold text-brand-light-accent text-left mb-2">Empresa</label>
            <input type="text" name="company" id="company" required value={formData.company} onChange={handleChange} className="form-input" placeholder="Nombre de tu empresa" />
          </div>
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-brand-light-accent text-left mb-2">Número de Teléfono</label>
          <input type="tel" name="phone" id="phone" required value={formData.phone} onChange={handleChange} className="form-input" placeholder="+1 (555) 123-4567" />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-semibold text-brand-light-accent text-left mb-2">Describe tu reto o problema</label>
          <textarea name="message" id="message" rows={4} required value={formData.message} onChange={handleChange} className="form-textarea" placeholder="Ej: 'Tardamos mucho en agendar citas con clientes...'"></textarea>
        </div>
        <div>
          <button type="submit" disabled={isSubmitting} className="w-full inline-block bg-brand-primary text-white font-bold py-4 px-8 rounded-full shadow-lg shadow-brand-primary/30 transform hover:-translate-y-1 transition-all duration-300 hover:bg-gradient-to-r hover:from-brand-primary hover:to-brand-secondary hover:shadow-[0_10px_24px_rgba(255,107,0,0.35)] disabled:opacity-50 disabled:cursor-not-allowed">
            {isSubmitting ? 'Enviando...' : 'Reserva tu diagnóstico ahora'}
          </button>
        </div>
      </form>
      {submissionStatus !== 'idle' && (
        <div className={`mt-4 text-center p-4 rounded-lg ${submissionStatus === 'success' ? 'bg-blue-500/10 text-blue-400' : 'bg-red-500/10 text-red-400'}`}>
          {responseMessage}
        </div>
      )}
      <p className="mt-4 text-sm text-brand-light-muted">Cupos limitados: solo 5 implementaciones nuevas por mes.</p>
    </div>
  );
};
  
const App: React.FC = () => {
    const navItems = [
        { href: "#servicios", label: "Servicios" },
        { href: "#testimonios", label: "Testimonios" },
        { href: "#proceso", label: "Proceso" },
    ];

    const realTestimonials: {
        quote: string;
        name: string;
        company: string;
        stats: string[];
        avatarInitial: string;
    }[] = [
        {
          quote: "El sistema de Makely funciona solo y nunca se le pasa una cita. Antes tardábamos horas al día en responder y agendar, ahora todo ocurre automáticamente.",
          name: "Gerente de Clínica Estética",
          company: "Clínica Estética",
          stats: [
            "–75 % tiempo operativo",
            "+22 % citas mensuales",
            "–30 % cancelaciones"
          ],
          avatarInitial: 'G',
        },
        {
          quote: "El agente IA se volvió parte del equipo. Ahora todos los clientes reciben respuestas inmediatas y tenemos una base de datos completa sin hacer nada manualmente.",
          name: "Kenneth Ortega",
          company: "CEO, APILimits Agency",
          stats: [
            "–60 % consultas repetitivas",
            "+20 % cierres de venta",
            "+900 registros/mes"
          ],
          avatarInitial: 'K',
        },
        {
          quote: "El sistema trabaja incluso fuera del horario laboral. Nos entrega leads calificados todos los días y nos ahorró casi todo el trabajo operativo de prospección.",
          name: "Juan León",
          company: "Cofundador, Lion Spirit Marketing",
          stats: [
            "+150 leads calificados/semana",
            "+12 % tasa de conversión",
            "–80 % tiempo manual"
          ],
          avatarInitial: 'J',
        }
    ];
    
    const processSteps = [
        { title: 'Diagnóstico', description: 'Analizamos tu operación actual y detectamos oportunidades de automatización.' },
        { title: 'Diseño del sistema', description: 'Definimos los flujos, integraciones y lógica de IA ideales para tu negocio.' },
        { title: 'Implementación', description: 'Conectamos herramientas, configuramos agentes y dejamos los procesos corriendo.' },
        { title: 'Validación y ajustes', description: 'Probamos, medimos y optimizamos hasta asegurar precisión 24/7.' },
        { title: 'Entrega y soporte', description: 'Documentamos, capacitamos y acompañamos para escalar sin fricción.' }
    ];

    const [isPastHero, setIsPastHero] = useState(false);
    const [isInFinalCTA, setIsInFinalCTA] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProcessExpanded, setIsProcessExpanded] = useState(false);
    
    const heroRef = useRef<HTMLElement | null>(null);
    const ctaFinalRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        // Body scroll lock for mobile menu
        if (isMobileMenuOpen) {
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.overflow = 'auto';
        }
        return () => {
          document.body.style.overflow = 'auto';
        };
    }, [isMobileMenuOpen]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const cards = document.querySelectorAll('.futuristic-card');
            cards.forEach(card => {
                const rect = (card as HTMLElement).getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                (card as HTMLElement).style.setProperty('--mouse-x', `${x}px`);
                (card as HTMLElement).style.setProperty('--mouse-y', `${y}px`);
            });
        };
        window.addEventListener('mousemove', handleMouseMove);

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.target.id === 'hero') {
                    setIsPastHero(!entry.isIntersecting && entry.boundingClientRect.bottom < 0);
                }
                if (entry.target.id === 'cta-final') {
                    setIsInFinalCTA(entry.isIntersecting);
                }
            });
        }, { threshold: [0, 0.1] });

        const heroCurrent = heroRef.current;
        const ctaCurrent = ctaFinalRef.current;

        if (heroCurrent) observer.observe(heroCurrent);
        if (ctaCurrent) observer.observe(ctaCurrent);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (heroCurrent) observer.unobserve(heroCurrent);
            if (ctaCurrent) observer.unobserve(ctaCurrent);
        };
    }, []);

    const showFloatingButton = isPastHero && !isInFinalCTA;
    const handleNavLinkClick = () => setIsMobileMenuOpen(false);
    
    const handleScrollToHero = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const targetElement = document.getElementById('hero');
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    };

  return (
    <div className="app-container bg-gray-950 text-brand-light-accent relative">
        <AnimatedBackground />
        
        <header className="bg-gray-850/50 backdrop-blur-md sticky top-0 z-50 border-b border-gray-600/20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <a href="#hero" onClick={(e) => { handleScrollToHero(e); handleNavLinkClick(); }} className="text-2xl font-bold text-white tracking-wider">MAKELY<span className="text-brand-primary">.</span></a>
                    
                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        <nav className="flex items-center gap-8">
                            {navItems.map(item => <NavLink key={item.href} href={item.href}>{item.label}</NavLink>)}
                        </nav>
                        <PrimaryButton href="#cta-final" className="py-2 px-5 text-sm">
                            Reserva tu diagnóstico
                        </PrimaryButton>
                    </div>

                    {/* Mobile Navigation Button */}
                    <div className="md:hidden">
                        <button onClick={() => setIsMobileMenuOpen(true)} aria-label="Abrir menú" className="text-white p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </header>

        {/* Mobile Menu Overlay */}
        <div className={`fixed inset-0 z-[60] bg-gray-950/95 backdrop-blur-lg transition-opacity duration-300 md:hidden ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col items-center justify-center">
                <button onClick={() => setIsMobileMenuOpen(false)} aria-label="Cerrar menú" className="absolute top-7 right-4 text-white p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <nav className="flex flex-col items-center gap-8">
                    {navItems.map(item => (
                        <NavLink key={item.href} href={item.href} onClick={handleNavLinkClick} className="text-2xl text-white">
                            {item.label}
                        </NavLink>
                    ))}
                </nav>
                <PrimaryButton href="#cta-final" onClick={handleNavLinkClick} className="mt-12 py-3 px-6 text-lg">
                    Reserva tu diagnóstico
                </PrimaryButton>
            </div>
        </div>


        <main>
            <section ref={heroRef} id="hero" className="relative text-center min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center py-20 px-4 overflow-hidden">
                <div className="absolute inset-0 hero-gradient-bg -z-10"></div>
                <div className="max-w-5xl mx-auto">
                    <ScrollAnimator animation="fade-in" delay={0}>
                       <h1
                          className="
                            text-4xl sm:text-5xl md:text-6xl
                            font-extrabold text-white
                            leading-tight tracking-tighter
                            text-center max-w-4xl mx-auto
                          "
                        >
                          ¿Tu equipo pierde horas en tareas repetitivas?
                        </h1>
                        <h2
                          className="
                            mt-4
                            text-3xl sm:text-4xl md:text-5xl
                            font-bold hero-glow
                            text-center
                          "
                        >
                          La IA trabaja mientras tú creces.
                        </h2>
                    </ScrollAnimator>
                    <ScrollAnimator animation="fade-in" delay={150}>
                        <p className="mt-8 text-base md:text-lg leading-relaxed text-brand-light-accent max-w-2xl mx-auto">
                           Automatizamos tus procesos de marketing, ventas y atención al cliente para que tu negocio funcione 24/7 sin más personal.
                        </p>
                    </ScrollAnimator>
                    <ScrollAnimator animation="fade-in" delay={300}>
                        <div className="mt-10">
                            <PrimaryButton href="#cta-final" className="py-4 px-8 text-lg inline-flex items-center">
                                 <span className="mr-3 text-xl" aria-hidden="true">⚡</span>
                                 Reserva tu diagnóstico y libera +20 h/semana con IA
                            </PrimaryButton>
                            <p className="mt-6 text-sm text-brand-light-muted max-w-md mx-auto">
                                Negocios y agencias ya automatizan sus procesos con Makely.
                            </p>
                        </div>
                    </ScrollAnimator>
                    <ScrollAnimator animation="fade-in" delay={450}>
                        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-brand-light-accent font-semibold">
                            <span className="flex items-center gap-2"><span aria-hidden="true">✅</span> Sin cambiar tus herramientas</span>
                            <span className="flex items-center gap-2"><span aria-hidden="true">⚡</span> Implementación rápida</span>
                            <span className="flex items-center gap-2"><span aria-hidden="true">📈</span> Listo para escalar</span>
                        </div>
                    </ScrollAnimator>
                </div>
            </section>

            <section id="nichos" className="py-20 md:py-28 bg-gray-900">
                 <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto">
                      <ScrollAnimator>
                          <h2 className="text-3xl md:text-4xl font-bold text-white">Nuestros Nichos de Especialización</h2>
                          <p className="mt-4 text-lg text-brand-light-accent">Creamos soluciones a medida para negocios que necesitan escalar de forma inteligente.</p>
                      </ScrollAnimator>
                    </div>
                    <div className="mt-12 grid gap-8 md:grid-cols-3">
                        <ScrollAnimator animation="zoom-in" delay={0}>
                           <NicheCard icon={icons.agencies} title="Agencias y Freelancers B2B" description="Automatización de reportes, onboarding y cobros." />
                        </ScrollAnimator>
                        <ScrollAnimator animation="zoom-in" delay={150}>
                           <NicheCard icon={icons.ecommerce} title="E-commerce y Tiendas Online" description="Correos automáticos, recuperación de carritos y análisis de ventas con IA." />
                        </ScrollAnimator>
                        <ScrollAnimator animation="zoom-in" delay={300}>
                          <NicheCard icon={icons.services} title="Servicios con Agendamiento" description="Asistentes de IA que agendan, confirman y gestionan citas automáticamente." />
                        </ScrollAnimator>
                    </div>
                </div>
            </section>

            <section id="servicios" className="py-20 md:py-28 bg-gray-950 overflow-hidden">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto">
                        <ScrollAnimator>
                            <h2 className="text-3xl md:text-4xl font-bold text-white">Servicios Principales</h2>
                            <p className="mt-4 text-lg text-brand-light-accent">Soluciones de automatización e IA para cada etapa de tu negocio.</p>
                        </ScrollAnimator>
                    </div>
                </div>
                <div className="mt-12">
                    <div className="flex gap-8 overflow-x-auto pb-8 px-4 sm:px-6 lg:px-8 scroll-snap-x-mandatory horizontal-scroll" style={{ scrollbarWidth: 'thin' }}>
                         <div className="flex-shrink-0 w-[calc(100%-2rem)] sm:w-[380px] md:w-[420px] scroll-snap-align-center">
                            <ScrollAnimator delay={0}><ServiceCard icon={icons.marketing} title="Automatización de Marketing y Ventas" points={["Captura y clasificación automática de leads.", "Seguimiento inteligente por correo o chat.", "Flujos de cierre, recordatorios y pagos."]} /></ScrollAnimator>
                         </div>
                         <div className="flex-shrink-0 w-[calc(100%-2rem)] sm:w-[380px] md:w-[420px] scroll-snap-align-center">
                            <ScrollAnimator delay={150}><ServiceCard icon={icons.assistants} title="Asistentes Inteligentes y Agendamientos" points={["Bots IA que atienden, agendan y confirman citas.", "Integración con Google Calendar, WhatsApp y correo.", "Recordatorios y mensajes personalizados."]} highlighted /></ScrollAnimator>
                         </div>
                         <div className="flex-shrink-0 w-[calc(100%-2rem)] sm:w-[380px] md:w-[420px] scroll-snap-align-center">
                            <ScrollAnimator delay={300}><ServiceCard icon={icons.reports} title="Reportes y Análisis con IA" points={["Reportes automáticos de campañas y ventas.", "Dashboards conectados a Meta Ads, CRM y Sheets.", "Auditorías inteligentes con GPT."]} /></ScrollAnimator>
                         </div>
                         <div className="flex-shrink-0 w-[calc(100%-2rem)] sm:w-[380px] md:w-[420px] scroll-snap-align-center">
                            <ScrollAnimator delay={450}><ServiceCard icon={icons.onboarding} title="Gestión y Onboarding de Clientes" points={["Flujos de bienvenida, contratos y pagos automatizados.", "Centralización de datos.", "Seguimiento automatizado por correo o WhatsApp."]} /></ScrollAnimator>
                         </div>
                    </div>
                </div>
            </section>

            <section id="testimonios" className="py-20 md:py-28 bg-gray-900">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto">
                        <ScrollAnimator>
                            <h2 className="text-3xl md:text-4xl font-bold text-white">Testimonios Reales</h2>
                            <p className="mt-4 text-lg text-brand-light-accent">Descubre por qué nuestros clientes confían en nosotros para llevar sus negocios al siguiente nivel.</p>
                        </ScrollAnimator>
                    </div>

                    <div className="mt-16 grid gap-8 md:grid-cols-1 lg:grid-cols-3">
                        {realTestimonials.map((testimonial, index) => (
                            <ScrollAnimator key={index} animation="slide-in-up" delay={index * 150}>
                                <div className="futuristic-card p-8 h-full flex flex-col">
                                    <div>
                                        <div className="flex text-yellow-400 mb-4">
                                            {[...Array(5)].map((_, i) => <StarIcon key={i} className="w-5 h-5" />)}
                                        </div>
                                        <p className="text-brand-light-accent italic text-base leading-relaxed">"{testimonial.quote}"</p>
                                    </div>
                                    
                                    <div className="my-6 py-4 border-y border-gray-700/50 space-y-2">
                                        {testimonial.stats.map((stat, statIndex) => (
                                            <p key={statIndex} className="text-sm font-semibold text-brand-light flex items-center">
                                                <span className="text-brand-primary mr-2">›</span>
                                                {stat.trim().replace(/  /g, ' ')}
                                            </p>
                                        ))}
                                    </div>

                                    <div className="mt-auto pt-4 flex items-center">
                                      <div className="w-14 h-14 rounded-full bg-gray-700 flex items-center justify-center ring-2 ring-brand-primary/30">
                                          <span className="text-2xl font-bold text-brand-accent-light">{testimonial.avatarInitial}</span>
                                      </div>
                                      <div className="ml-4">
                                        <h4 className="font-bold text-white">{testimonial.name}</h4>
                                        <p className="text-sm text-brand-light-muted">{testimonial.company}</p>
                                      </div>
                                    </div>
                                </div>
                            </ScrollAnimator>
                        ))}
                    </div>

                    <div className="mt-20 text-center">
                        <ScrollAnimator animation="fade-in">
                             <p className="text-lg text-brand-light-accent mb-6">¿Listo para automatizar tus resultados?</p>
                             <PrimaryButton href="#cta-final">
                                Reserva tu diagnóstico gratuito
                             </PrimaryButton>
                        </ScrollAnimator>
                    </div>
                </div>
            </section>
            
            <section id="proceso" className="py-20 md:py-28 bg-gray-900">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto">
                        <ScrollAnimator>
                            <button
                                onClick={() => setIsProcessExpanded(!isProcessExpanded)}
                                aria-expanded={isProcessExpanded}
                                className="w-full text-center group"
                            >
                                <h2 className="text-4xl md:text-5xl font-bold text-white group-hover:text-brand-primary transition-colors duration-300">¿Como funciona nuestro proceso?</h2>
                                <p className="mt-4 text-lg text-brand-light-accent">
                                    Un camino claro y transparente en cinco pasos, desde el diagnóstico hasta tu sistema automatizado funcionando 24/7.
                                </p>
                                <div className="mt-6 flex justify-center">
                                    <svg
                                        className={`w-8 h-8 text-brand-light-accent transform transition-transform duration-300 ${isProcessExpanded ? 'rotate-180' : ''}`}
                                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </button>
                        </ScrollAnimator>
                    </div>

                    <div className={`transition-all duration-700 ease-in-out overflow-hidden ${isProcessExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="relative mt-20 max-w-3xl mx-auto">
                            <div className="absolute left-4 top-4 h-[calc(100%-2rem)] w-0.5 bg-gray-700/50" aria-hidden="true"></div>
                            <div className="space-y-12">
                                {processSteps.map((step, index) => (
                                    <ScrollAnimator key={index} animation="slide-in-up" delay={index * 150}>
                                        <div className="relative pl-12">
                                            <div className="absolute left-4 top-1 -ml-2 h-4 w-4 rounded-full bg-brand-primary border-4 border-gray-900" aria-hidden="true"></div>
                                            <div className="p-6 bg-gray-850 rounded-xl border border-gray-700/50">
                                                <h3 className="text-lg font-bold text-white mb-1">
                                                    <span className="text-brand-primary">Paso {index + 1}:</span> {step.title}
                                                </h3>
                                                <p className="text-brand-light-accent">{step.description}</p>
                                            </div>
                                        </div>
                                    </ScrollAnimator>
                                ))}
                            </div>
                        </div>
                        <div className="mt-20 text-center">
                            <ScrollAnimator animation="fade-in">
                                <p className="text-lg text-brand-light-accent mb-6">¿Listo para empezar con tu propio sistema?</p>
                                <PrimaryButton href="#cta-final">Reserva tu diagnóstico gratuito</PrimaryButton>
                            </ScrollAnimator>
                        </div>
                    </div>
                </div>
            </section>

            <section ref={ctaFinalRef} id="cta-final" className="py-20 md:py-28 bg-gradient-to-b from-gray-900 to-gray-850">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
                    <ScrollAnimator animation="zoom-in">
                        <h2 className="text-4xl md:text-5xl font-bold text-white">Descubre cómo ahorrar 20 horas por semana con IA</h2>
                        <p className="mt-4 text-lg text-brand-light-accent">Solo necesitas 20 minutos para descubrir cómo automatizar tus procesos de marketing y ventas con IA.</p>
                        <ContactForm />
                    </ScrollAnimator>
                </div>
            </section>

            <footer id="cierre" className="bg-gray-850 text-brand-light-accent py-16">
                 <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
                    <ScrollAnimator animation="fade-in">
                        <a href="#hero" onClick={handleScrollToHero} className="text-2xl font-bold text-white tracking-wider mb-8 inline-block">MAKELY<span className="text-brand-primary">.</span></a>
                        <p className="text-lg italic">
                        “El futuro de los negocios no está en trabajar más, sino en trabajar mejor con ayuda de la IA. Nuestro objetivo es liberar tu tiempo, reducir costos y ayudarte a construir sistemas que crecen contigo.”
                        </p>
                    </ScrollAnimator>
                </div>
            </footer>
        </main>
        <FloatingCTAButton isVisible={showFloatingButton} />
    </div>
  );
};

export default App;