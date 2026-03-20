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
    """Отправить сообщение. Создаёт чат если не существует (для direct)."""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    body = json.loads(event.get('body') or '{}')
    user_id = body.get('user_id')
    text = (body.get('text') or '').strip()
    chat_id = body.get('chat_id')
    # Для создания нового direct чата
    to_user_id = body.get('to_user_id')
    # Для создания новой группы
    group_name = body.get('group_name')
    member_ids = body.get('member_ids', [])

    if not user_id or not text:
        return {'statusCode': 400, 'headers': {'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'user_id и text обязательны'})}

    conn = get_conn()
    cur = conn.cursor()

    if not chat_id:
        if to_user_id:
            # Проверяем существует ли direct чат между этими двумя
            cur.execute(f"""
                SELECT c.id FROM {SCHEMA}.chats c
                JOIN {SCHEMA}.chat_members cm1 ON cm1.chat_id = c.id AND cm1.user_id = %s
                JOIN {SCHEMA}.chat_members cm2 ON cm2.chat_id = c.id AND cm2.user_id = %s
                WHERE c.type = 'direct'
                LIMIT 1
            """, (user_id, to_user_id))
            row = cur.fetchone()
            if row:
                chat_id = row[0]
            else:
                cur.execute(f"INSERT INTO {SCHEMA}.chats (type, created_by) VALUES ('direct', %s) RETURNING id", (user_id,))
                chat_id = cur.fetchone()[0]
                cur.execute(f"INSERT INTO {SCHEMA}.chat_members (chat_id, user_id) VALUES (%s, %s)", (chat_id, user_id))
                cur.execute(f"INSERT INTO {SCHEMA}.chat_members (chat_id, user_id) VALUES (%s, %s)", (chat_id, to_user_id))
        elif group_name:
            cur.execute(f"INSERT INTO {SCHEMA}.chats (type, name, created_by) VALUES ('group', %s, %s) RETURNING id", (group_name, user_id))
            chat_id = cur.fetchone()[0]
            all_members = list(set([int(user_id)] + [int(m) for m in member_ids]))
            for mid in all_members:
                cur.execute(f"INSERT INTO {SCHEMA}.chat_members (chat_id, user_id) VALUES (%s, %s)", (chat_id, mid))
        else:
            conn.close()
            return {'statusCode': 400, 'headers': {'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Укажите chat_id, to_user_id или group_name'})}

    cur.execute(
        f"INSERT INTO {SCHEMA}.messages (chat_id, user_id, text) VALUES (%s, %s, %s) RETURNING id, created_at",
        (chat_id, user_id, text)
    )
    msg_id, created_at = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True, 'message_id': msg_id, 'chat_id': chat_id, 'created_at': str(created_at)})
    }
