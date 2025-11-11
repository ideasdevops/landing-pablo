// Configuración personalizable para Seguro Viajero Argentina
const CONFIG = {
    // Información del seguro
    seguro: {
        nombre: "Del Campo Seguros",
        titulo: "Viaja Tranquilo a Argentina",
        subtitulo: "Protección completa para tu aventura. Cobertura médica internacional, asistencia 24/7 y respaldo de las mejores aseguradoras.",
        eslogan: "Disfruta Argentina con total tranquilidad",
        viajeros_protegidos: 50000,
        calificacion: 4.9,
        logo: "https://www.delcamposeguros.com/files/imageedit_1_6276820784.png"
    },

    // Información de contacto
    contacto: {
        email: "manuelj@delcampobroker.com",
        telefono: "",
        direccion: "Mendoza, Argentina",
        horario: "Atención 24/7",
        whatsapp: "",
        broker: "Manuel del Campo - Broker Especializado"
    },

    // Redes sociales
    redes: {
        facebook: "#",
        instagram: "#",
        linkedin: "#",
        twitter: "#"
    },

    // Colores del tema
    colores: {
        primario: "#0066cc",
        primario_oscuro: "#0052a3",
        primario_claro: "#3385d6",
        secundario: "#00a86b",
        acento: "#ff6b35",
        exito: "#10b981",
        error: "#ef4444",
        advertencia: "#f59e0b",
        info: "#3b82f6",
        fondo_oscuro: "#1a1a2e",
        fondo_claro: "#f8fafc",
        texto_oscuro: "#1a1a2e",
        texto_claro: "#6b7280"
    },

    // Configuración de animaciones
    animaciones: {
        duracion: 0.6,
        delay: 0.1,
        habilitadas: true
    },

    // Configuración del formulario de cotización
    formulario: {
        campos_requeridos: ['nombre', 'email', 'telefono', 'fecha-inicio', 'fecha-fin', 'viajeros', 'plan'],
        validacion_email: true,
        validacion_fechas: true,
        mensaje_exito: "¡Cotización enviada exitosamente! Te contactaremos pronto.",
        mensaje_error: "Por favor completa todos los campos requeridos."
    },

    // Configuración de planes
    planes: {
        basico: {
            nombre: "Básico - Cobertura Médica",
            descripcion: "Protección médica esencial"
        },
        completo: {
            nombre: "Completo - Protección Total",
            descripcion: "Cobertura médica + equipaje + cancelación"
        },
        premium: {
            nombre: "Premium - Máxima Cobertura",
            descripcion: "Todas las coberturas + beneficios exclusivos"
        }
    },

    // Configuración de analytics
    analytics: {
        google_analytics_id: "", // Agregar tu ID de Google Analytics
        facebook_pixel_id: "", // Agregar tu ID de Facebook Pixel
        habilitado: false
    },

    // Configuración de notificaciones
    notificaciones: {
        duracion: 5000, // 5 segundos
        posicion: "top-right",
        sonido: false
    },

    // Configuración de scroll
    scroll: {
        suave: true,
        velocidad: 0.5,
        mostrar_progreso: true
    },

    // Configuración de carga
    carga: {
        mostrar_loader: true,
        duracion_minima: 1000 // 1 segundo
    },

    // Configuración de responsive
    responsive: {
        breakpoints: {
            mobile: 768,
            tablet: 1024,
            desktop: 1200
        }
    },

    // Configuración de SEO
    seo: {
        titulo: "Seguro Viajero Argentina - Del Campo Seguros | Protección Total para tu Aventura",
        descripcion: "Seguro de viaje especializado para conocer Argentina. Del Campo Seguros te ofrece cobertura médica, equipaje, cancelación y asistencia 24/7. Viaja tranquilo, viaja protegido.",
        palabras_clave: "seguro viaje argentina, del campo seguros, seguro viajero, cobertura médica internacional, seguro turismo argentina, asistencia viajero, manuel del campo",
        imagen_og: "",
        url_canonica: ""
    },

    // Configuración de contenido
    contenido: {
        mostrar_testimonios: true,
        mostrar_coberturas: true,
        mostrar_beneficios: true,
        mostrar_faq: true,
        mostrar_cotizacion: true
    },

    // Configuración de integración
    integracion: {
        webhook_formulario: "", // URL del webhook para procesar formularios
        api_key: "", // API key para servicios externos
        crm: {
            tipo: "none", // "none", "hubspot", "salesforce", "custom"
            configuracion: {}
        }
    },

    // Configuración de seguridad
    seguridad: {
        validacion_csrf: false,
        rate_limiting: false,
        captcha: false
    },

    // Configuración de desarrollo
    desarrollo: {
        modo_debug: false,
        mostrar_errores: true,
        log_consola: true
    }
};

