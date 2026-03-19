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

        confirm = MIMEMultipart('alternative')
        confirm['Subject'] = f'WW3 — Your application #{app_id} has been received'
        confirm['From'] = smtp_email
        confirm['To'] = email
        confirm_html = f"""
        <html><body style="font-family: Arial, sans-serif; background: #1e2028; color: #c8d0dc; padding: 24px;">
          <div style="max-width: 520px; margin: 0 auto; background: #16181f; border-radius: 12px; padding: 32px; border: 1px solid #2a2d38;">
            <div style="text-align: center; margin-bottom: 24px;">
              <div style="width: 64px; height: 64px; background: #2d6a4f; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 28px;">🌐</div>
            </div>
            <h2 style="color: #ffffff; margin-top: 0; text-align: center;">Application Received</h2>
            <p style="color: #c8d0dc; line-height: 1.6;">Dear <strong style="color: #ffffff;">{name}</strong>,</p>
            <p style="color: #c8d0dc; line-height: 1.6;">
              Thank you for applying to join <strong style="color: #34d399;">WW3</strong> — the international platform for political dialogue.
              We have received your application and our team will review it shortly.
            </p>
            <div style="background: #1e2028; border-radius: 8px; padding: 16px; margin: 24px 0; border: 1px solid #2a2d38;">
              <table style="width:100%; border-collapse: collapse;">
                <tr><td style="padding: 6px 0; color: #6b7a8d; width: 110px;">Application #</td><td style="padding: 6px 0; color: #ffffff; font-weight: bold;">#{app_id}</td></tr>
                <tr><td style="padding: 6px 0; color: #6b7a8d;">Country</td><td style="padding: 6px 0; color: #ffffff;">{country}</td></tr>
                <tr><td style="padding: 6px 0; color: #6b7a8d;">Position</td><td style="padding: 6px 0; color: #ffffff;">{position}</td></tr>
              </table>
            </div>
            <p style="color: #8b9ab0; font-size: 14px; line-height: 1.6;">
              We will contact you at this email address once your application has been verified.
            </p>
            <p style="color: #6b7a8d; font-size: 12px; margin-top: 32px; text-align: center;">
              WW3 — Global Network for Politicians
            </p>
          </div>
        </body></html>
        """
        confirm.attach(MIMEText(confirm_html, 'html'))

        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
            server.login(smtp_email, smtp_password)
            server.sendmail(smtp_email, smtp_email, msg.as_string())
            server.sendmail(smtp_email, email, confirm.as_string())
    except Exception:
        pass

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True, 'id': app_id, 'message': 'Заявка принята'})
    }