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
                            showNotification('¡Consulta enviada exitosamente! Te contactaremos en menos de 24 horas.', 'success');
                            quoteForm.reset();
                        } else {
                            showNotification(response.message || 'Error al procesar la consulta. Inténtalo de nuevo.', 'error');
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        showNotification('Consulta recibida. Te contactaremos pronto.', 'success');
                        quoteForm.reset();
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
    const requiredFields = ['nombre', 'email', 'telefono', 'tipo-accidente'];
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
        return { success: true, message: 'Consulta recibida correctamente' };
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

let observer;
let animatedElements = [];

// Function to show element with animation
function showElement(el) {
    el.classList.add('fade-in-up');
    el.style.opacity = '1';
    el.style.transform = '';
}

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    animatedElements = document.querySelectorAll('.why-card, .coverage-card, .testimonial-card, .benefit-item');
    
    // Set initial state only if IntersectionObserver is supported
    if (typeof IntersectionObserver !== 'undefined') {
        try {
            observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        showElement(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);
            
            animatedElements.forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
                observer.observe(el);
            });
            
            // Fallback: Show elements after 2 seconds if observer hasn't triggered
            setTimeout(() => {
                animatedElements.forEach(el => {
                    if (el.style.opacity === '0') {
                        showElement(el);
                    }
                });
            }, 2000);
        } catch (error) {
            console.error('Error initializing IntersectionObserver:', error);
            // If observer fails, show all elements immediately
            animatedElements.forEach(el => {
                showElement(el);
            });
        }
    } else {
        // If IntersectionObserver is not supported, show elements immediately
        animatedElements.forEach(el => {
            showElement(el);
        });
    }
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
    const fechaAccidente = document.getElementById('fecha-accidente');
    
    if (fechaAccidente) {
        // Set maximum date to today (accidents can't be in the future)
        const today = new Date().toISOString().split('T')[0];
        fechaAccidente.setAttribute('max', today);
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
    // Safety check: ensure translations object exists
    if (typeof translations === 'undefined' || !translations) {
        console.warn('Translations object not loaded');
        return key;
    }
    
    const keys = key.split('.');
    let value = translations[lang];
    
    // Fallback to Spanish if language not available
    if (!value && lang !== 'es') {
        value = translations.es;
    }
    
    if (!value) {
        return key;
    }
    
    for (const k of keys) {
        if (value && typeof value === 'object' && value[k]) {
            value = value[k];
        } else {
            // Fallback to Spanish if translation not found
            if (lang !== 'es' && translations.es) {
                value = translations.es;
                for (const k2 of keys) {
                    if (value && typeof value === 'object' && value[k2]) {
                        value = value[k2];
                    } else {
                        return key;
                    }
                }
            } else {
                return key;
            }
            break;
        }
    }
    
    return (typeof value === 'string' ? value : key) || key;
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
        try {
            const key = element.getAttribute('data-translate');
            const translation = t(key, lang);
            
            // Only update if translation is valid (not the key itself)
            if (!translation || translation === key) {
                return;
            }
            
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
        } catch (error) {
            console.error('Error updating element:', error);
        }
    });
    
    // Update specific elements that need special handling
    updateSpecialElements(lang);
    
    // Update HTML lang attribute
    document.documentElement.lang = lang;
}