// Función para obtener configuración
function getConfig(clave) {
    return clave ? CONFIG[clave] : CONFIG;
}

// Función para actualizar configuración
function updateConfig(clave, valor) {
    if (typeof clave === 'object') {
        Object.assign(CONFIG, clave);
    } else {
        CONFIG[clave] = valor;
    }
}

// Función para aplicar configuración al DOM
function aplicarConfiguracion() {
    // Aplicar colores
    if (CONFIG.colores) {
        const root = document.documentElement;
        root.style.setProperty('--primary-color', CONFIG.colores.primario);
        root.style.setProperty('--primary-dark', CONFIG.colores.primario_oscuro);
        root.style.setProperty('--primary-light', CONFIG.colores.primario_claro);
        root.style.setProperty('--secondary-color', CONFIG.colores.secundario);
        root.style.setProperty('--accent-color', CONFIG.colores.acento);
        root.style.setProperty('--success-color', CONFIG.colores.exito);
        root.style.setProperty('--error-color', CONFIG.colores.error);
    }

    // Aplicar información del seguro
    if (CONFIG.seguro) {
        const titulo = document.querySelector('.hero-title');
        const subtitulo = document.querySelector('.hero-subtitle');
        
        if (titulo && CONFIG.seguro.titulo) {
            const titleLine = titulo.querySelector('.title-line');
            if (titleLine) {
                titleLine.textContent = CONFIG.seguro.titulo.split(' ').slice(0, -1).join(' ') + ' ';
            }
        }
        if (subtitulo && CONFIG.seguro.subtitulo) {
            subtitulo.textContent = CONFIG.seguro.subtitulo;
        }
    }

    // Aplicar información de contacto
    if (CONFIG.contacto) {
        const emailElements = document.querySelectorAll('.footer-section li');
        if (emailElements.length > 0 && CONFIG.contacto.email) {
            emailElements.forEach(el => {
                if (el.textContent.includes('@')) {
                    el.innerHTML = `<i class="fas fa-envelope"></i> ${CONFIG.contacto.email}`;
                }
            });
        }
    }

    // Aplicar configuración de scroll
    if (CONFIG.scroll && CONFIG.scroll.suave) {
        document.documentElement.style.scrollBehavior = 'smooth';
    }
}

// Función para validar configuración
function validarConfiguracion() {
    const errores = [];

    if (!CONFIG.seguro.nombre) errores.push('Nombre del seguro es requerido');
    if (!CONFIG.seguro.titulo) errores.push('Título del seguro es requerido');
    if (!CONFIG.contacto.email) errores.push('Email de contacto es requerido');
    if (!CONFIG.contacto.telefono) errores.push('Teléfono de contacto es requerido');

    if (errores.length > 0) {
        console.warn('Errores en la configuración:', errores);
        return false;
    }

    return true;
}

// Función para exportar configuración
function exportarConfiguracion() {
    return JSON.stringify(CONFIG, null, 2);
}

// Función para importar configuración
function importarConfiguracion(configJson) {
    try {
        const nuevaConfig = JSON.parse(configJson);
        Object.assign(CONFIG, nuevaConfig);
        aplicarConfiguracion();
        return true;
    } catch (error) {
        console.error('Error al importar configuración:', error);
        return false;
    }
}

// Aplicar configuración cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    if (validarConfiguracion()) {
        aplicarConfiguracion();
    }
});

// Exportar para uso global
window.CONFIG = CONFIG;
window.getConfig = getConfig;
window.updateConfig = updateConfig;
window.aplicarConfiguracion = aplicarConfiguracion;
window.validarConfiguracion = validarConfiguracion;
window.exportarConfiguracion = exportarConfiguracion;
window.importarConfiguracion = importarConfiguracion;
