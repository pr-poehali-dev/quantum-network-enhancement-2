import json
import os
import psycopg2

SCHEMA = 't_p91940865_quantum_network_enha'
CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
}


def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def handler(event: dict, context) -> dict:
    """Получить список чатов пользователя (личные и групповые)."""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    params = event.get('queryStringParameters') or {}
    user_id = params.get('user_id')

    if not user_id:
        return {'statusCode': 400, 'headers': {'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'user_id required'})}

    conn = get_conn()
    cur = conn.cursor()

    # Личные чаты: получаем чат + собеседника + последнее сообщение
    cur.execute(f"""
        SELECT
            c.id,
            c.type,
            c.name,
            c.created_at,
            u2.id as other_user_id,
            u2.name as other_user_name,
            u2.country as other_user_country,
            u2.position as other_user_position,
            (SELECT text FROM {SCHEMA}.messages WHERE chat_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message,
            (SELECT created_at FROM {SCHEMA}.messages WHERE chat_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message_at
        FROM {SCHEMA}.chats c
        JOIN {SCHEMA}.chat_members cm ON cm.chat_id = c.id AND cm.user_id = %s
        LEFT JOIN {SCHEMA}.chat_members cm2 ON cm2.chat_id = c.id AND cm2.user_id != %s
        LEFT JOIN {SCHEMA}.users u2 ON u2.id = cm2.user_id
        WHERE c.type = 'direct'
        ORDER BY last_message_at DESC NULLS LAST
    """, (user_id, user_id))

    direct_chats = []
    for row in cur.fetchall():
        direct_chats.append({
            'id': row[0], 'type': row[1], 'name': row[5] or row[2],
            'created_at': str(row[3]),
            'other_user': {'id': row[4], 'name': row[5], 'country': row[6], 'position': row[7]},
            'last_message': row[8], 'last_message_at': str(row[9]) if row[9] else None
        })

    # Групповые чаты
    cur.execute(f"""
        SELECT
            c.id, c.type, c.name, c.created_at,
            (SELECT text FROM {SCHEMA}.messages WHERE chat_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message,
            (SELECT created_at FROM {SCHEMA}.messages WHERE chat_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message_at,
            (SELECT COUNT(*) FROM {SCHEMA}.chat_members WHERE chat_id = c.id) as members_count
        FROM {SCHEMA}.chats c
        JOIN {SCHEMA}.chat_members cm ON cm.chat_id = c.id AND cm.user_id = %s
        WHERE c.type = 'group'
        ORDER BY last_message_at DESC NULLS LAST
    """, (user_id,))

    group_chats = []
    for row in cur.fetchall():
        group_chats.append({
            'id': row[0], 'type': row[1], 'name': row[2],
            'created_at': str(row[3]),
            'last_message': row[4], 'last_message_at': str(row[5]) if row[5] else None,
            'members_count': row[6]
        })

    # Все пользователи (для начала нового чата)
    cur.execute(f"SELECT id, name, country, position FROM {SCHEMA}.users WHERE id != %s ORDER BY name", (user_id,))
    users = [{'id': r[0], 'name': r[1], 'country': r[2], 'position': r[3]} for r in cur.fetchall()]

    cur.close()
    conn.close()

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'direct': direct_chats, 'groups': group_chats, 'users': users})
    }