// Function to update special elements
function updateSpecialElements(lang) {
    try {
        // Hero section
        const heroBadge = document.querySelector('.hero-badge span');
        if (heroBadge) {
            const text = t('hero.badge', lang);
            if (text && text !== 'hero.badge') heroBadge.textContent = text;
        }
        
        const titleLine = document.querySelector('.title-line');
        if (titleLine) {
            const text = t('hero.titleLine', lang);
            if (text && text !== 'hero.titleLine') titleLine.textContent = text + ' ';
        }
        
        const heroSubtitle = document.querySelector('.hero-subtitle');
        if (heroSubtitle) {
            const text = t('hero.subtitle', lang);
            if (text && text !== 'hero.subtitle') heroSubtitle.textContent = text;
        }
        
        const heroFeatures = document.querySelectorAll('.hero-feature span');
        if (heroFeatures.length >= 3) {
            const texts = [
                t('hero.feature1', lang),
                t('hero.feature2', lang),
                t('hero.feature3', lang)
            ];
            heroFeatures.forEach((el, idx) => {
                if (texts[idx] && texts[idx] !== `hero.feature${idx + 1}`) {
                    el.textContent = texts[idx];
                }
            });
        }
        
        const trustText = document.querySelector('.trust-text');
        if (trustText) {
            const text = t('hero.trustText', lang);
            if (text && text !== 'hero.trustText') trustText.textContent = text;
        }
        
        const trustBadges = document.querySelectorAll('.trust-badge span');
        if (trustBadges.length >= 3) {
            const texts = [
                t('hero.certificado', lang),
                t('hero.seguro', lang),
                t('hero.soporte', lang)
            ];
            trustBadges.forEach((el, idx) => {
                if (texts[idx] && texts[idx] !== ['hero.certificado', 'hero.seguro', 'hero.soporte'][idx]) {
                    el.textContent = texts[idx];
                }
            });
        }
        
        // Section headers
        const sectionTags = document.querySelectorAll('.section-tag');
        const sectionTitles = document.querySelectorAll('.section-title');
        const sectionSubtitles = document.querySelectorAll('.section-subtitle');
        
        const sectionKeys = [
            { tag: 'sections.whyTag', title: 'sections.whyTitle', subtitle: 'sections.whySubtitle' },
            { tag: 'sections.coverageTag', title: 'sections.coverageTitle', subtitle: 'sections.coverageSubtitle' },
            { tag: 'sections.benefitsTag', title: 'sections.benefitsTitle', subtitle: 'sections.benefitsSubtitle' },
            { tag: 'sections.testimonialsTag', title: 'sections.testimonialsTitle', subtitle: 'sections.testimonialsSubtitle' },
            { tag: 'sections.quoteTag', title: 'sections.quoteTitle', subtitle: 'sections.quoteSubtitle' },
            { tag: 'sections.faqTag', title: 'sections.faqTitle', subtitle: null }
        ];
        
        sectionKeys.forEach((keys, idx) => {
            if (keys.tag && sectionTags[idx]) {
                const text = t(keys.tag, lang);
                if (text && text !== keys.tag) sectionTags[idx].textContent = text;
            }
            if (keys.title && sectionTitles[idx]) {
                const text = t(keys.title, lang);
                if (text && text !== keys.title) sectionTitles[idx].textContent = text;
            }
            if (keys.subtitle && sectionSubtitles[idx]) {
                const text = t(keys.subtitle, lang);
                if (text && text !== keys.subtitle) sectionSubtitles[idx].textContent = text;
            }
        });
        
        // Why cards
        const whyCards = document.querySelectorAll('.why-card');
        if (whyCards.length >= 6) {
            const whyKeys = [
                { title: 'why.title1', text: 'why.text1' },
                { title: 'why.title2', text: 'why.text2' },
                { title: 'why.title3', text: 'why.text3' },
                { title: 'why.title4', text: 'why.text4' },
                { title: 'why.title5', text: 'why.text5' },
                { title: 'why.title6', text: 'why.text6' }
            ];
            
            whyKeys.forEach((keys, idx) => {
                const h3 = whyCards[idx]?.querySelector('h3');
                const p = whyCards[idx]?.querySelector('p');
                
                if (h3) {
                    const text = t(keys.title, lang);
                    if (text && text !== keys.title) h3.textContent = text;
                }
                if (p) {
                    const text = t(keys.text, lang);
                    if (text && text !== keys.text) p.textContent = text;
                }
            });
        }
    } catch (error) {
        console.error('Error updating special elements:', error);
    }
}

// Initialize language selector
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit to ensure translations.js is loaded
    setTimeout(() => {
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
        // Only update if translations are available
        if (typeof translations !== 'undefined' && translations) {
            updateTranslations(currentLanguage);
        } else {
            console.warn('Translations not loaded, skipping translation update');
        }
    }, 100);
});
