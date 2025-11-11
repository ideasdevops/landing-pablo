#!/usr/bin/env node
/**
 * Servidor HTTP simple para la landing page de Seguro Viajero Argentina
 * Puerto: 8008
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 8008;
const HOST = 'localhost';

// MIME types para diferentes archivos
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.json': 'application/json'
};

function getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return mimeTypes[ext] || 'text/plain';
}

function serveFile(filePath, res) {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(`
                <!DOCTYPE html>
                <html>
                <head><title>404 - No encontrado</title></head>
                <body>
                    <h1>404 - Archivo no encontrado</h1>
                    <p>El archivo solicitado no existe.</p>
                    <a href="/">Volver al inicio</a>
                </body>
                </html>
            `);
            return;
        }

        const mimeType = getMimeType(filePath);
        res.writeHead(200, { 
            'Content-Type': mimeType,
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        });
        res.end(data);
    });
}

const server = http.createServer((req, res) => {
    let filePath = req.url === '/' ? '/index.html' : req.url;
    filePath = path.join(__dirname, filePath);

    // Verificar que el archivo existe y está dentro del directorio del proyecto
    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403, { 'Content-Type': 'text/html' });
        res.end('<h1>403 - Acceso denegado</h1>');
        return;
    }

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(`
                <!DOCTYPE html>
                <html>
                <head><title>404 - No encontrado</title></head>
                <body>
                    <h1>404 - Archivo no encontrado</h1>
                    <p>El archivo solicitado no existe.</p>
                    <a href="/">Volver al inicio</a>
                </body>
                </html>
            `);
            return;
        }

        serveFile(filePath, res);
    });
});

server.listen(PORT, HOST, () => {
    console.log('='.repeat(60));
    console.log('🚀 SERVIDOR DE SEGURO VIAJERO ARGENTINA INICIADO');
    console.log('='.repeat(60));
    console.log(`📍 URL: http://${HOST}:${PORT}`);
    console.log(`📁 Directorio: ${__dirname}`);
    console.log('='.repeat(60));
    console.log('📋 Archivos disponibles:');
    console.log('   • index.html - Landing page de seguros para viajeros');
    console.log('   • styles.css - Estilos del sitio');
    console.log('   • script.js - Funcionalidades JavaScript');
    console.log('='.repeat(60));
    console.log('🛑 Para detener el servidor: Ctrl+C');
    console.log('='.repeat(60));
    
    // Intentar abrir en el navegador
    const url = `http://${HOST}:${PORT}`;
    const command = process.platform === 'win32' ? 'start' : 
                   process.platform === 'darwin' ? 'open' : 'xdg-open';
    
    exec(`${command} ${url}`, (error) => {
        if (error) {
            console.log('⚠️  No se pudo abrir automáticamente en el navegador');
            console.log(`   Abre manualmente: ${url}`);
        } else {
            console.log('🌐 Abriendo en el navegador...');
        }
    });
    
    console.log('\n✅ Servidor ejecutándose...');
});

// Manejar cierre del servidor
process.on('SIGINT', () => {
    console.log('\n\n🛑 Servidor detenido por el usuario');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n\n🛑 Servidor detenido');
    process.exit(0);
});
