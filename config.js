// Configuración personalizable para Estudio Jurídico - Servicios Legales
const CONFIG = {
    // Información del estudio jurídico
    estudio: {
        nombre: "Estudio Jurídico",
        titulo: "Especialistas en Reclamos por Accidentes de Tránsito y Laborales",
        subtitulo: "Abogado especializado en accidentes de tránsito y accidentes laborales. Acompañamos a trabajadores y víctimas que buscan reclamar lo que les corresponde.",
        eslogan: "Defendemos tus Derechos con Profesionalismo y Compromiso",
        anos_experiencia: 15,
        casos_resueltos: 500,
        calificacion: 4.9,
        logo: ""
    },

    // Información de contacto
    contacto: {
        email: "contacto@estudiojuridico.com",
        telefono: "+54 9 11 1234-5678",
        whatsapp: "+54 9 11 1234-5678",
        direccion: "Buenos Aires Capital Federal y AMBA",
        horario: "Lunes a Viernes de 9:00 a 18:00",
        horario_emergencia: "Atención 24/7",
        abogado: "Estudio Jurídico Especializado"
    },

    // Redes sociales
    redes: {
        facebook: "#",
        linkedin: "#",
        whatsapp: "#"
    },

    // Colores del tema
    colores: {
        primario: "#1e3a5f",
        primario_oscuro: "#0f1f35",
        primario_claro: "#2d4a6b",
        secundario: "#3a5f7f",
        acento: "#4a6fa5",
        exito: "#2563eb",
        error: "#ef4444",
        advertencia: "#f59e0b",
        info: "#3b82f6",
        fondo_oscuro: "#1a1a1a",
        fondo_claro: "#f5f7fa",
        texto_oscuro: "#1a1a1a",
        texto_claro: "#5a5a5a"
    },

    // Configuración de animaciones
    animaciones: {
        duracion: 0.6,
        delay: 0.1,
        habilitadas: true
    },

    // Configuración del formulario de consulta
    formulario: {
        campos_requeridos: ['nombre', 'email', 'telefono', 'tipo-accidente'],
        validacion_email: true,
        validacion_fechas: false,
        mensaje_exito: "¡Consulta enviada exitosamente! Te contactaremos en menos de 24 horas.",
        mensaje_error: "Por favor completa todos los campos requeridos."
    },

    // Configuración de servicios
    servicios: {
        transito: {
            nombre: "Accidentes de Tránsito",
            descripcion: "Representación legal especializada en accidentes vehiculares"
        },
        laboral: {
            nombre: "Accidentes Laborales y Reclamos ART",
            descripcion: "Especialistas en reclamos contra ART por accidentes de trabajo"
        },
        asesoria: {
            nombre: "Asesoría Legal Integral",
            descripcion: "Consulta inicial gratuita y evaluación de tu caso"
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
        titulo: "Abogado Especialista en Accidentes de Tránsito y Laborales Buenos Aires | Reclamos ART | Consulta Gratuita",
        descripcion: "Abogado especialista en accidentes de tránsito y accidentes laborales en Buenos Aires. Más de 15 años de experiencia en reclamos ante ART, indemnizaciones por accidentes, daños materiales, lesiones personales y enfermedades profesionales. Consulta gratuita 24/7. Honorarios solo si ganamos tu caso. Abogado especializado en accidentes in itinere y reclamos laborales.",
        palabras_clave: "abogado accidentes transito, abogado accidentes laborales, reclamos ART, indemnizaciones accidentes, abogado lesiones personales, accidente laboral abogado, accidente transito abogado, consulta gratuita abogado, abogado especialista ART, enfermedades profesionales, accidentes in itinere, abogado buenos aires, abogado especialista accidentes, reclamos laborales, indemnizacion accidente transito, abogado ART, abogado accidentes trabajo, abogado accidentes vehiculares, abogado daños materiales, abogado accidentes moto, abogado accidentes auto, abogado accidentes bicicleta, abogado accidentes peaton, abogado incapacidad laboral, abogado accidentes calle, abogado accidentes ruta, estudio juridico accidentes, abogado especializado accidentes, consulta abogado gratuita, abogado honorarios resultado",
        imagen_og: "",
        url_canonica: ""
    },

    // Configuración de contenido
    contenido: {
        mostrar_testimonios: true,
        mostrar_servicios: true,
        mostrar_beneficios: true,
        mostrar_faq: true,
        mostrar_consulta: true
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

    // Aplicar información del estudio
    if (CONFIG.estudio) {
        const titulo = document.querySelector('.hero-title');
        const subtitulo = document.querySelector('.hero-subtitle');
        
        if (titulo && CONFIG.estudio.titulo) {
            const titleLine = titulo.querySelector('.title-line');
            if (titleLine) {
                titleLine.textContent = CONFIG.estudio.titulo;
            }
        }
        if (subtitulo && CONFIG.estudio.subtitulo) {
            subtitulo.textContent = CONFIG.estudio.subtitulo;
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

    if (!CONFIG.estudio.nombre) errores.push('Nombre del estudio es requerido');
    if (!CONFIG.estudio.titulo) errores.push('Título del estudio es requerido');
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
