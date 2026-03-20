import { useState, useEffect, useRef, useCallback } from "react";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";

const API = {
  auth: "https://functions.poehali.dev/b648a97e-5eb7-4376-b0b0-b2e95373f64b",
  getChats: "https://functions.poehali.dev/b8d47118-510e-4d18-ad63-9095dd5ae570",
  getMessages: "https://functions.poehali.dev/c3d47375-fb0b-4258-ab79-ed04203e015e",
  sendMessage: "https://functions.poehali.dev/9436bfe2-da24-4f42-b1ed-6ac072d81a35",
};

interface User { id: number; name: string; country: string; position: string; email?: string; }
interface Message { id: number; text: string; created_at: string; user_id: number; user_name: string; }
interface Chat {
  id: number; type: string; name: string;
  last_message?: string; last_message_at?: string;
  other_user?: User; members_count?: number;
}

function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  const colors = ["#2d6a4f","#1d4e89","#6b2d6f","#8b4513","#1a5276","#145a32"];
  const color = colors[name.charCodeAt(0) % colors.length];
  return (
    <div style={{ width: size, height: size, background: color, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.4, color: "#fff", fontWeight: 700, flexShrink: 0 }}>
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

function formatTime(dt?: string) {
  if (!dt) return "";
  const d = new Date(dt);
  return d.toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" });
}

function formatDate(dt?: string) {
  if (!dt) return "";
  const d = new Date(dt);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) return formatTime(dt);
  return d.toLocaleDateString("ru", { day: "numeric", month: "short" });
}

