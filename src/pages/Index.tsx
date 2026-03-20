import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";

const SEND_APPLICATION_URL = "https://functions.poehali.dev/414195d8-31f8-470f-8abe-4a514ceb2f72";

const LANGS = {
  ru: { flag: "🇷🇺", label: "RU" },
  en: { flag: "🇬🇧", label: "EN" },
  zh: { flag: "🇨🇳", label: "ZH" },
  ar: { flag: "🇸🇦", label: "AR" },
  fr: { flag: "🇫🇷", label: "FR" },
  es: { flag: "🇪🇸", label: "ES" },
} as const;

type LangKey = keyof typeof LANGS;

const T: Record<LangKey, Record<string, string>> = {
  ru: {
    tagline: "Глобальная сеть для политиков",
    about: "О платформе",
    join: "Вступить",
    topics: "Темы",
    conferences: "Конференции",
    online: "Онлайн — 128",
    channelDesc: "Площадка для международного политического диалога",
    welcomeMsg: "Добро пожаловать в WW3 — первую международную платформу для политического диалога. Здесь лидеры, дипломаты и политики со всего мира обмениваются взглядами, строят коалиции и формируют повестку будущего.",
    heroTitle: "Международная площадка для политического диалога",
    heroDesc: "WW3 объединяет политиков, дипломатов и лидеров мнений из более чем 80 стран. Безопасная верифицированная среда для реального обмена взглядами.",
    applyBtn: "Подать заявку",
    demoBtn: "Смотреть демо",
    f1title: "Верификация личности",
    f1desc: "Каждый участник проходит официальную проверку статуса. Только действующие политики и дипломаты.",
    f2title: "Мультиязычность",
    f2desc: "Встроенный перевод на 40+ языков. Общайтесь с коллегами без языкового барьера.",
    f3title: "Защищённые каналы",
    f3desc: "Приватные комнаты для конфиденциальных переговоров с end-to-end шифрованием.",
    f4title: "Аналитика и голосования",
    f4desc: "Проводите опросы, собирайте мнения и отслеживайте позиции по ключевым вопросам.",
    ctaTitle: "Готовы присоединиться?",
    ctaDesc: "Подайте заявку на верификацию и станьте частью глобального политического сообщества.",
    formTitle: "Заявка на вступление",
    formSub: "WW3 — верифицированное сообщество",
    fieldName: "Полное имя",
    fieldCountry: "Страна",
    fieldPosition: "Должность / Роль",
    fieldEmail: "Email для связи",
    sending: "Отправляем...",
    send: "Подать заявку",
    successTitle: "Заявка отправлена!",
    successDesc: "Мы получили вашу заявку и свяжемся с вами для верификации.",
    close: "Закрыть",
    errFill: "Заполните все поля",
    errSend: "Не удалось отправить заявку. Попробуйте позже.",
    countries: "стран",
    politicians: "политиков",
    forums: "форумов",
    activity: "Активность участника",
    active: "Активен · 2ч 14м",
    write: "Написать",
    profile: "Профиль",
  },
  en: {
    tagline: "Global network for politicians",
    about: "About",
    join: "Join",
    topics: "Topics",
    conferences: "Conferences",
    online: "Online — 128",
    channelDesc: "A platform for international political dialogue",
    welcomeMsg: "Welcome to WW3 — the first international platform for political dialogue. Leaders, diplomats and politicians from around the world share views, build coalitions and shape the agenda of the future.",
    heroTitle: "International Platform for Political Dialogue",
    heroDesc: "WW3 brings together politicians, diplomats and opinion leaders from over 80 countries. A secure, verified environment for genuine exchange of views.",
    applyBtn: "Apply Now",
    demoBtn: "Watch Demo",
    f1title: "Identity Verification",
    f1desc: "Every member passes official status verification. Only active politicians and diplomats.",
    f2title: "Multilingual",
    f2desc: "Built-in translation for 40+ languages. Communicate with colleagues without language barriers.",
    f3title: "Secure Channels",
    f3desc: "Private rooms for confidential negotiations with end-to-end encryption.",
    f4title: "Analytics & Polls",
    f4desc: "Run polls, collect opinions and track positions on key issues.",
    ctaTitle: "Ready to join?",
    ctaDesc: "Apply for verification and become part of the global political community.",
    formTitle: "Membership Application",
    formSub: "WW3 — verified community",
    fieldName: "Full Name",
    fieldCountry: "Country",
    fieldPosition: "Position / Role",
    fieldEmail: "Contact Email",
    sending: "Sending...",
    send: "Submit Application",
    successTitle: "Application Sent!",
    successDesc: "We received your application and will contact you for verification.",
    close: "Close",
    errFill: "Please fill in all fields",
    errSend: "Failed to send application. Please try again later.",
    countries: "countries",
    politicians: "politicians",
    forums: "forums",
    activity: "Member Activity",
    active: "Active · 2h 14m",
    write: "Message",
    profile: "Profile",
  },
  zh: {
    tagline: "政治家全球网络",
    about: "关于平台",
    join: "加入",
    topics: "话题",
    conferences: "会议",
    online: "在线 — 128",
    channelDesc: "国际政治对话平台",
    welcomeMsg: "欢迎来到 WW3 — 首个国际政治对话平台。来自世界各地的领导人、外交官和政治家在这里交流观点、建立联盟并制定未来议程。",
    heroTitle: "国际政治对话平台",
    heroDesc: "WW3 汇聚了来自80多个国家的政治家、外交官和意见领袖。安全、经认证的真实观点交流环境。",
    applyBtn: "立即申请",
    demoBtn: "观看演示",
    f1title: "身份验证",
    f1desc: "每位成员均经过官方身份核实，仅限在职政治家和外交官。",
    f2title: "多语言支持",
    f2desc: "内置40+语言翻译，无语言障碍地与同僚沟通。",
    f3title: "安全频道",
    f3desc: "端对端加密的私密谈判室。",
    f4title: "分析与投票",
    f4desc: "开展民调，收集意见，追踪关键议题立场。",
    ctaTitle: "准备好加入了吗？",
    ctaDesc: "申请验证，成为全球政治社区的一部分。",
    formTitle: "入会申请",
    formSub: "WW3 — 经认证的社区",
    fieldName: "全名",
    fieldCountry: "国家",
    fieldPosition: "职位/角色",
    fieldEmail: "联系邮箱",
    sending: "发送中...",
    send: "提交申请",
    successTitle: "申请已发送！",
    successDesc: "我们已收到您的申请，将联系您进行验证。",
    close: "关闭",
    errFill: "请填写所有字段",
    errSend: "发送失败，请稍后重试。",
    countries: "国家",
    politicians: "政治家",
    forums: "论坛",
    activity: "成员活动",
    active: "活跃 · 2小时14分",
    write: "发消息",
    profile: "个人资料",
  },
  ar: {
    tagline: "شبكة عالمية للسياسيين",
    about: "عن المنصة",
    join: "انضم",
    topics: "مواضيع",
    conferences: "مؤتمرات",
    online: "متصل — 128",
    channelDesc: "منصة للحوار السياسي الدولي",
    welcomeMsg: "مرحباً بك في WW3 — أول منصة دولية للحوار السياسي. يتبادل القادة والدبلوماسيون والسياسيون من حول العالم الآراء ويبنون التحالفات ويشكلون أجندة المستقبل.",
    heroTitle: "منصة دولية للحوار السياسي",
    heroDesc: "تجمع WW3 سياسيين ودبلوماسيين وقادة رأي من أكثر من 80 دولة. بيئة آمنة وموثقة لتبادل وجهات النظر الحقيقية.",
    applyBtn: "تقدم الآن",
    demoBtn: "مشاهدة العرض",
    f1title: "التحقق من الهوية",
    f1desc: "يخضع كل عضو للتحقق الرسمي من الوضع. السياسيون والدبلوماسيون الفعليون فقط.",
    f2title: "متعدد اللغات",
    f2desc: "ترجمة مدمجة لأكثر من 40 لغة. تواصل مع الزملاء بدون حواجز لغوية.",
    f3title: "قنوات آمنة",
    f3desc: "غرف خاصة للمفاوضات السرية مع تشفير من طرف إلى طرف.",
    f4title: "التحليلات والاستطلاعات",
    f4desc: "أجرِ استطلاعات الرأي وتتبع المواقف من القضايا الرئيسية.",
    ctaTitle: "هل أنت مستعد للانضمام؟",
    ctaDesc: "تقدم للتحقق وكن جزءاً من المجتمع السياسي العالمي.",
    formTitle: "طلب العضوية",
    formSub: "WW3 — مجتمع موثق",
    fieldName: "الاسم الكامل",
    fieldCountry: "الدولة",
    fieldPosition: "المنصب / الدور",
    fieldEmail: "البريد الإلكتروني",
    sending: "جارٍ الإرسال...",
    send: "تقديم الطلب",
    successTitle: "تم إرسال الطلب!",
    successDesc: "تلقينا طلبك وسنتصل بك للتحقق.",
    close: "إغلاق",
    errFill: "يرجى ملء جميع الحقول",
    errSend: "فشل الإرسال. حاول مرة أخرى لاحقاً.",
    countries: "دولة",
    politicians: "سياسي",
    forums: "منتدى",
    activity: "نشاط العضو",
    active: "نشط · 2س 14د",
    write: "رسالة",
    profile: "الملف الشخصي",
  },
  fr: {
    tagline: "Réseau mondial pour les politiciens",
    about: "À propos",
    join: "Rejoindre",
    topics: "Sujets",
    conferences: "Conférences",
    online: "En ligne — 128",
    channelDesc: "Plateforme de dialogue politique international",
    welcomeMsg: "Bienvenue sur WW3 — la première plateforme internationale de dialogue politique. Des dirigeants, diplomates et politiciens du monde entier échangent des points de vue, forment des coalitions et façonnent l'agenda de l'avenir.",
    heroTitle: "Plateforme Internationale de Dialogue Politique",
    heroDesc: "WW3 réunit des politiciens, diplomates et leaders d'opinion de plus de 80 pays. Un environnement sécurisé et vérifié pour un véritable échange de vues.",
    applyBtn: "Postuler",
    demoBtn: "Voir la démo",
    f1title: "Vérification d'identité",
    f1desc: "Chaque membre fait l'objet d'une vérification officielle. Uniquement des politiciens et diplomates en exercice.",
    f2title: "Multilingue",
    f2desc: "Traduction intégrée pour 40+ langues. Communiquez sans barrières linguistiques.",
    f3title: "Canaux sécurisés",
    f3desc: "Salles privées pour des négociations confidentielles avec chiffrement de bout en bout.",
    f4title: "Analyses & Sondages",
    f4desc: "Réalisez des sondages, recueillez des avis et suivez les positions sur les enjeux clés.",
    ctaTitle: "Prêt à rejoindre ?",
    ctaDesc: "Postulez pour la vérification et rejoignez la communauté politique mondiale.",
    formTitle: "Demande d'adhésion",
    formSub: "WW3 — communauté vérifiée",
    fieldName: "Nom complet",
    fieldCountry: "Pays",
    fieldPosition: "Poste / Rôle",
    fieldEmail: "Email de contact",
    sending: "Envoi en cours...",
    send: "Soumettre la demande",
    successTitle: "Demande envoyée !",
    successDesc: "Nous avons reçu votre demande et vous contacterons pour la vérification.",
    close: "Fermer",
    errFill: "Veuillez remplir tous les champs",
    errSend: "Échec de l'envoi. Veuillez réessayer plus tard.",
    countries: "pays",
    politicians: "politiciens",
    forums: "forums",
    activity: "Activité du membre",
    active: "Actif · 2h 14m",
    write: "Message",
    profile: "Profil",
  },
  es: {
    tagline: "Red global para políticos",
    about: "Sobre nosotros",
    join: "Unirse",
    topics: "Temas",
    conferences: "Conferencias",
    online: "En línea — 128",
    channelDesc: "Plataforma para el diálogo político internacional",
    welcomeMsg: "Bienvenido a WW3 — la primera plataforma internacional para el diálogo político. Líderes, diplomáticos y políticos de todo el mundo comparten puntos de vista, forman coaliciones y dan forma a la agenda del futuro.",
    heroTitle: "Plataforma Internacional de Diálogo Político",
    heroDesc: "WW3 reúne a políticos, diplomáticos y líderes de opinión de más de 80 países. Un entorno seguro y verificado para el intercambio genuino de puntos de vista.",
    applyBtn: "Solicitar ahora",
    demoBtn: "Ver demo",
    f1title: "Verificación de identidad",
    f1desc: "Cada miembro pasa por verificación oficial de estado. Solo políticos y diplomáticos en activo.",
    f2title: "Multilingüe",
    f2desc: "Traducción integrada para más de 40 idiomas. Comuníquese sin barreras lingüísticas.",
    f3title: "Canales seguros",
    f3desc: "Salas privadas para negociaciones confidenciales con cifrado de extremo a extremo.",
    f4title: "Análisis y encuestas",
    f4desc: "Realice encuestas, recoja opiniones y realice un seguimiento de las posiciones sobre cuestiones clave.",
    ctaTitle: "¿Listo para unirse?",
    ctaDesc: "Solicite la verificación y únase a la comunidad política mundial.",
    formTitle: "Solicitud de membresía",
    formSub: "WW3 — comunidad verificada",
    fieldName: "Nombre completo",
    fieldCountry: "País",
    fieldPosition: "Cargo / Rol",
    fieldEmail: "Email de contacto",
    sending: "Enviando...",
    send: "Enviar solicitud",
    successTitle: "¡Solicitud enviada!",
    successDesc: "Hemos recibido su solicitud y nos pondremos en contacto con usted para la verificación.",
    close: "Cerrar",
    errFill: "Por favor, rellene todos los campos",
    errSend: "Error al enviar. Por favor, inténtelo de nuevo más tarde.",
    countries: "países",
    politicians: "políticos",
    forums: "foros",
    activity: "Actividad del miembro",
    active: "Activo · 2h 14m",
    write: "Mensaje",
    profile: "Perfil",
  },
};

