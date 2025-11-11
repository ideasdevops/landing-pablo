#!/usr/bin/env python3
"""
Backend para Landing Page de Seguro Viajero Argentina - Del Campo Seguros
Maneja el envío de correos electrónicos para cotizaciones de seguros de viaje
"""

import os
import json
import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Configuración SMTP
SMTP_CONFIG = {
    'server': 'c1682311.ferozo.com',
    'port': 465,
    'username': 'viajero@ideasdevops.com',
    'password': os.environ.get('SMTP_PASSWORD', ''),
    'from_email': 'viajero@ideasdevops.com',
    'to_email': 'manuelj@delcampobroker.com'
}

# Configuración del seguro de viajero
INSURANCE_INFO = {
    'name': 'Seguro Viajero Argentina - Del Campo Seguros',
    'company': 'Del Campo Seguros',
    'broker': 'Manuel del Campo',
    'email': 'manuelj@delcampobroker.com',
    'phone': '+54 9 2616 97-9044',
    'address': 'Mendoza, Argentina',
    'hours': 'Atención 24/7'
}

def send_email(to_email, subject, html_content, text_content=None):
    """Envía un correo electrónico usando SMTP"""
    try:
        msg = MIMEMultipart('alternative')
        msg['From'] = SMTP_CONFIG['from_email']
        msg['To'] = to_email
        msg['Subject'] = subject
        
        if text_content:
            part1 = MIMEText(text_content, 'plain', 'utf-8')
            msg.attach(part1)
        
        part2 = MIMEText(html_content, 'html', 'utf-8')
        msg.attach(part2)
        
        context = ssl.create_default_context()
        with smtplib.SMTP_SSL(SMTP_CONFIG['server'], SMTP_CONFIG['port'], context=context) as server:
            server.login(SMTP_CONFIG['username'], SMTP_CONFIG['password'])
            server.send_message(msg)
        
        return True, "Correo enviado exitosamente"
    
    except Exception as e:
        return False, f"Error al enviar correo: {str(e)}"

def generate_client_email_html(form_data):
    """Genera el HTML para el correo del cliente"""
    return f"""
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cotización de Seguro Viajero Argentina</title>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background: #0066cc; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }}
            .content {{ background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }}
            .welcome {{ text-align: center; margin: 20px 0; }}
            .quote-info {{ background: white; padding: 20px; margin: 15px 0; border-radius: 5px; border: 1px solid #e5e7eb; }}
            .contact-info {{ background: #f0f7ff; padding: 20px; margin: 15px 0; border-radius: 5px; border: 1px solid #0066cc; }}
            .next-steps {{ background: #fef3c7; padding: 15px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #f59e0b; }}
            .footer {{ text-align: center; margin-top: 20px; color: #666; font-size: 12px; }}
            .highlight {{ color: #0066cc; font-weight: bold; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>✈️ Cotización de Seguro Viajero Argentina</h1>
                <p>Del Campo Seguros - Broker Especializado</p>
            </div>
            
            <div class="content">
                <div class="welcome">
                    <h2>¡Hola {form_data.get('nombre', 'Viajero')}!</h2>
                    <p>Gracias por tu interés en proteger tu viaje a Argentina con nuestro <span class="highlight">Seguro Viajero</span>.</p>
                </div>
                
                <div class="quote-info">
                    <h3>📋 Información de tu Cotización</h3>
                    <p><strong>Nombre:</strong> {form_data.get('nombre', 'No especificado')}</p>
                    <p><strong>Email:</strong> {form_data.get('email', 'No especificado')}</p>
                    <p><strong>Teléfono:</strong> {form_data.get('telefono', 'No especificado')}</p>
                    <p><strong>Fecha de inicio:</strong> {form_data.get('fecha-inicio', 'No especificada')}</p>
                    <p><strong>Fecha de fin:</strong> {form_data.get('fecha-fin', 'No especificada')}</p>
                    <p><strong>Número de viajeros:</strong> {form_data.get('viajeros', 'No especificado')}</p>
                    <p><strong>Plan seleccionado:</strong> {form_data.get('plan', 'No especificado')}</p>
                    <p><strong>Fecha de solicitud:</strong> {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}</p>
                </div>
                
                <div class="contact-info">
                    <h3>📞 Próximos Pasos</h3>
                    <p>Nuestro equipo analizará tu solicitud y te contactará en las próximas <strong>24 horas</strong> con:</p>
                    <ul>
                        <li>✅ Cotización personalizada para tu viaje</li>
                        <li>✅ Comparación entre múltiples aseguradoras</li>
                        <li>✅ Propuesta de cobertura adaptada a tus necesidades</li>
                        <li>✅ Información detallada sobre coberturas incluidas</li>
                    </ul>
                </div>
                
                <div class="next-steps">
                    <h3>🛡️ Coberturas Incluidas</h3>
                    <ul>
                        <li><strong>Cobertura Médica Internacional:</strong> Consultas, hospitalización, emergencias</li>
                        <li><strong>Asistencia 24/7:</strong> Línea de emergencia en español</li>
                        <li><strong>Protección de Equipaje:</strong> Pérdida, robo o daño</li>
                        <li><strong>Cancelación de Viaje:</strong> Por emergencias médicas o imprevistos</li>
                        <li><strong>Repatriación Médica:</strong> Si es necesario</li>
                    </ul>
                </div>
                
                <div class="contact-info">
                    <h3>📧 Contacto Directo</h3>
                    <p>Si tienes alguna pregunta urgente, puedes contactarnos directamente:</p>
                    <p><strong>Manuel del Campo</strong> - Broker Especializado</p>
                    <p>📧 Email: {INSURANCE_INFO['email']}</p>
                    <p>📱 Teléfono: {INSURANCE_INFO['phone']}</p>
                    <p>📍 Dirección: {INSURANCE_INFO['address']}</p>
                    <p>🕒 Horarios: {INSURANCE_INFO['hours']}</p>
                </div>
            </div>
            
            <div class="footer">
                <p>Este correo fue enviado automáticamente por Del Campo Seguros</p>
                <p>Broker especializado en seguros de viaje</p>
            </div>
        </div>
    </body>
    </html>
    """

