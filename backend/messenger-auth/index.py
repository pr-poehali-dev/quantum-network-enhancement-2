import json
import os
import psycopg2

SCHEMA = 't_p91940865_quantum_network_enha'
CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-User-Email',
}


def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def handler(event: dict, context) -> dict:
    """Регистрация/вход пользователя в мессенджер по email из заявки."""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    body = json.loads(event.get('body') or '{}')
    email = body.get('email', '').strip().lower()
    name = body.get('name', '').strip()
    country = body.get('country', '').strip()
    position = body.get('position', '').strip()

    if not email or not name:
        return {'statusCode': 400, 'headers': {'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Укажите email и имя'})}

    conn = get_conn()
    cur = conn.cursor()

    cur.execute(
        f"SELECT id, name, country, position, email FROM {SCHEMA}.users WHERE email = %s",
        (email,)
    )
    row = cur.fetchone()

    if row:
        user = {'id': row[0], 'name': row[1], 'country': row[2], 'position': row[3], 'email': row[4]}
    else:
        cur.execute(
            f"INSERT INTO {SCHEMA}.users (name, country, position, email) VALUES (%s, %s, %s, %s) RETURNING id",
            (name, country, position, email)
        )
        user_id = cur.fetchone()[0]
        conn.commit()
        user = {'id': user_id, 'name': name, 'country': country, 'position': position, 'email': email}

    conn.commit()
    cur.close()
    conn.close()

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True, 'user': user})
    }
