import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";

const SEND_APPLICATION_URL = "https://functions.poehali.dev/414195d8-31f8-470f-8abe-4a514ceb2f72";

const ApplicationForm = ({ onClose }: { onClose: () => void }) => {
  const [form, setForm] = useState({ name: "", country: "", position: "", email: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch(SEND_APPLICATION_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus("success");
      } else {
        setErrorMsg(data.error || "Ошибка отправки");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Не удалось отправить заявку. Попробуйте позже.");
      setStatus("error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="bg-[#16181f] border border-[#2a2d38] rounded-2xl p-6 sm:p-8 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#6b7a8d] hover:text-white transition-colors"
        >
          <Icon name="X" className="w-5 h-5" />
        </button>

        {status === "success" ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-[#2d6a4f] rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="CheckCircle" className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Заявка отправлена!</h3>
            <p className="text-[#8b9ab0] text-sm mb-6">
              Мы получили вашу заявку и свяжемся с вами для верификации.
            </p>
            <Button onClick={onClose} className="bg-[#2d6a4f] hover:bg-[#1b4332] text-white px-8">
              Закрыть
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#2d6a4f] rounded-full flex items-center justify-center">
                <Icon name="Globe" className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Заявка на вступление</h3>
                <p className="text-[#6b7a8d] text-xs">WW3 — верифицированное сообщество</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[#8b9ab0] text-xs font-medium uppercase tracking-wide mb-1 block">Полное имя</label>
                <input
                  type="text"
                  placeholder="Иван Иванов"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-[#1e2028] border border-[#2a2d38] rounded-lg px-4 py-2.5 text-white placeholder-[#4a5568] text-sm focus:outline-none focus:border-[#2d6a4f] transition-colors"
                  required
                />
              </div>
              <div>
                <label className="text-[#8b9ab0] text-xs font-medium uppercase tracking-wide mb-1 block">Страна</label>
                <input
                  type="text"
                  placeholder="Россия"
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                  className="w-full bg-[#1e2028] border border-[#2a2d38] rounded-lg px-4 py-2.5 text-white placeholder-[#4a5568] text-sm focus:outline-none focus:border-[#2d6a4f] transition-colors"
                  required
                />
              </div>
              <div>
                <label className="text-[#8b9ab0] text-xs font-medium uppercase tracking-wide mb-1 block">Должность / Роль</label>
                <input
                  type="text"
                  placeholder="Депутат парламента"
                  value={form.position}
                  onChange={(e) => setForm({ ...form, position: e.target.value })}
                  className="w-full bg-[#1e2028] border border-[#2a2d38] rounded-lg px-4 py-2.5 text-white placeholder-[#4a5568] text-sm focus:outline-none focus:border-[#2d6a4f] transition-colors"
                  required
                />
              </div>
              <div>
                <label className="text-[#8b9ab0] text-xs font-medium uppercase tracking-wide mb-1 block">Email для связи</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-[#1e2028] border border-[#2a2d38] rounded-lg px-4 py-2.5 text-white placeholder-[#4a5568] text-sm focus:outline-none focus:border-[#2d6a4f] transition-colors"
                  required
                />
              </div>

              {status === "error" && (
                <div className="bg-red-900/30 border border-red-700/50 rounded-lg px-4 py-2.5 text-red-400 text-sm">
                  {errorMsg}
                </div>
              )}

              <Button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-[#2d6a4f] hover:bg-[#1b4332] text-white py-3 rounded-lg font-semibold mt-2 disabled:opacity-60"
              >
                {status === "loading" ? (
                  <span className="flex items-center justify-center gap-2">
                    <Icon name="Loader2" className="w-4 h-4 animate-spin" />
                    Отправляем...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Icon name="Send" className="w-4 h-4" />
                    Подать заявку
                  </span>
                )}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

const Index = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen bg-[#1e2028] text-white overflow-x-hidden">
      {showForm && <ApplicationForm onClose={() => setShowForm(false)} />}

      {/* Навигация */}
      <nav className="bg-[#16181f] border-b border-[#0d0e12] px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#2d6a4f] rounded-full flex items-center justify-center">
              <Icon name="Globe" className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-white">WW3</h1>
              <p className="text-xs text-[#8b9ab0] hidden sm:block">Глобальная сеть для политиков</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <Button variant="ghost" className="text-[#8b9ab0] hover:text-white hover:bg-[#2a2d38]">
              <Icon name="Info" className="w-4 h-4 mr-2" />
              О платформе
            </Button>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-[#2d6a4f] hover:bg-[#1b4332] text-white px-6 py-2 rounded text-sm font-medium"
            >
              Вступить
            </Button>
          </div>
          <Button
            variant="ghost"
            className="sm:hidden text-[#8b9ab0] hover:text-white hover:bg-[#2a2d38] p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <Icon name="X" className="w-5 h-5" /> : <Icon name="Menu" className="w-5 h-5" />}
          </Button>
        </div>

        {mobileMenuOpen && (
          <div className="sm:hidden mt-4 pt-4 border-t border-[#0d0e12]">
            <div className="flex flex-col gap-3">
              <Button variant="ghost" className="text-[#8b9ab0] hover:text-white hover:bg-[#2a2d38] justify-start">
                <Icon name="Info" className="w-4 h-4 mr-2" />
                О платформе
              </Button>
              <Button
                onClick={() => { setShowForm(true); setMobileMenuOpen(false); }}
                className="bg-[#2d6a4f] hover:bg-[#1b4332] text-white px-6 py-2 rounded text-sm font-medium"
              >
                Вступить
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Макет */}
      <div className="flex min-h-screen">
        <div className="hidden lg:flex w-[72px] bg-[#0d0e12] flex-col items-center py-3 gap-2">
          <div className="w-12 h-12 bg-[#2d6a4f] rounded-2xl hover:rounded-xl transition-all duration-200 flex items-center justify-center cursor-pointer">
            <Icon name="Globe" className="w-6 h-6 text-white" />
          </div>
          <div className="w-8 h-[2px] bg-[#1e2028] rounded-full"></div>
          {["🇺🇳", "🇪🇺", "🌏", "🌎"].map((flag, i) => (
            <div
              key={i}
              className="w-12 h-12 bg-[#1e2028] rounded-3xl hover:rounded-xl transition-all duration-200 flex items-center justify-center cursor-pointer hover:bg-[#2d6a4f] text-xl"
            >
              {flag}
            </div>
          ))}
        </div>

        <div className="flex-1 flex flex-col lg:flex-row">
          <div className={`${mobileSidebarOpen ? "block" : "hidden"} lg:block w-full lg:w-60 bg-[#16181f] flex flex-col`}>
            <div className="p-4 border-b border-[#0d0e12] flex items-center justify-between">
              <h2 className="text-white font-semibold text-base">WW3</h2>
              <Button
                variant="ghost"
                className="lg:hidden text-[#8b9ab0] hover:text-white hover:bg-[#2a2d38] p-1"
                onClick={() => setMobileSidebarOpen(false)}
              >
                <Icon name="X" className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex-1 p-2">
              <div className="mb-4">
                <div className="flex items-center gap-1 px-2 py-1 text-[#6b7a8d] text-xs font-semibold uppercase tracking-wide">
                  <Icon name="ChevronRight" className="w-3 h-3" />
                  <span>Темы</span>
                </div>
                <div className="mt-1 space-y-0.5">
                  {[
                    { name: "общий", active: true },
                    { name: "международные-отношения", active: false },
                    { name: "безопасность", active: false },
                    { name: "экономика", active: false },
                    { name: "климат", active: false },
                  ].map((channel) => (
                    <div
                      key={channel.name}
                      className={`flex items-center gap-1.5 px-2 py-1 rounded cursor-pointer ${
                        channel.active ? "bg-[#2a2d38] text-white" : "text-[#6b7a8d] hover:text-[#c8d0dc] hover:bg-[#22252f]"
                      }`}
                    >
                      <Icon name="Hash" className="w-4 h-4" />
                      <span className="text-sm">{channel.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1 px-2 py-1 text-[#6b7a8d] text-xs font-semibold uppercase tracking-wide">
                  <Icon name="ChevronRight" className="w-3 h-3" />
                  <span>Конференции</span>
                </div>
                <div className="mt-1 space-y-0.5">
                  {["Саммит ООН", "Форум G20"].map((channel) => (
                    <div
                      key={channel}
                      className="flex items-center gap-1.5 px-2 py-1 rounded text-[#6b7a8d] hover:text-[#c8d0dc] hover:bg-[#22252f] cursor-pointer"
                    >
                      <Icon name="Mic" className="w-4 h-4" />
                      <span className="text-sm">{channel}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-2 bg-[#12141a] flex items-center gap-2">
              <div className="w-8 h-8 bg-[#2d6a4f] rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">P</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white text-sm font-medium truncate">Политик</div>
                <div className="text-[#8b9ab0] text-xs truncate">🟢 онлайн</div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" className="w-8 h-8 p-0 hover:bg-[#2a2d38]">
                  <Icon name="Mic" className="w-4 h-4 text-[#8b9ab0]" />
                </Button>
                <Button variant="ghost" size="sm" className="w-8 h-8 p-0 hover:bg-[#2a2d38]">
                  <Icon name="Settings" className="w-4 h-4 text-[#8b9ab0]" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            <div className="h-12 bg-[#1e2028] border-b border-[#0d0e12] flex items-center px-4 gap-2">
              <Button
                variant="ghost"
                className="lg:hidden text-[#6b7a8d] hover:text-[#c8d0dc] hover:bg-[#2a2d38] p-1 mr-2"
                onClick={() => setMobileSidebarOpen(true)}
              >
                <Icon name="Menu" className="w-5 h-5" />
              </Button>
              <Icon name="Hash" className="w-5 h-5 text-[#6b7a8d]" />
              <span className="text-white font-semibold">общий</span>
              <div className="w-px h-6 bg-[#2a2d38] mx-2 hidden sm:block"></div>
              <span className="text-[#6b7a8d] text-sm hidden sm:block">Площадка для международного политического диалога</span>
              <div className="ml-auto flex items-center gap-2 sm:gap-4">
                <Icon name="Bell" className="w-4 h-4 sm:w-5 sm:h-5 text-[#8b9ab0] cursor-pointer hover:text-[#c8d0dc]" />
                <Icon name="Users" className="w-4 h-4 sm:w-5 sm:h-5 text-[#8b9ab0] cursor-pointer hover:text-[#c8d0dc]" />
                <Icon name="Search" className="w-4 h-4 sm:w-5 sm:h-5 text-[#8b9ab0] cursor-pointer hover:text-[#c8d0dc]" />
              </div>
            </div>

            <div className="flex-1 p-2 sm:p-4 space-y-4 sm:space-y-6 overflow-y-auto">
              <div className="flex gap-2 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#2d6a4f] rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon name="Globe" className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-white font-semibold text-sm sm:text-base">WW3</span>
                    <span className="text-[#6b7a8d] text-xs">сегодня в 09:00</span>
                  </div>
                  <div className="mt-1 bg-[#2d6a4f]/20 border border-[#2d6a4f]/40 rounded-lg p-3 sm:p-4 max-w-2xl">
                    <p className="text-[#c8d0dc] text-sm sm:text-base leading-relaxed">
                      👋 Добро пожаловать в <strong className="text-white">WW3</strong> — первую международную платформу для политического диалога.
                      Здесь лидеры, дипломаты и политики со всего мира обмениваются взглядами, строят коалиции и формируют повестку будущего.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#1a3a5c] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs sm:text-sm font-medium">🇩🇪</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-[#60a5fa] font-semibold text-sm sm:text-base">Klaus Weber</span>
                    <span className="text-[#6b7a8d] text-xs">Бундестаг · Германия</span>
                    <span className="text-[#6b7a8d] text-xs">10:14</span>
                  </div>
                  <p className="text-[#c8d0dc] mt-1 text-sm sm:text-base leading-relaxed">
                    Именно такой платформы не хватало международному сообществу. Наконец место, где можно вести прямой диалог без посредников 🤝
                  </p>
                </div>
              </div>

              <div className="flex gap-2 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#5c1a3a] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs sm:text-sm font-medium">🇧🇷</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-[#f97316] font-semibold text-sm sm:text-base">Maria Costa</span>
                    <span className="text-[#6b7a8d] text-xs">Сенат · Бразилия</span>
                    <span className="text-[#6b7a8d] text-xs">10:31</span>
                  </div>
                  <p className="text-[#c8d0dc] mt-1 text-sm sm:text-base leading-relaxed">
                    Глобальные вызовы требуют глобального общения. Поддерживаю эту инициативу — особенно блок по климатической политике 🌿
                  </p>
                </div>
              </div>

              <div className="flex gap-2 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#3a1a5c] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs sm:text-sm font-medium">🇯🇵</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-[#a78bfa] font-semibold text-sm sm:text-base">Hiroshi Tanaka</span>
                    <span className="text-[#6b7a8d] text-xs">Парламент · Япония</span>
                    <span className="text-[#6b7a8d] text-xs">11:02</span>
                  </div>
                  <p className="text-[#c8d0dc] mt-1 text-sm sm:text-base leading-relaxed">
                    Верификация участников — ключевое преимущество. Здесь знаешь, что общаешься с реальными официальными лицами.
                  </p>
                </div>
              </div>

              {/* Главный CTA */}
              <div className="my-6 sm:my-8 text-center px-4 py-8 sm:py-16 bg-[#16181f] rounded-xl border border-[#2a2d38]">
                <div className="w-16 h-16 bg-[#2d6a4f] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Icon name="Globe" className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl sm:text-4xl font-bold mb-4 text-white leading-tight">
                  Международная площадка<br />для политического диалога
                </h2>
                <p className="text-[#8b9ab0] text-base sm:text-lg mb-8 max-w-xl mx-auto leading-relaxed">
                  WW3 объединяет политиков, дипломатов и лидеров мнений из более чем 80 стран. Безопасная верифицированная среда для реального обмена взглядами.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => setShowForm(true)}
                    className="bg-[#2d6a4f] hover:bg-[#1b4332] text-white px-8 py-3 rounded-lg text-base font-semibold"
                  >
                    <Icon name="UserPlus" className="w-4 h-4 mr-2" />
                    Подать заявку
                  </Button>
                  <Button variant="outline" className="border-[#2a2d38] text-[#c8d0dc] hover:bg-[#2a2d38] hover:text-white px-8 py-3 rounded-lg text-base">
                    <Icon name="PlayCircle" className="w-4 h-4 mr-2" />
                    Смотреть демо
                  </Button>
                </div>
              </div>

              {/* Возможности */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-2">
                {[
                  { icon: "ShieldCheck", title: "Верификация личности", description: "Каждый участник проходит официальную проверку статуса. Только действующие политики и дипломаты.", color: "text-[#60a5fa]", bg: "bg-[#1a3a5c]/30" },
                  { icon: "Languages", title: "Мультиязычность", description: "Встроенный перевод на 40+ языков. Общайтесь с коллегами без языкового барьера.", color: "text-[#34d399]", bg: "bg-[#064e3b]/30" },
                  { icon: "Lock", title: "Защищённые каналы", description: "Приватные комнаты для конфиденциальных переговоров с end-to-end шифрованием.", color: "text-[#f59e0b]", bg: "bg-[#451a03]/30" },
                  { icon: "BarChart3", title: "Аналитика и голосования", description: "Проводите опросы, собирайте мнения и отслеживайте позиции по ключевым вопросам.", color: "text-[#a78bfa]", bg: "bg-[#2d1a5c]/30" },
                ].map((feature) => (
                  <div key={feature.title} className={`${feature.bg} border border-[#2a2d38] rounded-xl p-5`}>
                    <div className={`${feature.color} mb-3`}>
                      <Icon name={feature.icon} className="w-6 h-6" />
                    </div>
                    <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                    <p className="text-[#8b9ab0] text-sm leading-relaxed">{feature.description}</p>
                  </div>
                ))}
              </div>

              {/* Активность */}
              <div className="bg-[#12141a] border border-[#2a2d38] rounded-xl p-4 sm:p-6 mx-2">
                <div className="flex items-center gap-2 mb-4">
                  <Icon name="Activity" className="w-4 h-4 text-[#2d6a4f]" />
                  <span className="text-[#6b7a8d] text-xs font-semibold uppercase tracking-wide">Активность участника</span>
                </div>
                <div className="flex items-center gap-4 p-4 bg-[#1e2028] rounded-lg border border-[#2a2d38]">
                  <div className="w-14 h-14 bg-[#2d6a4f] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon name="Globe" className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-semibold text-sm">WW3</div>
                    <div className="text-[#8b9ab0] text-xs mt-0.5">🌐 Обсуждает: Климатическое соглашение 2026</div>
                    <div className="text-[#8b9ab0] text-xs">📍 Форум: Международная безопасность</div>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-2 h-2 bg-[#34d399] rounded-full animate-pulse"></div>
                      <span className="text-[#34d399] text-xs font-medium">Активен · 2ч 14м</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <Button size="sm" className="bg-[#2d6a4f] hover:bg-[#1b4332] text-white text-xs px-3 h-7">Написать</Button>
                    <Button size="sm" variant="outline" className="border-[#2a2d38] text-[#8b9ab0] hover:text-white text-xs px-3 h-7">Профиль</Button>
                  </div>
                </div>
              </div>

              {/* Статистика */}
              <div className="grid grid-cols-3 gap-4 mx-2">
                {[
                  { value: "80+", label: "стран", icon: "Globe" },
                  { value: "2 400", label: "политиков", icon: "Users" },
                  { value: "50+", label: "форумов", icon: "MessageSquare" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-[#16181f] border border-[#2a2d38] rounded-xl p-4 text-center">
                    <Icon name={stat.icon} className="w-5 h-5 text-[#2d6a4f] mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-[#6b7a8d] text-xs mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Финальный CTA */}
              <div className="text-center py-10 sm:py-16 px-4">
                <h3 className="text-xl sm:text-3xl font-bold text-white mb-4">Готовы присоединиться?</h3>
                <p className="text-[#8b9ab0] mb-8 max-w-md mx-auto">
                  Подайте заявку на верификацию и станьте частью глобального политического сообщества.
                </p>
                <Button
                  onClick={() => setShowForm(true)}
                  className="bg-[#2d6a4f] hover:bg-[#1b4332] text-white px-10 py-3 rounded-lg text-base font-semibold"
                >
                  <Icon name="UserPlus" className="w-4 h-4 mr-2" />
                  Подать заявку
                </Button>
              </div>
            </div>
          </div>

          {/* Правая панель участников */}
          <div className="hidden xl:flex w-60 bg-[#16181f] flex-col p-4 border-l border-[#0d0e12]">
            <h3 className="text-[#6b7a8d] text-xs font-semibold uppercase tracking-wide mb-3">Онлайн — 128</h3>
            <div className="space-y-1">
              {[
                { name: "Klaus Weber", country: "🇩🇪 Германия", color: "bg-[#60a5fa]" },
                { name: "Maria Costa", country: "🇧🇷 Бразилия", color: "bg-[#f97316]" },
                { name: "Hiroshi Tanaka", country: "🇯🇵 Япония", color: "bg-[#a78bfa]" },
                { name: "Amara Diallo", country: "🇸🇳 Сенегал", color: "bg-[#34d399]" },
                { name: "Elena Morozova", country: "🇧🇬 Болгария", color: "bg-[#f472b6]" },
                { name: "James Okafor", country: "🇳🇬 Нигерия", color: "bg-[#fbbf24]" },
              ].map((member) => (
                <div key={member.name} className="flex items-center gap-3 p-2 rounded hover:bg-[#22252f] cursor-pointer group">
                  <div className="relative">
                    <div className={`w-8 h-8 ${member.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                      <Icon name="User" className="w-4 h-4 text-white" />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#34d399] rounded-full border-2 border-[#16181f]"></div>
                  </div>
                  <div className="min-w-0">
                    <div className="text-[#c8d0dc] text-sm font-medium truncate group-hover:text-white">{member.name}</div>
                    <div className="text-[#6b7a8d] text-xs truncate">{member.country}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