def generate_admin_email_html(form_data):
    """Genera el HTML para el correo del administrador"""
    return f"""
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nueva Solicitud de Cotización - Seguro Viajero</title>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background: #0066cc; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }}
            .content {{ background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }}
            .info-box {{ background: white; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #0066cc; }}
            .label {{ font-weight: bold; color: #0066cc; }}
            .value {{ margin-left: 10px; }}
            .urgent {{ background: #fef2f2; border-left: 4px solid #dc2626; }}
            .footer {{ text-align: center; margin-top: 20px; color: #666; font-size: 12px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>✈️ Nueva Solicitud de Cotización</h1>
                <p>Seguro Viajero Argentina - Del Campo Seguros</p>
            </div>
            
            <div class="content">
                <div class="urgent">
                    <h3>⚠️ ACCIÓN REQUERIDA</h3>
                    <p>Un cliente potencial ha solicitado una cotización de seguro de viajero. Contactar en las próximas 24 horas.</p>
                </div>
                
                <h3>👤 Datos del Cliente</h3>
                
                <div class="info-box">
                    <span class="label">Nombre:</span>
                    <span class="value">{form_data.get('nombre', 'No especificado')}</span>
                </div>
                
                <div class="info-box">
                    <span class="label">Email:</span>
                    <span class="value">{form_data.get('email', 'No especificado')}</span>
                </div>
                
                <div class="info-box">
                    <span class="label">Teléfono:</span>
                    <span class="value">{form_data.get('telefono', 'No especificado')}</span>
                </div>
                
                <div class="info-box">
                    <span class="label">Fecha de inicio:</span>
                    <span class="value">{form_data.get('fecha-inicio', 'No especificada')}</span>
                </div>
                
                <div class="info-box">
                    <span class="label">Fecha de fin:</span>
                    <span class="value">{form_data.get('fecha-fin', 'No especificada')}</span>
                </div>
                
                <div class="info-box">
                    <span class="label">Número de viajeros:</span>
                    <span class="value">{form_data.get('viajeros', 'No especificado')}</span>
                </div>
                
                <div class="info-box">
                    <span class="label">Plan seleccionado:</span>
                    <span class="value">{form_data.get('plan', 'No especificado')}</span>
                </div>
                
                <div class="info-box">
                    <span class="label">Fecha de solicitud:</span>
                    <span class="value">{datetime.now().strftime('%d/%m/%Y %H:%M:%S')}</span>
                </div>
                
                <div class="urgent">
                    <h3>📋 Próximos Pasos</h3>
                    <ol>
                        <li>Contactar al cliente en las próximas 24 horas</li>
                        <li>Preparar cotización personalizada según fechas y plan</li>
                        <li>Comparar opciones entre aseguradoras</li>
                        <li>Enviar propuesta de cobertura detallada</li>
                        <li>Seguimiento para cerrar la venta</li>
                    </ol>
                </div>
            </div>
            
            <div class="footer">
                <p>Este correo fue generado automáticamente por el sistema de cotizaciones</p>
                <p>Del Campo Seguros - Broker especializado en seguros de viaje</p>
            </div>
        </div>
    </body>
    </html>
    """