const ApplicationForm = ({ onClose, onSuccess, t }: { onClose: () => void; onSuccess: (name: string) => void; t: Record<string, string> }) => {
  const [form, setForm] = useState({ name: "", country: "", position: "", email: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
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
        localStorage.setItem("ww3_email", form.email);
        localStorage.setItem("ww3_country", form.country);
        localStorage.setItem("ww3_position", form.position);
        onSuccess(form.name);
      } else {
        setErrorMsg(data.error || t.errFill);
        setStatus("error");
      }
    } catch {
      setErrorMsg(t.errSend);
      setStatus("error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="bg-[#16181f] border border-[#2a2d38] rounded-2xl p-6 sm:p-8 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-[#6b7a8d] hover:text-white transition-colors">
          <Icon name="X" className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#2d6a4f] rounded-full flex items-center justify-center">
              <Icon name="Globe" className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">{t.formTitle}</h3>
              <p className="text-[#6b7a8d] text-xs">{t.formSub}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { key: "name", label: t.fieldName, placeholder: "Ivan Petrov", type: "text" },
              { key: "country", label: t.fieldCountry, placeholder: "Russia", type: "text" },
              { key: "position", label: t.fieldPosition, placeholder: "Member of Parliament", type: "text" },
              { key: "email", label: t.fieldEmail, placeholder: "name@example.com", type: "email" },
            ].map(({ key, label, placeholder, type }) => (
              <div key={key}>
                <label className="text-[#8b9ab0] text-xs font-medium uppercase tracking-wide mb-1 block">{label}</label>
                <input
                  type={type}
                  placeholder={placeholder}
                  value={form[key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="w-full bg-[#1e2028] border border-[#2a2d38] rounded-lg px-4 py-2.5 text-white placeholder-[#4a5568] text-sm focus:outline-none focus:border-[#2d6a4f] transition-colors"
                  required
                />
              </div>
            ))}

            {status === "error" && (
              <div className="bg-red-900/30 border border-red-700/50 rounded-lg px-4 py-2.5 text-red-400 text-sm">{errorMsg}</div>
            )}

            <Button
              type="submit"
              disabled={status === "loading"}
              className="w-full bg-[#2d6a4f] hover:bg-[#1b4332] text-white py-3 rounded-lg font-semibold mt-2 disabled:opacity-60"
            >
              {status === "loading" ? (
                <span className="flex items-center justify-center gap-2">
                  <Icon name="Loader2" className="w-4 h-4 animate-spin" />{t.sending}
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Icon name="Send" className="w-4 h-4" />{t.send}
                </span>
              )}
            </Button>
          </form>
      </div>
    </div>
  );
};

const Index = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [lang, setLang] = useState<LangKey>("ru");
  const [langOpen, setLangOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(() => !!localStorage.getItem("ww3_user"));
  const [userName, setUserName] = useState(() => localStorage.getItem("ww3_user") || "");

  const handleLogin = (name: string) => {
    localStorage.setItem("ww3_user", name);
    setUserName(name);
    setLoggedIn(true);
    setShowForm(false);
  };

  const t = T[lang];
  const isRtl = lang === "ar";

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-[#1e2028] text-white flex items-center justify-center px-4">
        <ApplicationForm onClose={() => {}} onSuccess={handleLogin} t={t} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1e2028] text-white overflow-x-hidden" dir={isRtl ? "rtl" : "ltr"}>
      {showForm && <ApplicationForm onClose={() => setShowForm(false)} onSuccess={handleLogin} t={t} />}

      {/* Навигация */}
      <nav className="bg-[#16181f] border-b border-[#0d0e12] px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#2d6a4f] rounded-full flex items-center justify-center">
              <Icon name="Globe" className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-white">WW3</h1>
              <p className="text-xs text-[#8b9ab0] hidden sm:block">{t.tagline}</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            {/* Переключатель языка */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2a2d38] hover:bg-[#32363f] text-[#c8d0dc] text-sm transition-colors"
              >
                <span>{LANGS[lang].flag}</span>
                <span className="font-medium">{LANGS[lang].label}</span>
                <Icon name="ChevronDown" className="w-3 h-3 text-[#6b7a8d]" />
              </button>
              {langOpen && (
                <div className="absolute top-full mt-1 right-0 bg-[#1e2028] border border-[#2a2d38] rounded-xl shadow-xl z-50 overflow-hidden min-w-[120px]">
                  {(Object.entries(LANGS) as [LangKey, { flag: string; label: string }][]).map(([key, val]) => (
                    <button
                      key={key}
                      onClick={() => { setLang(key); setLangOpen(false); }}
                      className={`w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-[#2a2d38] transition-colors ${lang === key ? "text-white bg-[#2d6a4f]/20" : "text-[#c8d0dc]"}`}
                    >
                      <span>{val.flag}</span>
                      <span>{val.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Button variant="ghost" className="text-[#8b9ab0] hover:text-white hover:bg-[#2a2d38]">
              <Icon name="Info" className="w-4 h-4 mr-2" />
              {t.about}
            </Button>
            <a href="/messenger" className="flex items-center gap-2 bg-[#2d6a4f] hover:bg-[#1b4332] px-4 py-2 rounded-lg transition-colors">
              <Icon name="MessageCircle" className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-medium">Мессенджер</span>
            </a>
            <div className="flex items-center gap-2 bg-[#2a2d38] px-4 py-2 rounded-lg">
              <div className="w-6 h-6 bg-[#2d6a4f] rounded-full flex items-center justify-center text-xs font-bold text-white">
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className="text-white text-sm font-medium">{userName}</span>
            </div>
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
              {/* Мобильный переключатель языка */}
              <div className="flex flex-wrap gap-2">
                {(Object.entries(LANGS) as [LangKey, { flag: string; label: string }][]).map(([key, val]) => (
                  <button
                    key={key}
                    onClick={() => setLang(key)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${lang === key ? "bg-[#2d6a4f] text-white" : "bg-[#2a2d38] text-[#c8d0dc]"}`}
                  >
                    <span>{val.flag}</span>
                    <span>{val.label}</span>
                  </button>
                ))}
              </div>
              <Button variant="ghost" className="text-[#8b9ab0] hover:text-white hover:bg-[#2a2d38] justify-start">
                <Icon name="Info" className="w-4 h-4 mr-2" />{t.about}
              </Button>
              <Button onClick={() => { setShowForm(true); setMobileMenuOpen(false); }} className="bg-[#2d6a4f] hover:bg-[#1b4332] text-white px-6 py-2 rounded text-sm font-medium">
                {t.join}
              </Button>
            </div>
          </div>
        )}
      </nav>

      <div className="flex min-h-screen">
        {/* Боковая панель регионов */}
        <div className="hidden lg:flex w-[72px] bg-[#0d0e12] flex-col items-center py-3 gap-2">
          <div className="w-12 h-12 bg-[#2d6a4f] rounded-2xl hover:rounded-xl transition-all duration-200 flex items-center justify-center cursor-pointer">
            <Icon name="Globe" className="w-6 h-6 text-white" />
          </div>
          <div className="w-8 h-[2px] bg-[#1e2028] rounded-full"></div>
          {["🇺🇳", "🇪🇺", "🌏", "🌎"].map((flag, i) => (
            <div key={i} className="w-12 h-12 bg-[#1e2028] rounded-3xl hover:rounded-xl transition-all duration-200 flex items-center justify-center cursor-pointer hover:bg-[#2d6a4f] text-xl">
              {flag}
            </div>
          ))}
        </div>

        <div className="flex-1 flex flex-col lg:flex-row">
          {/* Боковая панель каналов */}
          <div className={`${mobileSidebarOpen ? "block" : "hidden"} lg:block w-full lg:w-60 bg-[#16181f] flex flex-col`}>
            <div className="p-4 border-b border-[#0d0e12] flex items-center justify-between">
              <h2 className="text-white font-semibold text-base">WW3</h2>
              <Button variant="ghost" className="lg:hidden text-[#8b9ab0] hover:text-white hover:bg-[#2a2d38] p-1" onClick={() => setMobileSidebarOpen(false)}>
                <Icon name="X" className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex-1 p-2">
              <div className="mb-4">
                <div className="flex items-center gap-1 px-2 py-1 text-[#6b7a8d] text-xs font-semibold uppercase tracking-wide">
                  <Icon name="ChevronRight" className="w-3 h-3" />
                  <span>{t.topics}</span>
                </div>
                <div className="mt-1 space-y-0.5">
                  {["general", "international-relations", "security", "economy", "climate"].map((ch, i) => (
                    <div key={ch} className={`flex items-center gap-1.5 px-2 py-1 rounded cursor-pointer ${i === 0 ? "bg-[#2a2d38] text-white" : "text-[#6b7a8d] hover:text-[#c8d0dc] hover:bg-[#22252f]"}`}>
                      <Icon name="Hash" className="w-4 h-4" />
                      <span className="text-sm">{ch}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1 px-2 py-1 text-[#6b7a8d] text-xs font-semibold uppercase tracking-wide">
                  <Icon name="ChevronRight" className="w-3 h-3" />
                  <span>{t.conferences}</span>
                </div>
                <div className="mt-1 space-y-0.5">
                  {["UN Summit", "G20 Forum"].map((ch) => (
                    <div key={ch} className="flex items-center gap-1.5 px-2 py-1 rounded text-[#6b7a8d] hover:text-[#c8d0dc] hover:bg-[#22252f] cursor-pointer">
                      <Icon name="Mic" className="w-4 h-4" />
                      <span className="text-sm">{ch}</span>
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
                <div className="text-white text-sm font-medium truncate">Politician</div>
                <div className="text-[#8b9ab0] text-xs truncate">🟢 online</div>
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

          {/* Чат */}
          <div className="flex-1 flex flex-col">
            <div className="h-12 bg-[#1e2028] border-b border-[#0d0e12] flex items-center px-4 gap-2">
              <Button variant="ghost" className="lg:hidden text-[#6b7a8d] hover:text-[#c8d0dc] hover:bg-[#2a2d38] p-1 mr-2" onClick={() => setMobileSidebarOpen(true)}>
                <Icon name="Menu" className="w-5 h-5" />
              </Button>
              <Icon name="Hash" className="w-5 h-5 text-[#6b7a8d]" />
              <span className="text-white font-semibold">general</span>
              <div className="w-px h-6 bg-[#2a2d38] mx-2 hidden sm:block"></div>
              <span className="text-[#6b7a8d] text-sm hidden sm:block">{t.channelDesc}</span>
              <div className="ml-auto flex items-center gap-2 sm:gap-4">
                <Icon name="Bell" className="w-4 h-4 sm:w-5 sm:h-5 text-[#8b9ab0] cursor-pointer hover:text-[#c8d0dc]" />
                <Icon name="Users" className="w-4 h-4 sm:w-5 sm:h-5 text-[#8b9ab0] cursor-pointer hover:text-[#c8d0dc]" />
                <Icon name="Search" className="w-4 h-4 sm:w-5 sm:h-5 text-[#8b9ab0] cursor-pointer hover:text-[#c8d0dc]" />
              </div>
            </div>

            <div className="flex-1 p-2 sm:p-4 space-y-4 sm:space-y-6 overflow-y-auto">
              {/* Приветствие */}
              <div className="flex gap-2 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#2d6a4f] rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon name="Globe" className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-white font-semibold text-sm sm:text-base">WW3</span>
                    <span className="text-[#6b7a8d] text-xs">09:00</span>
                  </div>
                  <div className="mt-1 bg-[#2d6a4f]/20 border border-[#2d6a4f]/40 rounded-lg p-3 sm:p-4 max-w-2xl">
                    <p className="text-[#c8d0dc] text-sm sm:text-base leading-relaxed">👋 {t.welcomeMsg}</p>
                  </div>
                </div>
              </div>

              {/* Сообщения участников */}
              {[
                { flag: "🇩🇪", bg: "bg-[#1a3a5c]", name: "Klaus Weber", color: "text-[#60a5fa]", role: "Bundestag · Germany", time: "10:14", msg: "Именно такой платформы не хватало. Прямой диалог без посредников 🤝" },
                { flag: "🇧🇷", bg: "bg-[#5c1a3a]", name: "Maria Costa", color: "text-[#f97316]", role: "Senate · Brazil", time: "10:31", msg: "Global challenges require global communication. I support this initiative 🌿" },
                { flag: "🇯🇵", bg: "bg-[#3a1a5c]", name: "Hiroshi Tanaka", color: "text-[#a78bfa]", role: "Parliament · Japan", time: "11:02", msg: "Verification of participants is the key advantage here." },
              ].map((m) => (
                <div key={m.name} className="flex gap-2 sm:gap-4">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 ${m.bg} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <span className="text-white text-xs sm:text-sm font-medium">{m.flag}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className={`${m.color} font-semibold text-sm sm:text-base`}>{m.name}</span>
                      <span className="text-[#6b7a8d] text-xs">{m.role}</span>
                      <span className="text-[#6b7a8d] text-xs">{m.time}</span>
                    </div>
                    <p className="text-[#c8d0dc] mt-1 text-sm sm:text-base leading-relaxed">{m.msg}</p>
                  </div>
                </div>
              ))}

              {/* Hero CTA */}
              <div className="my-6 sm:my-8 text-center px-4 py-8 sm:py-16 bg-[#16181f] rounded-xl border border-[#2a2d38]">
                <div className="w-16 h-16 bg-[#2d6a4f] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Icon name="Globe" className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl sm:text-4xl font-bold mb-4 text-white leading-tight">{t.heroTitle}</h2>
                <p className="text-[#8b9ab0] text-base sm:text-lg mb-8 max-w-xl mx-auto leading-relaxed">{t.heroDesc}</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={() => setShowForm(true)} className="bg-[#2d6a4f] hover:bg-[#1b4332] text-white px-8 py-3 rounded-lg text-base font-semibold">
                    <Icon name="UserPlus" className="w-4 h-4 mr-2" />{t.applyBtn}
                  </Button>
                  <Button variant="outline" className="border-[#2a2d38] text-[#c8d0dc] hover:bg-[#2a2d38] hover:text-white px-8 py-3 rounded-lg text-base">
                    <Icon name="PlayCircle" className="w-4 h-4 mr-2" />{t.demoBtn}
                  </Button>
                </div>
              </div>

              {/* Возможности */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-2">
                {[
                  { icon: "ShieldCheck", title: t.f1title, desc: t.f1desc, color: "text-[#60a5fa]", bg: "bg-[#1a3a5c]/30" },
                  { icon: "Languages", title: t.f2title, desc: t.f2desc, color: "text-[#34d399]", bg: "bg-[#064e3b]/30" },
                  { icon: "Lock", title: t.f3title, desc: t.f3desc, color: "text-[#f59e0b]", bg: "bg-[#451a03]/30" },
                  { icon: "BarChart3", title: t.f4title, desc: t.f4desc, color: "text-[#a78bfa]", bg: "bg-[#2d1a5c]/30" },
                ].map((f) => (
                  <div key={f.title} className={`${f.bg} border border-[#2a2d38] rounded-xl p-5`}>
                    <div className={`${f.color} mb-3`}><Icon name={f.icon} className="w-6 h-6" /></div>
                    <h3 className="text-white font-semibold mb-2">{f.title}</h3>
                    <p className="text-[#8b9ab0] text-sm leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>

              {/* Активность */}
              <div className="bg-[#12141a] border border-[#2a2d38] rounded-xl p-4 sm:p-6 mx-2">
                <div className="flex items-center gap-2 mb-4">
                  <Icon name="Activity" className="w-4 h-4 text-[#2d6a4f]" />
                  <span className="text-[#6b7a8d] text-xs font-semibold uppercase tracking-wide">{t.activity}</span>
                </div>
                <div className="flex items-center gap-4 p-4 bg-[#1e2028] rounded-lg border border-[#2a2d38]">
                  <div className="w-14 h-14 bg-[#2d6a4f] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon name="Globe" className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-semibold text-sm">WW3</div>
                    <div className="text-[#8b9ab0] text-xs mt-0.5">🌐 Climate Agreement 2026</div>
                    <div className="text-[#8b9ab0] text-xs">📍 International Security Forum</div>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-2 h-2 bg-[#34d399] rounded-full animate-pulse"></div>
                      <span className="text-[#34d399] text-xs font-medium">{t.active}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <Button size="sm" className="bg-[#2d6a4f] hover:bg-[#1b4332] text-white text-xs px-3 h-7">{t.write}</Button>
                    <Button size="sm" variant="outline" className="border-[#2a2d38] text-[#8b9ab0] hover:text-white text-xs px-3 h-7">{t.profile}</Button>
                  </div>
                </div>
              </div>

              {/* Статистика */}
              <div className="grid grid-cols-3 gap-4 mx-2">
                {[
                  { value: "80+", label: t.countries, icon: "Globe" },
                  { value: "2 400", label: t.politicians, icon: "Users" },
                  { value: "50+", label: t.forums, icon: "MessageSquare" },
                ].map((s) => (
                  <div key={s.label} className="bg-[#16181f] border border-[#2a2d38] rounded-xl p-4 text-center">
                    <Icon name={s.icon} className="w-5 h-5 text-[#2d6a4f] mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{s.value}</div>
                    <div className="text-[#6b7a8d] text-xs mt-1">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Финальный CTA */}
              <div className="text-center py-10 sm:py-16 px-4">
                <h3 className="text-xl sm:text-3xl font-bold text-white mb-4">{t.ctaTitle}</h3>
                <p className="text-[#8b9ab0] mb-8 max-w-md mx-auto">{t.ctaDesc}</p>
                <Button onClick={() => setShowForm(true)} className="bg-[#2d6a4f] hover:bg-[#1b4332] text-white px-10 py-3 rounded-lg text-base font-semibold">
                  <Icon name="UserPlus" className="w-4 h-4 mr-2" />{t.applyBtn}
                </Button>
              </div>
            </div>
          </div>

          {/* Участники */}
          <div className="hidden xl:flex w-60 bg-[#16181f] flex-col p-4 border-l border-[#0d0e12]">
            <h3 className="text-[#6b7a8d] text-xs font-semibold uppercase tracking-wide mb-3">{t.online}</h3>
            <div className="space-y-1">
              {[
                { name: "Klaus Weber", country: "🇩🇪 Germany", color: "bg-[#60a5fa]" },
                { name: "Maria Costa", country: "🇧🇷 Brazil", color: "bg-[#f97316]" },
                { name: "Hiroshi Tanaka", country: "🇯🇵 Japan", color: "bg-[#a78bfa]" },
                { name: "Amara Diallo", country: "🇸🇳 Senegal", color: "bg-[#34d399]" },
                { name: "Elena Morozova", country: "🇧🇬 Bulgaria", color: "bg-[#f472b6]" },
                { name: "James Okafor", country: "🇳🇬 Nigeria", color: "bg-[#fbbf24]" },
              ].map((m) => (
                <div key={m.name} className="flex items-center gap-3 p-2 rounded hover:bg-[#22252f] cursor-pointer group">
                  <div className="relative">
                    <div className={`w-8 h-8 ${m.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                      <Icon name="User" className="w-4 h-4 text-white" />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#34d399] rounded-full border-2 border-[#16181f]"></div>
                  </div>
                  <div className="min-w-0">
                    <div className="text-[#c8d0dc] text-sm font-medium truncate group-hover:text-white">{m.name}</div>
                    <div className="text-[#6b7a8d] text-xs truncate">{m.country}</div>
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