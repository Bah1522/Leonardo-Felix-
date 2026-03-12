
class MobileMenu {
    constructor() {
        this.mobileMenuBtn = document.getElementById('mobile-menu-btn');
        this.navMenu = document.getElementById('nav-menu');
        this.init();
    }

    init() {
        if (this.mobileMenuBtn && this.navMenu) {
            this.mobileMenuBtn.addEventListener('click', () => this.toggle());
            this.setupNavLinks();
        }
    }

    toggle() {
        this.navMenu.classList.toggle('active');
    }

    close() {
        this.navMenu.classList.remove('active');
    }

    setupNavLinks() {
        const navLinks = this.navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => this.close());
        });
    }
}


class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => this.handleClick(e));
        });
    }

    handleClick(e) {
        const href = e.currentTarget.getAttribute('href');
        
        if (href === '#') {
            return;
        }

        e.preventDefault();
        
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
}

// ============================================
// ANIMAÇÕES AO SCROLL
// ============================================

/**
 * Gerencia animações de elementos ao entrar na viewport
 */
class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        this.init();
    }

    init() {
        const observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            this.observerOptions
        );

        // Elementos a animar
        const elementsToAnimate = [
            '.card',
            '.prazo-card',
            '.doc-card',
            '.contact-card',
            '.service-card'
        ];

        elementsToAnimate.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                observer.observe(el);
            });
        });
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }
}

// ============================================
// ANALYTICS
// ============================================

/**
 * Rastreia eventos e cliques importantes
 */
class Analytics {
    constructor() {
        this.init();
    }

    init() {
        this.trackExternalLinks();
        this.trackCTAClicks();
        this.trackScrollDepth();
    }

    /**
     * Rastreia cliques em links externos
     */
    trackExternalLinks() {
        document.querySelectorAll('a[target="_blank"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                console.log('External link clicked:', href);
                this.sendEvent('external_link', { url: href });
            });
        });
    }

    /**
     * Rastreia cliques em CTAs
     */
    trackCTAClicks() {
        document.querySelectorAll('.btn-primary').forEach(btn => {
            btn.addEventListener('click', () => {
                const text = btn.textContent.trim();
                console.log('CTA clicked:', text);
                this.sendEvent('cta_click', { text });
            });
        });
    }

    /**
     * Rastreia profundidade de scroll
     */
    trackScrollDepth() {
        let maxScroll = 0;

        window.addEventListener('scroll', () => {
            const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                
                if (maxScroll >= 25 && maxScroll < 50) {
                    this.sendEvent('scroll_depth', { depth: '25%' });
                } else if (maxScroll >= 50 && maxScroll < 75) {
                    this.sendEvent('scroll_depth', { depth: '50%' });
                } else if (maxScroll >= 75) {
                    this.sendEvent('scroll_depth', { depth: '75%' });
                }
            }
        });
    }

    /**
     * Envia evento (pode ser integrado com Google Analytics, Mixpanel, etc.)
     */
    sendEvent(eventName, eventData = {}) {
        // Aqui você pode integrar com seu serviço de analytics
        // Exemplo com Google Analytics:
        // gtag('event', eventName, eventData);
        
        console.log(`Event: ${eventName}`, eventData);
    }
}

// ============================================
// FORMULÁRIO DE CONTATO
// ============================================

/**
 * Gerencia formulários de contato
 */
class ContactForm {
    constructor(formSelector) {
        this.form = document.querySelector(formSelector);
        if (this.form) {
            this.init();
        }
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);

        if (this.validate(data)) {
            this.submit(data);
        }
    }

    validate(data) {
        // Validação básica
        if (!data.name || data.name.trim() === '') {
            alert('Por favor, preencha o nome');
            return false;
        }

        if (!data.email || !this.isValidEmail(data.email)) {
            alert('Por favor, preencha um email válido');
            return false;
        }

        if (!data.message || data.message.trim() === '') {
            alert('Por favor, preencha a mensagem');
            return false;
        }

        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    submit(data) {
        console.log('Form submitted:', data);
        
        // Aqui você pode enviar os dados para um servidor
        // Exemplo com fetch:
        // fetch('/api/contact', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(data)
        // })
        // .then(response => response.json())
        // .then(result => console.log('Success:', result))
        // .catch(error => console.error('Error:', error));

        alert('Obrigado pelo contato! Entraremos em contato em breve.');
        this.form.reset();
    }
}

// ============================================
// HEADER STICKY
// ============================================

/**
 * Gerencia comportamento do header ao scroll
 */
class StickyHeader {
    constructor() {
        this.header = document.querySelector('header');
        this.lastScrollY = 0;
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.handleScroll());
    }

    handleScroll() {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 100) {
            this.header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        } else {
            this.header.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
        }

        this.lastScrollY = currentScrollY;
    }
}

// ============================================
// INICIALIZAÇÃO
// ============================================

/**
 * Inicializa todos os componentes quando o DOM está pronto
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('Leonardo Felix - Site Carregado');

    // Inicializar componentes
    new MobileMenu();
    new SmoothScroll();
    new ScrollAnimations();
    new Analytics();
    new StickyHeader();

    // Inicializar formulário de contato se existir
    // new ContactForm('#contact-form');
});

// ============================================
// UTILITÁRIOS
// ============================================

/**
 * Função auxiliar para debounce
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Função auxiliar para throttle
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Função para copiar texto para clipboard
 */
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        console.log('Texto copiado para clipboard');
    }).catch(err => {
        console.error('Erro ao copiar:', err);
    });
}

/**
 * Função para abrir WhatsApp
 */
function openWhatsApp(phone, message = '') {
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// ============================================
// EXPORT (para uso em módulos)
// ============================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        MobileMenu,
        SmoothScroll,
        ScrollAnimations,
        Analytics,
        ContactForm,
        StickyHeader,
        debounce,
        throttle,
        copyToClipboard,
        openWhatsApp
    };
}
