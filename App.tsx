
import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  Globe, 
  Moon, 
  Sun, 
  Github, 
  Menu as MenuIcon, 
  X,
  Calendar,
  Clock,
  MapPin,
  CircleDollarSign,
  LucideIcon,
  Utensils,
  Coffee,
  Waves,
  Beef,
  Cookie,
  Flame,
  Sparkles,
  Droplets,
  Apple,
  Zap,
  ExternalLink,
  ArrowRight,
  Navigation,
  Quote,
  Check,
  Copy
} from 'lucide-react';
import { Language, Theme } from './types';
import { TRANSLATIONS, MENU_ITEMS, EVENT_CONFIG, RAMADAN_QUOTES } from './constants';
import RamadanBackground from './components/RamadanBackground';
import Countdown from './components/Countdown';
import RegistrationForm from './components/RegistrationForm';
import RegisteredUsers from './components/RegisteredUsers';
import ResponsiblePersons from './components/ResponsiblePersons';

const IconMap: Record<string, LucideIcon> = {
  Coffee, Utensils, Waves, Beef, Cookie, Flame, Droplets, Apple, Zap
};

interface GitHubUser {
  avatar_url: string;
  name: string;
  bio: string;
  html_url: string;
}

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>(Language.EN);
  const [theme, setTheme] = useState<Theme>(Theme.DARK);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [devData, setDevData] = useState<GitHubUser | null>(null);
  const [currentQuoteIdx, setCurrentQuoteIdx] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isLocationCopied, setIsLocationCopied] = useState(false);
  const { scrollY } = useScroll();

  const handleCopyLocation = () => {
    navigator.clipboard.writeText("23.829350, 90.566467");
    setIsLocationCopied(true);
    setTimeout(() => setIsLocationCopied(false), 2000);
  };

  const handleGetDirections = () => {
    window.open("https://www.google.com/maps/dir/?api=1&destination=23.829350,90.566467", "_blank");
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Disable scroll transforms on mobile for performance
  const heroY = useTransform(scrollY, [0, 500], [0, isMobile ? 0 : 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const bgTranslateY = useTransform(scrollY, [0, 1000], [0, isMobile ? 0 : -200]);

  const t = TRANSLATIONS[lang];
  const isDark = theme === Theme.DARK;

  useEffect(() => {
    document.body.style.overflow = isRegistrationOpen ? 'hidden' : 'auto';
  }, [isRegistrationOpen]);

  useEffect(() => {
    fetch('https://api.github.com/users/sudostealth')
      .then(res => res.json())
      .then(data => setDevData(data))
      .catch(err => console.error("Dev fetch failed", err));
  }, []);

  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setCurrentQuoteIdx(prev => (prev + 1) % RAMADAN_QUOTES.length);
    }, 8000);
    return () => clearInterval(quoteInterval);
  }, []);

  const toggleTheme = () => setTheme(prev => prev === Theme.DARK ? Theme.LIGHT : Theme.DARK);

  return (
    <div className={`relative min-h-[100dvh] transition-colors duration-1000 selection:bg-yellow-500/30 selection:text-yellow-200 ${
      isDark ? 'bg-emerald-950 text-white' : 'bg-[#F9F7F2] text-[#0F392B]'
    }`}>
      <RamadanBackground theme={theme} isMobile={isMobile} />

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b transition-all duration-500 py-3 sm:py-4 px-4 sm:px-8 md:px-12 flex justify-between items-center ${
        isDark ? 'bg-emerald-950/20 border-white/5' : 'bg-white/80 border-[#C6A87C]/20'
      }`}>
        <div className="flex items-center gap-2 sm:gap-3">
          <motion.div 
            whileHover={{ rotate: 15 }}
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-lg ${isDark ? 'bg-yellow-500 text-emerald-950' : 'bg-[#1A4D2E] text-[#F9F7F2]'}`}
          >
             <Moon size={16} className="sm:w-5 sm:h-5" fill="currentColor" />
          </motion.div>
          <span className={`font-cinzel text-sm sm:text-base md:text-xl font-bold tracking-tight ${isDark ? 'text-yellow-400' : 'text-[#1A4D2E]'}`}>
            231 CSE <span className="hidden xs:inline">| IFTAR</span>
          </span>
        </div>

        {/* Updated: Countdown hidden in Header for Desktop/PC view to avoid duplication. 
            Now it only shows the theme/lang toggles and the CTA. */}
        <div className="hidden lg:flex items-center gap-4 xl:gap-6">
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleTheme}
              className={`p-2.5 rounded-full transition-all hover:scale-110 active:scale-95 ${isDark ? 'hover:bg-white/10 text-yellow-400' : 'hover:bg-[#C6A87C]/10 text-[#0F392B]'}`}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
              onClick={() => setLang(lang === Language.EN ? Language.BN : Language.EN)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all text-xs xl:text-sm font-bold ${isDark ? 'text-emerald-100/70 hover:text-yellow-400 border-white/5 hover:bg-white/5' : 'text-[#0F392B]/70 hover:text-[#1A4D2E] border-[#C6A87C]/20 hover:bg-[#C6A87C]/10'}`}
            >
              <Globe size={16} />
              {lang === Language.EN ? "BN" : "EN"}
            </button>
            <div className={`h-6 w-[1px] mx-2 ${isDark ? 'bg-white/10' : 'bg-[#C6A87C]/30'}`} />
            <button 
              onClick={() => setIsRegistrationOpen(true)}
              className={`font-bold px-5 xl:px-7 py-2.5 rounded-full text-sm transition-all shadow-lg transform hover:-translate-y-0.5 hover:shadow-xl ${
                isDark ? 'bg-yellow-500 text-emerald-950 hover:bg-yellow-400 shadow-yellow-500/20' : 'bg-[#1A4D2E] text-[#F9F7F2] hover:bg-[#143d24] shadow-[#1A4D2E]/20'
              }`}
            >
              {t.register}
            </button>
          </div>
        </div>

        <div className="lg:hidden flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setLang(lang === Language.EN ? Language.BN : Language.EN)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-all text-xs font-bold ${isDark ? 'text-emerald-100/70 border-white/5 bg-white/5' : 'text-[#0F392B]/70 border-[#C6A87C]/20 bg-[#C6A87C]/10'}`}
          >
            <Globe size={14} />
            {lang === Language.EN ? "BN" : "EN"}
          </button>
          <button onClick={toggleTheme} className="p-2 transition-transform active:scale-90">{isDark ? <Sun size={20} /> : <Moon size={20} />}</button>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 transition-transform active:scale-90">
            {isMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 sm:pt-48 pb-20 px-4 sm:px-8 md:px-12 min-h-[95dvh] flex flex-col items-center justify-center text-center overflow-hidden">
        <motion.div style={{ y: heroY, opacity }} className="max-w-6xl z-10 w-full flex flex-col items-center">
          
          {/* Main Countdown - Clear prominence in Hero content */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-12 sm:mb-20 flex justify-center scale-90 sm:scale-100 lg:scale-125 xl:scale-[1.35] transition-transform"
          >
            <Countdown lang={lang} theme={theme} />
          </motion.div>

          <motion.h1 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className={`text-4xl sm:text-7xl md:text-8xl lg:text-9xl font-cinzel font-bold bg-clip-text text-transparent leading-[1.1] sm:leading-[1.1] ${
              isDark ? 'bg-gradient-to-r from-yellow-100 via-yellow-400 to-yellow-600' : 'bg-gradient-to-r from-[#0F392B] via-[#1A4D2E] to-[#0F392B]'
            } ${lang === 'bn' ? 'font-bengali' : ''}`}
          >
            {t.title}
          </motion.h1>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className={`mt-6 sm:mt-8 text-base sm:text-2xl md:text-3xl tracking-wide font-light max-w-4xl mx-auto leading-relaxed ${isDark ? 'text-emerald-100/80' : 'text-[#0F392B]/80'}`}
          >
            {t.subtitle}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, delay: 0.8 }}
            className={`mt-8 sm:mt-12 italic max-w-3xl mx-auto border-y py-6 sm:py-10 px-4 sm:px-6 font-serif text-xs sm:text-lg md:text-xl leading-loose ${isDark ? 'text-emerald-200/60 border-white/5' : 'text-[#0F392B]/60 border-[#C6A87C]/20'}`}
          >
            "{t.quote}"
          </motion.div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="mt-12 sm:mt-16 flex flex-col sm:flex-row gap-5 sm:gap-8 justify-center items-center w-full sm:w-auto"
          >
            <button 
              onClick={() => setIsRegistrationOpen(true)}
              className={`w-full sm:w-auto group relative font-bold px-10 sm:px-14 py-4 sm:py-5 rounded-full transition-all text-sm sm:text-xl flex items-center justify-center gap-3 overflow-hidden ${
                isDark ? 'bg-yellow-500 text-emerald-950 hover:bg-yellow-400 shadow-2xl shadow-yellow-500/30' : 'bg-[#1A4D2E] text-[#F9F7F2] hover:bg-[#143d24] shadow-2xl shadow-[#1A4D2E]/20'
              }`}
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              {t.register}
              <Sparkles size={24} className="animate-pulse" />
            </button>
            <a href="#menu" className={`transition-all flex items-center gap-3 border-b-2 pb-1 hover:gap-5 text-base sm:text-lg font-medium group ${isDark ? 'text-white/60 hover:text-white border-white/5 hover:border-white/20' : 'text-[#0F392B]/60 hover:text-[#0F392B] border-[#C6A87C]/30 hover:border-[#C6A87C]'}`}>
              {lang === 'en' ? "Explore Menu" : "মেনু দেখুন"}
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 15, 0] }} 
          transition={{ repeat: Infinity, duration: 2.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-30 cursor-pointer hidden sm:block"
        >
          <div className="w-7 h-12 border-2 border-current rounded-full flex justify-center pt-2">
            <motion.div 
               animate={{ opacity: [1, 0, 1] }}
               transition={{ duration: 1.5, repeat: Infinity }}
               className="w-1.5 h-1.5 bg-current rounded-full" 
            />
          </div>
        </motion.div>
      </section>

      {/* Registered Users Section */}
      <RegisteredUsers theme={theme} />

      {/* Rotating Ramadan Quotes Section */}
      <section className="py-20 sm:py-32 px-6 relative z-10 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentQuoteIdx}
                    initial={{ opacity: 0, scale: 0.95, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 1.05, y: -30 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="space-y-8 sm:space-y-12"
                >
                    <Quote className={`mx-auto opacity-10 w-12 h-12 sm:w-20 sm:h-20 ${isDark ? 'text-yellow-400' : 'text-[#1A4D2E]'}`} />
                    <h2 className={`text-3xl sm:text-5xl md:text-6xl font-serif font-bold tracking-tight leading-tight ${isDark ? 'text-yellow-100' : 'text-[#0F392B]'}`}>
                        {RAMADAN_QUOTES[currentQuoteIdx].arabic}
                    </h2>
                    <div className="space-y-4">
                        <p className={`text-lg sm:text-2xl md:text-3xl font-cinzel italic tracking-wide ${isDark ? 'text-emerald-100/70' : 'text-[#0F392B]/70'}`}>
                            {RAMADAN_QUOTES[currentQuoteIdx].en}
                        </p>
                        <p className={`text-lg sm:text-2xl md:text-3xl font-bengali opacity-60 ${isDark ? 'text-emerald-100/50' : 'text-[#0F392B]/50'}`}>
                            {RAMADAN_QUOTES[currentQuoteIdx].bn}
                        </p>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className={`py-24 sm:py-40 px-4 sm:px-8 md:px-12 relative z-10 ${isDark ? 'bg-emerald-950/40 backdrop-blur-md' : 'bg-[#C6A87C]/5 backdrop-blur-md'}`}>
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 sm:mb-28"
          >
            <h2 className={`text-4xl sm:text-6xl md:text-7xl font-cinzel font-bold mb-6 ${isDark ? 'text-yellow-400' : 'text-[#0F392B]'}`}>{t.menu}</h2>
            <div className={`h-1.5 w-24 sm:w-40 mx-auto rounded-full ${isDark ? 'bg-gradient-to-r from-transparent via-yellow-500 to-transparent' : 'bg-gradient-to-r from-transparent via-[#1A4D2E] to-transparent'}`} />
          </motion.div>

          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 sm:gap-10">
            {MENU_ITEMS.map((item, idx) => {
              const IconComp = IconMap[item.icon] || Utensils;
              return (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  whileHover={{ y: -12, scale: 1.03 }}
                  className={`group border rounded-[2rem] sm:rounded-[2.5rem] p-8 sm:p-10 transition-all duration-700 shadow-2xl relative overflow-hidden ${
                    isDark ? 'bg-emerald-900/40 border-white/5 hover:border-yellow-500/40 hover:bg-emerald-900/60' : 'bg-white border-[#C6A87C]/20 hover:border-[#C6A87C]/60 hover:shadow-[0_0_30px_rgba(198,168,124,0.15)]'
                  }`}
                >
                  <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-5 transition-transform duration-1000 group-hover:scale-150 ${isDark ? 'bg-yellow-500' : 'bg-[#1A4D2E]'}`} />
                  
                  <div className={`w-14 h-14 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl flex items-center justify-center mb-6 sm:mb-8 transition-all duration-700 ${
                    isDark ? 'bg-yellow-500/10 group-hover:bg-yellow-500 group-hover:shadow-[0_0_30px_rgba(234,179,8,0.3)]' : 'bg-[#1A4D2E]/5 group-hover:bg-[#1A4D2E] group-hover:shadow-[0_0_30px_rgba(26,77,46,0.3)]'
                  }`}>
                    <IconComp className={`transition-all duration-700 w-7 h-7 sm:w-10 sm:h-10 ${
                      isDark ? 'text-yellow-400 group-hover:text-emerald-950' : 'text-[#1A4D2E] group-hover:text-[#F9F7F2]'
                    }`} />
                  </div>
                  <h3 className={`text-xl sm:text-2xl font-bold mb-4 tracking-tight ${isDark ? 'text-yellow-100' : 'text-[#0F392B]'}`}>{item.name[lang]}</h3>
                  <p className={`text-sm sm:text-base leading-relaxed font-light opacity-70 ${isDark ? 'text-emerald-100/60' : 'text-[#0F392B]/70'}`}>{item.description[lang]}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Details Section */}
      <section id="details" className="py-24 sm:py-40 px-4 sm:px-8 md:px-12 relative z-10 overflow-hidden">
        <motion.div 
          style={{ y: bgTranslateY }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 100, ease: "linear" }}
          className="absolute -top-48 -left-48 opacity-[0.03] pointer-events-none w-96 h-96 sm:w-[800px] sm:h-[800px]"
        >
          <svg width="100%" height="100%" viewBox="0 0 100 100" fill="currentColor">
            <path d="M50 0L55 35L90 40L60 60L70 95L50 75L30 95L40 60L10 40L45 35Z" />
          </svg>
        </motion.div>

        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 sm:gap-20 items-stretch">
            {/* Creative Info Cards */}
            <div className="flex-1 space-y-10 md:space-y-16">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="mb-12 text-center lg:text-left"
              >
                <h2 className={`text-5xl sm:text-7xl font-cinzel font-bold mb-6 ${isDark ? 'text-yellow-400' : 'text-[#0F392B]'}`}>{t.details}</h2>
                <p className={`text-lg sm:text-xl opacity-60 leading-relaxed ${!isDark && 'text-[#0F392B]'}`}>Every detail crafted for an unforgettable evening under the crescent moon.</p>
              </motion.div>

              <div className="grid grid-cols-1 xs:grid-cols-2 gap-6 sm:gap-8">
                {[
                  { icon: Calendar, label: t.date, value: EVENT_CONFIG.date, color: "from-blue-500/20 to-indigo-500/20" },
                  { icon: Clock, label: t.time, value: EVENT_CONFIG.time, color: "from-orange-500/20 to-yellow-500/20" },
                  { icon: Navigation, label: t.location, value: "Central Field", color: "from-emerald-500/20 to-teal-500/20" },
                  { icon: MapPin, label: "Campus", value: "Permanent Campus | Green University of Bangladesh | Rupganj, Narayanganj", color: "from-pink-500/20 to-rose-500/20" }
                ].map((info, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.12 }}
                    whileHover={{ y: -10, scale: 1.05 }}
                    className={`relative p-8 sm:p-10 rounded-[2.5rem] sm:rounded-[3rem] border overflow-hidden group transition-all duration-700 ${
                      isDark ? 'bg-white/5 border-white/5 hover:border-yellow-500/20' : 'bg-white border-[#C6A87C]/20 shadow-2xl hover:border-[#C6A87C]/40'
                    }`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-700 ${info.color}`} />
                    <div className="relative z-10">
                      <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl sm:rounded-[2rem] flex items-center justify-center mb-6 sm:mb-8 transition-all group-hover:scale-110 ${
                        isDark ? 'bg-white/5' : 'bg-[#1A4D2E]/5'
                      }`}>
                        <info.icon className={`${isDark ? 'text-yellow-400' : 'text-[#1A4D2E]'} w-7 h-7 sm:w-8 h-8`} />
                      </div>
                      <h4 className={`text-[10px] sm:text-xs uppercase tracking-[0.2em] font-black mb-2 opacity-40 ${!isDark && 'text-[#0F392B]'}`}>{info.label}</h4>
                      <p className={`${info.label === "Campus" ? "text-sm sm:text-base" : "text-xl sm:text-2xl"} font-bold font-cinzel leading-tight ${!isDark && 'text-[#0F392B]'}`}>{info.value}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
            </div>

            {/* Map Container */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="flex-1 min-h-[450px] sm:min-h-[650px] relative rounded-[3rem] sm:rounded-[4rem] overflow-hidden border shadow-2xl group transition-all duration-1000"
              style={{ borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(198,168,124,0.1)' }}
            >
              <div className={`absolute top-6 left-6 sm:top-10 sm:left-10 z-20 px-6 sm:px-8 py-3 sm:py-5 rounded-3xl backdrop-blur-2xl border flex items-center gap-4 ${
                isDark ? 'bg-emerald-950/70 border-white/10' : 'bg-white/80 border-[#C6A87C]/20 shadow-2xl'
              }`}>
                <div className={`p-3 sm:p-4 rounded-2xl ${isDark ? 'bg-yellow-500' : 'bg-[#1A4D2E]'}`}>
                  <Navigation className={`${isDark ? 'text-emerald-950' : 'text-[#F9F7F2]'} w-6 h-6 sm:w-8 sm:h-8`} />
                </div>
                <div>
                  <span className={`text-[10px] sm:text-xs uppercase font-black tracking-widest opacity-40 ${!isDark && 'text-[#0F392B]'}`}>{t.mapLabel}</span>
                  <p className={`text-sm sm:text-lg font-bold leading-tight ${!isDark && 'text-[#0F392B]'}`}>GUB Central Field, Purbachal</p>
                </div>
              </div>

              <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 z-20 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleCopyLocation}
                  className={`px-6 py-3 rounded-full shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2 font-bold backdrop-blur-md border ${
                    isDark
                      ? 'bg-emerald-950/80 text-white border-white/10 hover:bg-emerald-900'
                      : 'bg-white/90 text-[#0F392B] border-[#C6A87C]/20 hover:bg-white'
                  }`}
                >
                  {isLocationCopied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                  <span className="text-sm">{isLocationCopied ? t.locationCopied : t.copyLocation}</span>
                </button>
                <button
                  onClick={handleGetDirections}
                  className={`px-6 py-3 rounded-full shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2 font-bold ${
                    isDark
                      ? 'bg-yellow-500 text-emerald-950 hover:bg-yellow-400'
                      : 'bg-[#1A4D2E] text-[#F9F7F2] hover:bg-[#143d24]'
                  }`}
                >
                  <Navigation size={18} />
                  <span className="text-sm">{t.getDirections}</span>
                </button>
              </div>

              <iframe 
                title="GUB Location"
                className="w-full h-full transition-all duration-1000 group-hover:scale-110"
                src="https://maps.google.com/maps?q=23.829350,90.566467&hl=en&z=17&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                style={{ border: 0, filter: isDark ? 'grayscale(1) invert(0.9) hue-rotate(180deg) brightness(0.8)' : 'none' }}
              />
              <div className="absolute inset-0 pointer-events-none border-[12px] sm:border-[20px] border-[#0F392B]/5 group-hover:border-transparent transition-all duration-700 rounded-[3rem] sm:rounded-[4rem]" />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`mt-12 sm:mt-20 p-10 sm:p-14 rounded-[3rem] border relative overflow-hidden group shadow-2xl ${
                isDark ? 'bg-gradient-to-r from-yellow-500/10 via-yellow-500/5 to-transparent border-yellow-500/30' : 'bg-gradient-to-r from-[#1A4D2E]/10 via-[#1A4D2E]/5 to-transparent border-[#C6A87C]/30'
            }`}
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-10">
              <div className="text-center md:text-left">
                <h3 className={`text-3xl sm:text-5xl font-cinzel font-black ${isDark ? 'text-yellow-400' : 'text-[#0F392B]'}`}>{t.fee} : BDT {EVENT_CONFIG.fee}</h3>
                <p className={`text-base sm:text-lg opacity-60 mt-4 leading-relaxed ${!isDark && 'text-[#0F392B]'}`}>Inclusive of full premium buffet and exclusive Batch 231 memorabilia.</p>
              </div>
              <button
                onClick={() => setIsRegistrationOpen(true)}
                className={`w-full md:w-auto whitespace-nowrap font-black px-12 py-5 rounded-full transition-all text-lg flex items-center justify-center gap-4 group shadow-2xl hover:scale-105 active:scale-95 ${
                  isDark ? 'bg-yellow-500 text-emerald-950 hover:bg-yellow-400' : 'bg-[#1A4D2E] text-[#F9F7F2] hover:bg-[#143d24]'
                }`}
              >
                {t.payment} <Sparkles size={24} className="animate-pulse" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Responsible Persons Section */}
      <ResponsiblePersons lang={lang} theme={theme} />

      {/* Footer */}
      <footer className={`py-16 sm:py-24 px-4 sm:px-8 md:px-12 border-t relative z-10 transition-colors duration-1000 ${
        isDark ? 'bg-[#010b0a]/95 border-white/5' : 'bg-[#F9F7F2] border-[#C6A87C]/20'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col gap-12 sm:gap-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 sm:gap-20 items-start text-center sm:text-left">
            <div className="space-y-6 flex flex-col items-center sm:items-start">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-xl ${isDark ? 'bg-yellow-500 text-emerald-950' : 'bg-[#1A4D2E] text-[#F9F7F2]'}`}>
                   <Moon size={20} fill="currentColor" />
                </div>
                <span className={`font-cinzel font-black text-xl sm:text-2xl tracking-tight ${isDark ? 'text-yellow-400' : 'text-[#0F392B]'}`}>BATCH 231 CSE</span>
              </div>
              <p className={`text-sm sm:text-base font-light max-w-sm leading-relaxed opacity-60 ${isDark ? 'text-emerald-100/60' : 'text-[#0F392B]/60'}`}>
                Celebrating brotherhood and the journey of Batch 231. Department of Computer Science & Engineering, Green University of Bangladesh.
              </p>
            </div>

            <div className="flex flex-col items-center sm:items-start gap-6">
              <h4 className={`text-xs sm:text-sm uppercase tracking-[0.3em] font-black opacity-30 ${isDark ? 'text-emerald-100' : 'text-[#0F392B]'}`}>The Creator</h4>
              {devData ? (
                <motion.a 
                  href={devData.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -8, scale: 1.02 }}
                  className={`flex items-center gap-5 p-5 sm:p-6 rounded-[2rem] border transition-all w-full max-w-sm group shadow-xl ${
                    isDark ? 'bg-white/5 border-white/5 hover:border-yellow-500/30' : 'bg-white border-[#C6A87C]/20 hover:border-[#C6A87C]/50 shadow-2xl'
                  }`}
                >
                  <img src={devData.avatar_url} alt="sudostealth" className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-yellow-500/50 shadow-2xl group-hover:border-yellow-500" />
                  <div className="overflow-hidden text-left">
                    <div className="flex items-center gap-1.5">
                      <h5 className={`font-black text-base sm:text-lg ${isDark ? 'text-yellow-400' : 'text-[#1A4D2E]'}`}>{devData.name || "sudostealth"}</h5>
                      <ExternalLink size={14} className="opacity-30 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className={`text-xs sm:text-sm truncate opacity-50 ${isDark ? 'text-emerald-100' : 'text-[#0F392B]'}`}>{devData.bio || "Full-Stack Engineer"}</p>
                  </div>
                </motion.a>
              ) : (
                <div className="h-24 w-full animate-pulse bg-white/5 rounded-[2rem] max-w-xs" />
              )}
            </div>

            <div className="flex flex-col items-center md:items-end gap-6">
              <h4 className={`text-xs sm:text-sm uppercase tracking-[0.3em] font-black opacity-30 ${isDark ? 'text-emerald-100' : 'text-[#0F392B]'}`}>Connect</h4>
              <div className="flex gap-6">
                <a href="https://github.com/sudostealth" target="_blank" className={`p-4 sm:p-5 rounded-full transition-all active:scale-90 hover:scale-110 shadow-xl ${isDark ? 'bg-white/5 hover:bg-yellow-500 hover:text-emerald-950' : 'bg-[#1A4D2E]/10 hover:bg-[#1A4D2E] hover:text-[#F9F7F2]'}`}>
                  <Github size={24} />
                </a>
              </div>
            </div>
          </div>

          <div className={`pt-12 border-t flex flex-col sm:flex-row justify-between items-center gap-8 ${isDark ? 'border-white/5' : 'border-[#C6A87C]/20'}`}>
            <p className={`text-xs sm:text-sm text-center sm:text-left font-medium tracking-wide opacity-20 ${isDark ? 'text-emerald-100' : 'text-[#0F392B]'}`}>
              &copy; 2026 GUB Batch 231 Dept of CSE. Handcrafted with heart by sudostealth.
            </p>
            <div className={`text-[10px] sm:text-xs uppercase tracking-[0.4em] font-black flex items-center gap-3 transition-opacity duration-1000 ${isDark ? 'text-yellow-500/40' : 'text-[#1A4D2E]/40'}`}>
              <Sparkles size={16} /> Ramadan Kareem <Sparkles size={16} />
            </div>
          </div>
        </div>
      </footer>

      {/* Modals & Overlays */}
      <AnimatePresence>
        {isRegistrationOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          >
            <div 
              className={`absolute inset-0 backdrop-blur-3xl ${isDark ? 'bg-emerald-950/80' : 'bg-[#F9F7F2]/80'}`}
              onClick={() => setIsRegistrationOpen(false)}
            />
            <div className="relative z-10 w-full max-w-lg overflow-y-auto max-h-[95dvh] rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] hide-scrollbar">
              <button 
                onClick={() => setIsRegistrationOpen(false)}
                className={`absolute top-6 right-6 z-20 transition-all p-3 rounded-full backdrop-blur-3xl border ${isDark ? 'text-white/60 hover:text-white bg-white/5 border-white/5' : 'text-[#0F392B]/60 hover:text-[#0F392B] bg-[#1A4D2E]/5 border-[#1A4D2E]/5'}`}
              >
                <X size={24} />
              </button>
              <RegistrationForm lang={lang} theme={theme} onClose={() => setIsRegistrationOpen(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
