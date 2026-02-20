
import React from 'react';
import { motion } from 'framer-motion';
import { Phone, User, BadgeCheck, MessageCircle } from 'lucide-react';
import { Language, Theme } from '../types';
import { RESPONSIBLE_PERSONS, TRANSLATIONS } from '../constants';

interface ResponsiblePersonsProps {
  lang: Language;
  theme: Theme;
}

const ResponsiblePersons: React.FC<ResponsiblePersonsProps> = ({ lang, theme }) => {
  const isDark = theme === Theme.DARK;
  const t = TRANSLATIONS[lang];

  return (
    <section className={`py-24 sm:py-32 px-4 sm:px-8 relative z-10 overflow-hidden ${
      isDark ? 'bg-emerald-950/30' : 'bg-[#F9F7F2]'
    }`}>
      {/* Background decoration */}
      <div className={`absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none ${isDark ? 'text-yellow-500' : 'text-[#1A4D2E]'}`}>
         <svg width="100%" height="100%">
            <pattern id="pattern-circles" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1.5" fill="currentColor" />
            </pattern>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)" />
         </svg>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 sm:mb-24"
        >
          <h2 className={`text-4xl sm:text-6xl font-cinzel font-bold mb-6 ${isDark ? 'text-yellow-400' : 'text-[#0F392B]'}`}>
            {t.responsiblePersons}
          </h2>
          <div className={`h-1.5 w-24 sm:w-40 mx-auto rounded-full ${isDark ? 'bg-gradient-to-r from-transparent via-yellow-500 to-transparent' : 'bg-gradient-to-r from-transparent via-[#1A4D2E] to-transparent'}`} />
          <p className={`mt-6 text-lg sm:text-xl opacity-70 max-w-2xl mx-auto ${isDark ? 'text-emerald-100' : 'text-[#0F392B]'}`}>
            {t.contact}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {RESPONSIBLE_PERSONS.map((person, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.6 }}
              whileHover={{ y: -10 }}
              className={`group relative rounded-[2.5rem] p-8 sm:p-10 transition-all duration-500 overflow-hidden border ${
                isDark
                  ? 'bg-gradient-to-b from-emerald-900/40 to-emerald-950/60 border-white/5 hover:border-yellow-500/30'
                  : 'bg-white border-[#C6A87C]/20 shadow-xl hover:shadow-2xl hover:border-[#C6A87C]/40'
              }`}
            >
              {/* Decorative background glow */}
              <div className={`absolute top-0 inset-x-0 h-32 opacity-20 transition-opacity duration-700 group-hover:opacity-40 blur-3xl ${
                isDark ? 'bg-yellow-500' : 'bg-[#1A4D2E]'
              }`} />

              <div className="relative z-10 flex flex-col items-center text-center">
                {/* Image Container */}
                <div className="mb-8 relative">
                  <div className={`absolute inset-0 rounded-full blur-md opacity-40 group-hover:opacity-70 transition-opacity duration-500 ${
                    isDark ? 'bg-yellow-400' : 'bg-[#1A4D2E]'
                  }`} />
                  <div className={`w-32 h-32 sm:w-40 sm:h-40 rounded-full p-1.5 border-2 relative overflow-hidden ${
                    isDark ? 'border-yellow-500/50 bg-emerald-950' : 'border-[#1A4D2E]/20 bg-white'
                  }`}>
                    <img
                      src={person.image}
                      alt={person.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest shadow-lg whitespace-nowrap border ${
                    isDark
                      ? 'bg-emerald-950 text-yellow-400 border-yellow-500/30'
                      : 'bg-[#1A4D2E] text-[#F9F7F2] border-[#1A4D2E]/10'
                  }`}>
                    BATCH 231
                  </div>
                </div>

                {/* Info */}
                <h3 className={`text-2xl sm:text-3xl font-cinzel font-bold mb-2 ${isDark ? 'text-yellow-100' : 'text-[#0F392B]'}`}>
                  {person.name}
                </h3>

                <div className={`flex items-center gap-2 mb-6 text-sm font-medium tracking-wide opacity-60 ${isDark ? 'text-emerald-100' : 'text-[#0F392B]'}`}>
                  <User size={14} />
                  <span>ID: {person.id}</span>
                </div>

                <div className={`w-full py-4 mb-6 border-y border-dashed ${isDark ? 'border-white/10' : 'border-[#0F392B]/10'}`}>
                  <div className={`flex items-center justify-center gap-2 mb-1 ${isDark ? 'text-yellow-400' : 'text-[#1A4D2E]'}`}>
                    <BadgeCheck size={18} />
                    <span className="text-xs uppercase tracking-widest font-bold opacity-70">Role</span>
                  </div>
                  <p className={`font-medium ${isDark ? 'text-emerald-100/90' : 'text-[#0F392B]/90'}`}>
                    {person.role[lang]}
                  </p>
                </div>

                {/* Contact Button */}
                <a
                  href={`https://wa.me/88${person.mobile}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-4 rounded-xl flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] font-bold shadow-lg ${
                    isDark
                      ? 'bg-white/5 hover:bg-yellow-500 hover:text-emerald-950 text-white border border-white/5'
                      : 'bg-[#1A4D2E]/5 hover:bg-[#1A4D2E] hover:text-white text-[#0F392B] border border-[#1A4D2E]/10'
                  }`}
                >
                  <MessageCircle size={20} className={isDark ? 'group-hover:text-emerald-950' : 'group-hover:text-white'} />
                  <span>{person.mobile}</span>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResponsiblePersons;
