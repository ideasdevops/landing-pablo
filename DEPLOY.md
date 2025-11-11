# 🚀 Guía de Deploy para Seguro Viajero Argentina - Easypanel

Esta guía explica cómo desplegar el sitio de Seguro Viajero Argentina usando Easypanel.

## 📋 Requisitos Previos

- Cuenta en Easypanel
- Repositorio en GitHub: `git@github.com:ideasdevops/seguro-viajero-landing.git`
- Acceso SSH configurado

## 🔧 Configuración en Easypanel

### 1. Crear Nueva Aplicación

1. En Easypanel, crear una nueva aplicación
2. Seleccionar **"Docker"** como tipo de aplicación
3. Conectar con el repositorio de GitHub:
   - **Repository**: `git@github.com:ideasdevops/seguro-viajero-landing.git`
   - **Branch**: `main`

### 2. Configurar Build

- **Dockerfile**: `Dockerfile.easypanel-optimized`
- **Context**: `.` (raíz del proyecto)
- **Build Command**: (dejar vacío, se usa el Dockerfile)

### 3. Configurar Variables de Entorno

Añadir las siguientes variables de entorno:

```env
# Backend
PORT=5000
DEBUG=False

# SMTP (Opcional - si se usa backend)
SMTP_SERVER=c1682311.ferozo.com
SMTP_PORT=465
SMTP_USERNAME=viajero@ideasdevops.com
SMTP_PASSWORD=tu_password_aqui
SMTP_FROM_EMAIL=viajero@ideasdevops.com

# Tiempo
TZ=America/Argentina/Mendoza
```

### 4. Configurar Volúmenes

Añadir los siguientes volúmenes persistentes:

- `/data/logs` - Logs de nginx y backend (1GB recomendado)

### 5. Configurar Puertos

- **Puerto del contenedor**: `80`
- **Protocolo**: HTTP
- **Exponer**: Sí

### 6. Health Check

- **Path**: `/health`
- **Interval**: 30 segundos
- **Timeout**: 10 segundos
- **Retries**: 3

### 7. Configuración Adicional

- **Restart Policy**: Always
- **Memory Limit**: Mínimo 256MB (recomendado 512MB)
- **CPU Limit**: Mínimo 0.5 CPU

## 🏗️ Estructura del Proyecto

```
seguro-viajero/
├── Dockerfile.easypanel-optimized  # Dockerfile para Easypanel
├── docker-compose.yml              # Docker Compose (desarrollo local)
├── .dockerignore                   # Archivos a ignorar en build
├── index.html                      # Landing page principal
├── styles.css                       # Estilos
├── script.js                        # JavaScript
├── translations.js                 # Sistema de traducciones
├── config.js                        # Configuración
├── backend/
│   ├── app.py                       # Backend Flask
│   └── requirements.txt             # Dependencias Python
└── README.md                        # Documentación
```

## 🔄 Proceso de Deploy

1. **Build**: Easypanel construye la imagen Docker usando `Dockerfile.easypanel-optimized`
2. **Inicialización**: El script `/start.sh` ejecuta:
   - Crea directorios necesarios
   - Inicia nginx
   - Inicia backend Flask en puerto 5000
3. **Health Check**: Verifica que `/health` responde
4. **Listo**: Aplicación disponible en el dominio configurado

## ✅ Verificación Post-Deploy

1. **Health Check**: `https://tu-dominio.com/health`
   - Debe responder: `healthy`

2. **Frontend**: `https://tu-dominio.com`
   - Debe mostrar la landing page

3. **Backend API**: `https://tu-dominio.com/api/health`
   - Debe responder con JSON del backend

4. **Formulario**: Probar el formulario de cotización
   - Debe enviar correos correctamente

## 🐛 Troubleshooting

### El sitio no carga
- Verificar logs en Easypanel
- Verificar que el puerto 80 esté expuesto
- Verificar health check

### El backend no funciona
- Verificar variables de entorno SMTP
- Verificar logs en `/data/logs/backend/`
- Verificar que el puerto 5000 esté accesible internamente

### Errores de permisos
- Verificar que los volúmenes tengan permisos correctos
- Verificar configuración de nginx

## 📝 Notas Importantes

- El Dockerfile usa `nginx:alpine` como base (imagen ligera)
- El backend Flask corre en el puerto 5000 internamente
- Nginx hace proxy de `/api/` al backend
- Los archivos estáticos se sirven desde `/usr/share/nginx/html`
- El health check verifica que nginx esté funcionando

## 🔗 URLs Importantes

- **Aplicación**: `https://tu-dominio.com`
- **Health Check**: `https://tu-dominio.com/health`
- **Backend API**: `https://tu-dominio.com/api/health`
- **Formulario de Cotización**: `https://tu-dominio.com/#cotizar`

---
*Desarrollado para Del Campo Seguros - Broker especializado en seguros de viaje*

