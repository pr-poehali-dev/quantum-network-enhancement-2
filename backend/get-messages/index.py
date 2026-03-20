import json
import os
import psycopg2

SCHEMA = 't_p91940865_quantum_network_enha'
CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
}


def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def handler(event: dict, context) -> dict:
    """Получить сообщения чата (с поддержкой polling — after_id для новых сообщений)."""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    params = event.get('queryStringParameters') or {}
    chat_id = params.get('chat_id')
    after_id = params.get('after_id', 0)

    if not chat_id:
        return {'statusCode': 400, 'headers': {'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'chat_id required'})}

    conn = get_conn()
    cur = conn.cursor()

    cur.execute(f"""
        SELECT m.id, m.text, m.created_at, u.id as user_id, u.name
        FROM {SCHEMA}.messages m
        JOIN {SCHEMA}.users u ON u.id = m.user_id
        WHERE m.chat_id = %s AND m.id > %s
        ORDER BY m.created_at ASC
        LIMIT 100
    """, (chat_id, after_id))

    messages = []
    for row in cur.fetchall():
        messages.append({
            'id': row[0], 'text': row[1],
            'created_at': str(row[2]),
            'user_id': row[3], 'user_name': row[4]
        })

    cur.close()
    conn.close()

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'messages': messages})
    }
