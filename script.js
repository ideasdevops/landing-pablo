// ============================================
// SMOOTH SCROLLING
// ============================================
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const sectionPosition = section.offsetTop - headerHeight;
        
        window.scrollTo({
            top: sectionPosition,
            behavior: 'smooth'
        });
    }
}

// ============================================
// MOBILE NAVIGATION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navMenu.contains(event.target) || navToggle.contains(event.target);
            if (!isClickInsideNav && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
});

// ============================================
// HEADER SCROLL EFFECT
// ============================================
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// ============================================
// QUOTE FORM HANDLING
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const quoteForm = document.getElementById('quoteForm');
    
    if (quoteForm) {
        quoteForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(quoteForm);
            const data = Object.fromEntries(formData);
            
            // Validate form
            if (validateQuoteForm(data)) {
                // Show loading state
                const submitBtn = quoteForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
                submitBtn.disabled = true;
                
                // Send data to backend
                sendQuoteData(data)
                    .then(response => {
                        if (response.success) {
                            showNotification('¡Cotización enviada exitosamente! Te contactaremos pronto.', 'success');
                            quoteForm.reset();
                        } else {
                            showNotification(response.message || 'Error al procesar la cotización. Inténtalo de nuevo.', 'error');
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        showNotification('Error de conexión. Por favor, inténtalo de nuevo.', 'error');
                    })
                    .finally(() => {
                        // Restore button state
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                    });
            }
        });
    }
});

// ============================================
// FORM VALIDATION
// ============================================
function validateQuoteForm(data) {
    const requiredFields = ['nombre', 'email', 'telefono', 'fecha-inicio', 'fecha-fin', 'viajeros', 'plan'];
    let isValid = true;
    
    requiredFields.forEach(field => {
        const input = document.getElementById(field);
        if (!data[field] || data[field].trim() === '') {
            showFieldError(input, 'Este campo es obligatorio');
            isValid = false;
        } else {
            clearFieldError(input);
        }
    });
    
    // Email validation
    const email = data.email;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
        const emailInput = document.getElementById('email');
        showFieldError(emailInput, 'Por favor ingresa un email válido');
        isValid = false;
    }
    
    // Date validation
    const fechaInicio = new Date(data['fecha-inicio']);
    const fechaFin = new Date(data['fecha-fin']);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    if (fechaInicio < hoy) {
        const fechaInicioInput = document.getElementById('fecha-inicio');
        showFieldError(fechaInicioInput, 'La fecha de inicio no puede ser anterior a hoy');
        isValid = false;
    }
    
    if (fechaFin <= fechaInicio) {
        const fechaFinInput = document.getElementById('fecha-fin');
        showFieldError(fechaFinInput, 'La fecha de fin debe ser posterior a la fecha de inicio');
        isValid = false;
    }
    
    return isValid;
}

// ============================================
// FIELD ERROR HANDLING
// ============================================
function showFieldError(input, message) {
    clearFieldError(input);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #ef4444;
        font-size: 0.875rem;
        margin-top: 0.5rem;
        display: block;
    `;
    
    input.parentNode.appendChild(errorDiv);
    input.style.borderColor = '#ef4444';
}

function clearFieldError(input) {
    const existingError = input.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    input.style.borderColor = '';
}

// ============================================
// SEND QUOTE DATA
// ============================================
async function sendQuoteData(data) {
    try {
        const response = await fetch('/api/quote', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error sending data:', error);
        // For demo purposes, simulate success
        return { success: true, message: 'Cotización recibida correctamente' };
    }
}

// ============================================
// NOTIFICATIONS
// ============================================
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add styles
    const bgColor = type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#0066cc';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 1rem;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// ============================================
// FAQ ACCORDION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
});

// ============================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.why-card, .coverage-card, .testimonial-card, .benefit-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        observer.observe(el);
    });
});

// ============================================
// SCROLL PROGRESS INDICATOR
// ============================================
function createScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 4px;
        background: linear-gradient(90deg, #0066cc, #00a86b);
        z-index: 10000;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

// Initialize scroll progress
document.addEventListener('DOMContentLoaded', createScrollProgress);

// ============================================
// NAVIGATION LINKS SMOOTH SCROLL
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Add click handlers to all navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const targetId = href.substring(1);
                scrollToSection(targetId);
            }
        });
    });
    
    // Add click handlers to buttons
    const buttons = document.querySelectorAll('button[onclick^="scrollToSection"]');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const onclick = this.getAttribute('onclick');
            const match = onclick.match(/scrollToSection\('([^']+)'\)/);
            if (match) {
                scrollToSection(match[1]);
            }
        });
    });
});

// ============================================
// DATE INPUT MINIMUM DATE
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const fechaInicio = document.getElementById('fecha-inicio');
    const fechaFin = document.getElementById('fecha-fin');
    
    if (fechaInicio) {
        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        fechaInicio.setAttribute('min', today);
        
        // Update fecha-fin minimum when fecha-inicio changes
        fechaInicio.addEventListener('change', function() {
            if (fechaFin && this.value) {
                const minDate = new Date(this.value);
                minDate.setDate(minDate.getDate() + 1);
                fechaFin.setAttribute('min', minDate.toISOString().split('T')[0]);
            }
        });
    }
});

// ============================================
// ADD NOTIFICATION STYLES
// ============================================
const notificationStyles = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        flex: 1;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 4px;
        transition: background 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .notification-close:hover {
        background: rgba(255, 255, 255, 0.2);
    }
`;

// Inject notification styles
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// ============================================
// LOADING ANIMATION
// ============================================
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Fade in body
    const bodyStyles = `
        body {
            opacity: 0;
            transition: opacity 0.5s ease-in-out;
        }
        
        body.loaded {
            opacity: 1;
        }
    `;
    
    const bodyStyleSheet = document.createElement('style');
    bodyStyleSheet.textContent = bodyStyles;
    document.head.appendChild(bodyStyleSheet);
});

