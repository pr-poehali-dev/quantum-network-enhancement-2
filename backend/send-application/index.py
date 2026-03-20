import json
import os
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

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True, 'id': app_id, 'message': 'Заявка принята'})
    }