
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Moon, Star } from 'lucide-react';
import { EVENT_CONFIG, TRANSLATIONS } from '../constants';
import { Language } from '../types';

interface CountdownProps {
  lang: Language;
}

const Countdown: React.FC<CountdownProps> = ({ lang }) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false });

  useEffect(() => {
    const targetDate = new Date(`${EVENT_CONFIG.date} 18:15:00`).getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
        isExpired: false
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const t = TRANSLATIONS[lang];

  if (timeLeft.isExpired) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center p-4 sm:p-6 text-center space-y-4"
      >
        <div className="relative">
          <Moon size={32} className="text-yellow-400 animate-pulse sm:w-12 sm:h-12" fill="currentColor" />
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-3 sm:-inset-4 border-2 border-dashed border-yellow-500/30 rounded-full"
          />
        </div>
        <div>
          <h3 className="text-xl sm:text-2xl font-cinzel font-bold text-yellow-400">
            {lang === 'en' ? "Alhamdulillah! The Party is Live" : "আলহামদুলিল্লাহ! পার্টি শুরু হয়েছে"}
          </h3>
        </div>
      </motion.div>
    );
  }

  const units = [
    { value: timeLeft.days, label: t.days },
    { value: timeLeft.hours, label: t.hours },
    { value: timeLeft.minutes, label: t.minutes },
    { value: timeLeft.seconds, label: t.seconds }
  ];

  return (
    <div className="relative group max-w-full overflow-visible">
      {/* Decorative Islamic Background Pattern */}
      <div className="absolute inset-0 -m-2 sm:-m-4 opacity-5 pointer-events-none">
        <svg width="100%" height="100%" viewBox="0 0 100 100" fill="currentColor" className="text-yellow-500">
          <defs>
            <pattern id="islamic-countdown" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#islamic-countdown)" />
        </svg>
      </div>

      <div className="flex gap-2 sm:gap-4 md:gap-6 justify-center items-center relative z-10">
        {units.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="relative w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center"
            >
              <div className="absolute inset-0 rounded-xl sm:rounded-2xl border border-yellow-500/20 shadow-[0_0_10px_rgba(234,179,8,0.1)] group-hover:border-yellow-500/50 transition-colors duration-500" />
              <motion.div 
                animate={{ rotate: idx % 2 === 0 ? 360 : -360 }}
                transition={{ duration: 20 + idx * 5, repeat: Infinity, ease: "linear" }}
                className="absolute inset-1 sm:inset-2 border border-dashed border-emerald-500/20 rounded-lg sm:rounded-xl"
              />
              <div className="flex flex-col items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.span 
                    key={item.value}
                    initial={{ y: 5, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -5, opacity: 0 }}
                    className="text-xl sm:text-3xl md:text-4xl font-cinzel font-bold text-yellow-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
                  >
                    {item.value.toString().padStart(2, '0')}
                  </motion.span>
                </AnimatePresence>
              </div>
              {idx === 3 && (
                <motion.div 
                  animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="absolute -top-1 -right-1 text-yellow-500 hidden sm:block"
                >
                  <Sparkles size={14} />
                </motion.div>
              )}
            </motion.div>
            <span className="mt-2 text-[8px] sm:text-[10px] md:text-xs uppercase tracking-[0.1em] sm:tracking-[0.2em] text-emerald-100/50 font-bold whitespace-nowrap">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Countdown;