@app.route('/')
def index():
    """Página principal - redirige al frontend"""
    return jsonify({
        'message': 'Backend de Seguro Viajero Argentina funcionando',
        'status': 'ok',
        'service': 'Del Campo Seguros - Seguro Viajero Backend',
        'endpoints': {
            'health': '/health',
            'quote': '/api/quote'
        }
    })

@app.route('/health')
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'service': 'travel-insurance-backend',
        'company': 'Del Campo Seguros'
    })

@app.route('/api/quote', methods=['POST'])
def quote():
    """Endpoint para procesar solicitudes de cotización de seguros de viaje"""
    try:
        form_data = request.get_json()
        
        if not form_data:
            return jsonify({
                'success': False,
                'message': 'No se recibieron datos del formulario'
            }), 400
        
        # Validar campos requeridos
        required_fields = ['nombre', 'email', 'telefono', 'fecha-inicio', 'fecha-fin', 'viajeros', 'plan']
        missing_fields = [field for field in required_fields if not form_data.get(field)]
        
        if missing_fields:
            return jsonify({
                'success': False,
                'message': f'Faltan campos requeridos: {", ".join(missing_fields)}'
            }), 400
        
        # Generar contenido de correos
        client_subject = f"✈️ Cotización de Seguro Viajero Argentina - {form_data.get('nombre', 'Viajero')}"
        admin_subject = f"✈️ Nueva Solicitud de Cotización - {form_data.get('nombre', 'Cliente')}"
        
        client_html = generate_client_email_html(form_data)
        admin_html = generate_admin_email_html(form_data)
        
        # Lista de destinatarios
        recipients = [
            {'email': form_data['email'], 'subject': client_subject, 'html': client_html, 'type': 'cliente'},
            {'email': INSURANCE_INFO['email'], 'subject': admin_subject, 'html': admin_html, 'type': 'admin'}
        ]
        
        # Enviar correos
        email_results = []
        for recipient in recipients:
            success, message = send_email(
                recipient['email'],
                recipient['subject'],
                recipient['html']
            )
            email_results.append({
                'email': recipient['email'],
                'type': recipient['type'],
                'success': success,
                'message': message
            })
        
        all_success = all(result['success'] for result in email_results)
        
        if all_success:
            return jsonify({
                'success': True,
                'message': 'Cotización enviada exitosamente. Revisa tu correo electrónico.',
                'data': {
                    'nombre': form_data.get('nombre'),
                    'email': form_data.get('email'),
                    'timestamp': datetime.now().isoformat()
                },
                'notifications_sent': len(email_results)
            })
        else:
            return jsonify({
                'success': False,
                'message': 'Error al enviar algunas notificaciones por correo electrónico',
                'details': email_results
            }), 500
    
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error interno del servidor: {str(e)}'
        }), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('DEBUG', 'False').lower() == 'true'
    
    print(f"🚀 Iniciando servidor Del Campo Seguros - Seguro Viajero Backend")
    print(f"📍 Puerto: {port}")
    print(f"🔧 Debug: {debug}")
    print(f"📧 SMTP: {SMTP_CONFIG['server']}:{SMTP_CONFIG['port']}")
    print(f"🏢 Empresa: {INSURANCE_INFO['company']}")
    print(f"👤 Broker: {INSURANCE_INFO['broker']}")
    
    app.run(host='0.0.0.0', port=port, debug=debug)
