
CREATE TABLE IF NOT EXISTS t_p91940865_quantum_network_enha.users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  country VARCHAR(255),
  position VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS t_p91940865_quantum_network_enha.chats (
  id SERIAL PRIMARY KEY,
  type VARCHAR(20) NOT NULL DEFAULT 'direct',
  name VARCHAR(255),
  created_by INTEGER REFERENCES t_p91940865_quantum_network_enha.users(id),
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS t_p91940865_quantum_network_enha.chat_members (
  chat_id INTEGER REFERENCES t_p91940865_quantum_network_enha.chats(id),
  user_id INTEGER REFERENCES t_p91940865_quantum_network_enha.users(id),
  joined_at TIMESTAMP DEFAULT now(),
  PRIMARY KEY (chat_id, user_id)
);

CREATE TABLE IF NOT EXISTS t_p91940865_quantum_network_enha.messages (
  id SERIAL PRIMARY KEY,
  chat_id INTEGER REFERENCES t_p91940865_quantum_network_enha.chats(id),
  user_id INTEGER REFERENCES t_p91940865_quantum_network_enha.users(id),
  text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON t_p91940865_quantum_network_enha.messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON t_p91940865_quantum_network_enha.messages(created_at);
CREATE INDEX IF NOT EXISTS idx_chat_members_user_id ON t_p91940865_quantum_network_enha.chat_members(user_id);