// ============================================
// PARALLAX EFFECT FOR HERO
// ============================================
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    
    if (hero && scrolled < window.innerHeight) {
        const rate = scrolled * 0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// ============================================
// COUNTER ANIMATION (if needed)
// ============================================
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start).toLocaleString();
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toLocaleString();
        }
    }
    
    updateCounter();
}

// ============================================
// FORM AUTO-FILL PREVENTION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Prevent browser autocomplete suggestions
    const inputs = document.querySelectorAll('input[type="email"], input[type="tel"]');
    inputs.forEach(input => {
        input.setAttribute('autocomplete', 'off');
    });
});

// ============================================
// LANGUAGE TRANSLATION SYSTEM
// ============================================
let currentLanguage = localStorage.getItem('language') || 'es';

// Function to get translation
function t(key, lang = currentLanguage) {
    const keys = key.split('.');
    let value = translations[lang];
    
    for (const k of keys) {
        if (value && value[k]) {
            value = value[k];
        } else {
            // Fallback to Spanish if translation not found
            value = translations.es;
            for (const k2 of keys) {
                value = value[k2];
            }
            break;
        }
    }
    
    return value || key;
}

// Function to update all translations
function updateTranslations(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    
    // Update current language indicator
    const langCodes = { es: 'ES', en: 'EN', pt: 'PT' };
    const currentLangSpan = document.getElementById('currentLang');
    if (currentLangSpan) {
        currentLangSpan.textContent = langCodes[lang] || 'ES';
    }
    
    // Update all elements with data-translate attribute
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        const translation = t(key, lang);
        
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            if (element.hasAttribute('placeholder')) {
                element.placeholder = translation;
            } else {
                element.value = translation;
            }
        } else if (element.tagName === 'BUTTON' || element.tagName === 'A') {
            // Preserve icons if they exist
            const icon = element.querySelector('i');
            if (icon) {
                element.innerHTML = icon.outerHTML + ' ' + translation;
            } else {
                element.textContent = translation;
            }
        } else {
            element.textContent = translation;
        }
    });
    
    // Update specific elements that need special handling
    updateSpecialElements(lang);
    
    // Update HTML lang attribute
    document.documentElement.lang = lang;
}