export default function Messenger() {
  const storedUser = JSON.parse(localStorage.getItem("ww3_me") || "null");
  const [me, setMe] = useState<User | null>(storedUser);
  const [authLoading, setAuthLoading] = useState(!storedUser);

  const [directChats, setDirectChats] = useState<Chat[]>([]);
  const [groupChats, setGroupChats] = useState<Chat[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [tab, setTab] = useState<"direct" | "groups">("direct");
  const [showNewChat, setShowNewChat] = useState(false);
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [sending, setSending] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const lastMsgId = useRef(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Авторизация
  useEffect(() => {
    if (me) return;
    const name = localStorage.getItem("ww3_user");
    if (!name) { window.location.href = "/"; return; }
    const email = localStorage.getItem("ww3_email") || `${name.toLowerCase().replace(/\s+/g, ".")}@ww3.app`;
    fetch(API.auth, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, country: localStorage.getItem("ww3_country") || "", position: localStorage.getItem("ww3_position") || "" })
    })
      .then(r => r.json())
      .then(d => {
        if (d.user) {
          localStorage.setItem("ww3_me", JSON.stringify(d.user));
          setMe(d.user);
        }
      })
      .finally(() => setAuthLoading(false));
  }, [me]);

  const loadChats = useCallback(async () => {
    if (!me) return;
    const r = await fetch(`${API.getChats}?user_id=${me.id}`);
    const d = await r.json();
    setDirectChats(d.direct || []);
    setGroupChats(d.groups || []);
    setAllUsers(d.users || []);
  }, [me]);

  useEffect(() => { if (me) loadChats(); }, [me, loadChats]);

  const loadMessages = useCallback(async (chatId: number, reset = false) => {
    const afterId = reset ? 0 : lastMsgId.current;
    const r = await fetch(`${API.getMessages}?chat_id=${chatId}&after_id=${afterId}`);
    const d = await r.json();
    if (d.messages?.length) {
      lastMsgId.current = d.messages[d.messages.length - 1].id;
      if (reset) setMessages(d.messages);
      else setMessages(prev => [...prev, ...d.messages]);
    }
  }, []);

  useEffect(() => {
    if (!activeChat) return;
    lastMsgId.current = 0;
    loadMessages(activeChat.id, true);
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(() => loadMessages(activeChat.id), 3000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [activeChat, loadMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const openChat = (chat: Chat) => {
    setActiveChat(chat);
    setShowSidebar(false);
  };

  const handleSend = async () => {
    if (!text.trim() || !me || !activeChat || sending) return;
    setSending(true);
    await fetch(API.sendMessage, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: me.id, chat_id: activeChat.id, text: text.trim() })
    });
    setText("");
    await loadMessages(activeChat.id);
    await loadChats();
    setSending(false);
  };

  const handleStartDirect = async (user: User) => {
    if (!me) return;
    const r = await fetch(API.sendMessage, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: me.id, to_user_id: user.id, text: "👋" })
    });
    const d = await r.json();
    await loadChats();
    setShowNewChat(false);
    setTab("direct");
    const chat: Chat = { id: d.chat_id, type: "direct", name: user.name, other_user: user };
    openChat(chat);
  };

  const handleCreateGroup = async () => {
    if (!me || !groupName.trim() || selectedMembers.length === 0) return;
    const r = await fetch(API.sendMessage, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: me.id, group_name: groupName, member_ids: selectedMembers, text: "Группа создана" })
    });
    const d = await r.json();
    await loadChats();
    setShowNewGroup(false);
    setGroupName("");
    setSelectedMembers([]);
    setTab("groups");
    const chat: Chat = { id: d.chat_id, type: "group", name: groupName };
    openChat(chat);
  };

  if (authLoading) return (
    <div className="min-h-screen bg-[#1e2028] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-[#2d6a4f] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[#8b9ab0]">Подключение...</p>
      </div>
    </div>
  );

  if (!me) return null;

  const chats = tab === "direct" ? directChats : groupChats;

  return (
    <div className="flex h-screen bg-[#1e2028] text-white overflow-hidden">

      {/* Sidebar */}
      <div className={`${showSidebar ? "flex" : "hidden"} md:flex flex-col w-full md:w-80 bg-[#16181f] border-r border-[#2a2d38] flex-shrink-0`}>

        {/* Header */}
        <div className="px-4 py-4 border-b border-[#2a2d38]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <a href="/" className="text-[#6b7a8d] hover:text-white transition-colors">
                <Icon name="ArrowLeft" size={18} />
              </a>
              <div className="w-8 h-8 bg-[#2d6a4f] rounded-full flex items-center justify-center">
                <Icon name="Globe" size={16} />
              </div>
              <span className="font-bold text-white">WW3</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => { setShowNewChat(true); setTab("direct"); }}
                className="p-2 text-[#6b7a8d] hover:text-white hover:bg-[#2a2d38] rounded-lg transition-colors"
                title="Новый чат"
              >
                <Icon name="MessageSquarePlus" size={18} />
              </button>
              <button
                onClick={() => { setShowNewGroup(true); setTab("groups"); }}
                className="p-2 text-[#6b7a8d] hover:text-white hover:bg-[#2a2d38] rounded-lg transition-colors"
                title="Новая группа"
              >
                <Icon name="Users" size={18} />
              </button>
            </div>
          </div>

          {/* Me */}
          <div className="flex items-center gap-3 p-3 bg-[#2a2d38] rounded-xl">
            <Avatar name={me.name} size={36} />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{me.name}</p>
              <p className="text-xs text-[#6b7a8d] truncate">{me.position || me.country}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#2a2d38]">
          {(["direct", "groups"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${tab === t ? "text-white border-b-2 border-[#2d6a4f]" : "text-[#6b7a8d] hover:text-white"}`}
            >
              {t === "direct" ? "Личные" : "Группы"}
            </button>
          ))}
        </div>

        {/* Chat list */}
        <div className="flex-1 overflow-y-auto">
          {chats.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-[#6b7a8d] text-sm px-6 text-center gap-3">
              <Icon name={tab === "direct" ? "MessageCircle" : "Users"} size={36} />
              <p>{tab === "direct" ? "Нет личных чатов. Начни первым!" : "Нет групп. Создай новую!"}</p>
              <button
                onClick={() => tab === "direct" ? setShowNewChat(true) : setShowNewGroup(true)}
                className="px-4 py-2 bg-[#2d6a4f] hover:bg-[#1b4332] text-white rounded-lg text-sm transition-colors"
              >
                {tab === "direct" ? "Написать" : "Создать группу"}
              </button>
            </div>
          ) : chats.map(chat => (
            <button
              key={chat.id}
              onClick={() => openChat(chat)}
              className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-[#2a2d38] transition-colors text-left ${activeChat?.id === chat.id ? "bg-[#2a2d38]" : ""}`}
            >
              {chat.type === "group"
                ? <div className="w-10 h-10 rounded-full bg-[#1d4e89] flex items-center justify-center flex-shrink-0"><Icon name="Users" size={18} /></div>
                : <Avatar name={chat.other_user?.name || chat.name} size={40} />
              }
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-white truncate">{chat.name}</p>
                  <span className="text-xs text-[#6b7a8d] flex-shrink-0 ml-2">{formatDate(chat.last_message_at)}</span>
                </div>
                <p className="text-xs text-[#6b7a8d] truncate mt-0.5">
                  {chat.last_message || (chat.type === "group" ? `${chat.members_count} участников` : "Нет сообщений")}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className={`${!showSidebar ? "flex" : "hidden"} md:flex flex-col flex-1 min-w-0`}>
        {!activeChat ? (
          <div className="flex-1 flex flex-col items-center justify-center text-[#6b7a8d] gap-4">
            <div className="w-20 h-20 bg-[#2a2d38] rounded-full flex items-center justify-center">
              <Icon name="MessageCircle" size={36} />
            </div>
            <p className="text-lg font-medium text-white">Выбери чат</p>
            <p className="text-sm">Выбери чат слева или начни новый</p>
          </div>
        ) : (
          <>
            {/* Chat header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-[#16181f] border-b border-[#2a2d38]">
              <button onClick={() => setShowSidebar(true)} className="md:hidden text-[#6b7a8d] hover:text-white mr-1">
                <Icon name="ArrowLeft" size={20} />
              </button>
              {activeChat.type === "group"
                ? <div className="w-10 h-10 rounded-full bg-[#1d4e89] flex items-center justify-center"><Icon name="Users" size={18} /></div>
                : <Avatar name={activeChat.other_user?.name || activeChat.name} size={40} />
              }
              <div>
                <p className="font-semibold text-white">{activeChat.name}</p>
                <p className="text-xs text-[#6b7a8d]">
                  {activeChat.type === "group" ? `${activeChat.members_count || ""} участников` : (activeChat.other_user?.position || activeChat.other_user?.country || "")}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.length === 0 && (
                <div className="flex items-center justify-center h-full text-[#6b7a8d] text-sm">
                  Нет сообщений. Напиши первым!
                </div>
              )}
              {messages.map(msg => {
                const isMe = msg.user_id === me.id;
                return (
                  <div key={msg.id} className={`flex gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                    {!isMe && <Avatar name={msg.user_name} size={30} />}
                    <div className={`max-w-[70%] ${isMe ? "items-end" : "items-start"} flex flex-col gap-1`}>
                      {!isMe && <span className="text-xs text-[#6b7a8d] px-1">{msg.user_name}</span>}
                      <div className={`px-4 py-2 rounded-2xl text-sm ${isMe ? "bg-[#2d6a4f] text-white rounded-tr-sm" : "bg-[#2a2d38] text-[#c8d0dc] rounded-tl-sm"}`}>
                        {msg.text}
                      </div>
                      <span className="text-xs text-[#4a5568] px-1">{formatTime(msg.created_at)}</span>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 bg-[#16181f] border-t border-[#2a2d38]">
              <div className="flex items-center gap-2">
                <input
                  value={text}
                  onChange={e => setText(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  placeholder="Сообщение..."
                  className="flex-1 bg-[#2a2d38] border border-[#32363f] rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#4a5568] outline-none focus:border-[#2d6a4f] transition-colors"
                />
                <button
                  onClick={handleSend}
                  disabled={!text.trim() || sending}
                  className="w-10 h-10 bg-[#2d6a4f] hover:bg-[#1b4332] disabled:opacity-40 rounded-xl flex items-center justify-center transition-colors flex-shrink-0"
                >
                  <Icon name="Send" size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal: New direct chat */}
      {showNewChat && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
          <div className="bg-[#16181f] border border-[#2a2d38] rounded-2xl w-full max-w-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#2a2d38]">
              <h3 className="font-bold text-white">Новый чат</h3>
              <button onClick={() => setShowNewChat(false)} className="text-[#6b7a8d] hover:text-white"><Icon name="X" size={18} /></button>
            </div>
            <div className="max-h-80 overflow-y-auto py-2">
              {allUsers.length === 0 ? (
                <p className="text-center text-[#6b7a8d] text-sm py-6">Нет других пользователей</p>
              ) : allUsers.map(u => (
                <button key={u.id} onClick={() => handleStartDirect(u)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#2a2d38] transition-colors text-left">
                  <Avatar name={u.name} size={38} />
                  <div>
                    <p className="text-sm font-medium text-white">{u.name}</p>
                    <p className="text-xs text-[#6b7a8d]">{u.position} · {u.country}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal: New group */}
      {showNewGroup && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
          <div className="bg-[#16181f] border border-[#2a2d38] rounded-2xl w-full max-w-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#2a2d38]">
              <h3 className="font-bold text-white">Создать группу</h3>
              <button onClick={() => setShowNewGroup(false)} className="text-[#6b7a8d] hover:text-white"><Icon name="X" size={18} /></button>
            </div>
            <div className="px-5 py-4 space-y-4">
              <input
                value={groupName}
                onChange={e => setGroupName(e.target.value)}
                placeholder="Название группы"
                className="w-full bg-[#2a2d38] border border-[#32363f] rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#4a5568] outline-none focus:border-[#2d6a4f]"
              />
              <p className="text-xs text-[#6b7a8d] font-medium uppercase tracking-wide">Участники</p>
              <div className="max-h-48 overflow-y-auto space-y-1">
                {allUsers.map(u => (
                  <button key={u.id} onClick={() => setSelectedMembers(prev => prev.includes(u.id) ? prev.filter(x => x !== u.id) : [...prev, u.id])}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors text-left ${selectedMembers.includes(u.id) ? "bg-[#2d6a4f]/20 border border-[#2d6a4f]/40" : "hover:bg-[#2a2d38]"}`}>
                    <Avatar name={u.name} size={32} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{u.name}</p>
                      <p className="text-xs text-[#6b7a8d] truncate">{u.country}</p>
                    </div>
                    {selectedMembers.includes(u.id) && <Icon name="Check" size={16} className="text-[#2d6a4f] flex-shrink-0" />}
                  </button>
                ))}
              </div>
              <Button
                onClick={handleCreateGroup}
                disabled={!groupName.trim() || selectedMembers.length === 0}
                className="w-full bg-[#2d6a4f] hover:bg-[#1b4332] text-white disabled:opacity-40"
              >
                Создать группу ({selectedMembers.length})
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
