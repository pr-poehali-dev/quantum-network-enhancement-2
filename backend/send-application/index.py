import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import psycopg2

SCHEMA = 't_p91940865_quantum_network_enha'

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token, X-Session-Id',
    'Access-Control-Max-Age': '86400',
}


def handler(event: dict, context) -> dict:
    """Сохраняет заявку на вступление в WW3 в БД и отправляет уведомление на почту."""

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    raw_body = event.get('body') or '{}'
    body = json.loads(raw_body)
    name = body.get('name', '').strip()
    country = body.get('country', '').strip()
    position = body.get('position', '').strip()
    email = body.get('email', '').strip()

    if not all([name, country, position, email]):
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Заполните все поля'})
        }

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    cur.execute(
        f"INSERT INTO {SCHEMA}.applications (name, country, position, email) VALUES (%s, %s, %s, %s) RETURNING id",
        (name, country, position, email)
    )
    app_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()

    try:
        smtp_email = os.environ['SMTP_EMAIL']
        smtp_password = os.environ['SMTP_PASSWORD']
        msg = MIMEMultipart('alternative')
        msg['Subject'] = f'WW3 — Новая заявка #{app_id} от {name}'
        msg['From'] = smtp_email
        msg['To'] = smtp_email
        html = f"""
        <html><body style="font-family: Arial, sans-serif; background: #1e2028; color: #c8d0dc; padding: 24px;">
          <div style="max-width: 520px; margin: 0 auto; background: #16181f; border-radius: 12px; padding: 32px; border: 1px solid #2a2d38;">
            <h2 style="color: #ffffff; margin-top: 0;">🌐 Новая заявка #{app_id} на вступление в WW3</h2>
            <table style="width:100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #6b7a8d; width: 120px;">Имя</td><td style="padding: 8px 0; color: #ffffff; font-weight: bold;">{name}</td></tr>
              <tr><td style="padding: 8px 0; color: #6b7a8d;">Страна</td><td style="padding: 8px 0; color: #ffffff;">{country}</td></tr>
              <tr><td style="padding: 8px 0; color: #6b7a8d;">Должность</td><td style="padding: 8px 0; color: #ffffff;">{position}</td></tr>
              <tr><td style="padding: 8px 0; color: #6b7a8d;">Email</td><td style="padding: 8px 0; color: #34d399;">{email}</td></tr>
            </table>
            <p style="color: #6b7a8d; font-size: 12px; margin-top: 24px;">Заявка сохранена в базе данных под номером #{app_id}</p>
          </div>
        </body></html>
        """
        msg.attach(MIMEText(html, 'html'))
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
            server.login(smtp_email, smtp_password)
            server.sendmail(smtp_email, smtp_email, msg.as_string())
    except Exception:
        pass

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True, 'id': app_id, 'message': 'Заявка принята'})
    }