// Function to update special elements
function updateSpecialElements(lang) {
    // Hero section
    const heroBadge = document.querySelector('.hero-badge span');
    if (heroBadge) heroBadge.textContent = t('hero.badge', lang);
    
    const titleLine = document.querySelector('.title-line');
    if (titleLine) titleLine.textContent = t('hero.titleLine', lang) + ' ';
    
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) heroSubtitle.textContent = t('hero.subtitle', lang);
    
    const heroFeatures = document.querySelectorAll('.hero-feature span');
    if (heroFeatures.length >= 3) {
        heroFeatures[0].textContent = t('hero.feature1', lang);
        heroFeatures[1].textContent = t('hero.feature2', lang);
        heroFeatures[2].textContent = t('hero.feature3', lang);
    }
    
    const trustText = document.querySelector('.trust-text');
    if (trustText) trustText.textContent = t('hero.trustText', lang);
    
    const trustBadges = document.querySelectorAll('.trust-badge span');
    if (trustBadges.length >= 3) {
        trustBadges[0].textContent = t('hero.certificado', lang);
        trustBadges[1].textContent = t('hero.seguro', lang);
        trustBadges[2].textContent = t('hero.soporte', lang);
    }
    
    // Section headers
    const sectionTags = document.querySelectorAll('.section-tag');
    const sectionTitles = document.querySelectorAll('.section-title');
    const sectionSubtitles = document.querySelectorAll('.section-subtitle');
    
    // Why section
    if (sectionTags[0]) sectionTags[0].textContent = t('sections.whyTag', lang);
    if (sectionTitles[0]) sectionTitles[0].textContent = t('sections.whyTitle', lang);
    if (sectionSubtitles[0]) sectionSubtitles[0].textContent = t('sections.whySubtitle', lang);
    
    // Coverage section
    if (sectionTags[1]) sectionTags[1].textContent = t('sections.coverageTag', lang);
    if (sectionTitles[1]) sectionTitles[1].textContent = t('sections.coverageTitle', lang);
    if (sectionSubtitles[1]) sectionSubtitles[1].textContent = t('sections.coverageSubtitle', lang);
    
    // Benefits section
    if (sectionTags[2]) sectionTags[2].textContent = t('sections.benefitsTag', lang);
    if (sectionTitles[2]) sectionTitles[2].textContent = t('sections.benefitsTitle', lang);
    if (sectionSubtitles[2]) sectionSubtitles[2].textContent = t('sections.benefitsSubtitle', lang);
    
    // Testimonials section
    if (sectionTags[3]) sectionTags[3].textContent = t('sections.testimonialsTag', lang);
    if (sectionTitles[3]) sectionTitles[3].textContent = t('sections.testimonialsTitle', lang);
    if (sectionSubtitles[3]) sectionSubtitles[3].textContent = t('sections.testimonialsSubtitle', lang);
    
    // Quote section
    if (sectionTags[4]) sectionTags[4].textContent = t('sections.quoteTag', lang);
    if (sectionTitles[4]) sectionTitles[4].textContent = t('sections.quoteTitle', lang);
    if (sectionSubtitles[4]) sectionSubtitles[4].textContent = t('sections.quoteSubtitle', lang);
    
    // FAQ section
    if (sectionTags[5]) sectionTags[5].textContent = t('sections.faqTag', lang);
    if (sectionTitles[5]) sectionTitles[5].textContent = t('sections.faqTitle', lang);
    
    // Why cards
    const whyCards = document.querySelectorAll('.why-card');
    if (whyCards.length >= 6) {
        whyCards[0].querySelector('h3').textContent = t('why.title1', lang);
        whyCards[0].querySelector('p').textContent = t('why.text1', lang);
        whyCards[1].querySelector('h3').textContent = t('why.title2', lang);
        whyCards[1].querySelector('p').textContent = t('why.text2', lang);
        whyCards[2].querySelector('h3').textContent = t('why.title3', lang);
        whyCards[2].querySelector('p').textContent = t('why.text3', lang);
        whyCards[3].querySelector('h3').textContent = t('why.title4', lang);
        whyCards[3].querySelector('p').textContent = t('why.text4', lang);
        whyCards[4].querySelector('h3').textContent = t('why.title5', lang);
        whyCards[4].querySelector('p').textContent = t('why.text5', lang);
        whyCards[5].querySelector('h3').textContent = t('why.title6', lang);
        whyCards[5].querySelector('p').textContent = t('why.text6', lang);
    }
}

// Initialize language selector
document.addEventListener('DOMContentLoaded', function() {
    const langBtn = document.getElementById('langBtn');
    const langDropdown = document.getElementById('langDropdown');
    const langOptions = document.querySelectorAll('.lang-option');
    
    // Toggle dropdown
    if (langBtn && langDropdown) {
        langBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            langDropdown.classList.toggle('active');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!langBtn.contains(e.target) && !langDropdown.contains(e.target)) {
                langDropdown.classList.remove('active');
            }
        });
        
        // Handle language selection
        langOptions.forEach(option => {
            option.addEventListener('click', function(e) {
                e.preventDefault();
                const lang = this.getAttribute('data-lang');
                updateTranslations(lang);
                langDropdown.classList.remove('active');
            });
        });
    }
    
    // Load saved language or default to Spanish
    updateTranslations(currentLanguage);
});
