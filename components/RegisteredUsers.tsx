
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Users, Loader2, AlertCircle, X, Quote } from 'lucide-react';
import { fetchRegisteredUsers, RegisteredUser } from '../services/googleSheet';
import { Theme } from '../types';

interface RegisteredUsersProps {
  theme: Theme;
}

const SECTION_QUOTES = [
  {
    ar: "طَعَامُ الِاثْنَيْنِ كَافِي الثَّلاَثَةِ، وَطَعَامُ الثَّلاَثَةِ كَافِي الأَرْبَعَةِ",
    en: "The food for two is sufficient for three, and the food for three is sufficient for four.",
    bn: "দুইজনের খাবার তিনজনের জন্য যথেষ্ট, আর তিনজনের খাবার চারজনের জন্য যথেষ্ট।"
  },
  {
    ar: "اجْتَمِعُوا عَلَى طَعَامِكُمْ وَاذْكُرُوا اسْمَ اللَّهِ عَلَيْهِ يُبَارَكْ لَكُمْ فِيهِ",
    en: "Gather together over your food and mention the name of Allah over it; you will be blessed in it.",
    bn: "তোমরা একত্রিত হয়ে আহার করো এবং আল্লাহর নাম নাও, তাতে বরকত হবে।"
  }
];

const RegisteredUsers: React.FC<RegisteredUsersProps> = ({ theme }) => {
  const [users, setUsers] = useState<RegisteredUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isDark = theme === Theme.DARK;

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(false);
      const data = await fetchRegisteredUsers();
      if (data) {
          setUsers(data);
      }
    } catch (err) {
      console.error("Failed to load users", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
    const interval = setInterval(loadUsers, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isModalOpen]);

  const INITIAL_DISPLAY_COUNT = 8;
  const displayUsers = users.slice(0, INITIAL_DISPLAY_COUNT);
  const hasMore = users.length > INITIAL_DISPLAY_COUNT;

  const [quote] = useState(SECTION_QUOTES[Math.floor(Math.random() * SECTION_QUOTES.length)]);

  const UserCard = ({ user }: { user: RegisteredUser }) => (
    <div
      className={`relative p-5 rounded-2xl border backdrop-blur-md transition-all hover:scale-[1.02] duration-300 group ${
        isDark
        ? 'bg-white/5 border-white/5 hover:border-yellow-500/30 hover:bg-white/10'
        : 'bg-white border-[#C6A87C]/20 hover:border-[#C6A87C]/50 shadow-sm hover:shadow-md'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-colors ${isDark ? 'bg-yellow-500/10 text-yellow-400 group-hover:bg-yellow-500/20' : 'bg-[#1A4D2E]/5 text-[#1A4D2E] group-hover:bg-[#1A4D2E]/10'}`}>
            <User size={20} />
        </div>
        <div className="overflow-hidden flex-1 min-w-0">
          <h4 className={`font-bold text-base truncate ${isDark ? 'text-yellow-50' : 'text-[#0F392B]'}`}>{user.name}</h4>
          <p className={`text-xs font-mono opacity-60 mt-0.5 truncate ${isDark ? 'text-emerald-200' : 'text-[#0F392B]'}`}>{user.studentId}</p>
          <div className="flex flex-wrap gap-2 mt-3">
              <span className={`text-[10px] px-2 py-0.5 rounded border ${isDark ? 'border-white/10 bg-white/5 text-emerald-100/70' : 'border-[#C6A87C]/20 bg-[#C6A87C]/5 text-[#0F392B]/70'}`}>
                  Batch {user.batch || '231'}
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded border ${isDark ? 'border-white/10 bg-white/5 text-emerald-100/70' : 'border-[#C6A87C]/20 bg-[#C6A87C]/5 text-[#0F392B]/70'}`}>
                  {user.dept || 'CSE'}
              </span>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading && users.length === 0) {
    return (
      <section className={`py-12 sm:py-20 border-y relative overflow-hidden ${isDark ? 'bg-emerald-950/30 border-white/5' : 'bg-[#C6A87C]/5 border-[#C6A87C]/20'}`}>
        <div className="flex justify-center items-center h-32">
          <Loader2 className={`animate-spin ${isDark ? 'text-yellow-500' : 'text-[#1A4D2E]'}`} size={32} />
        </div>
      </section>
    );
  }

  if (error && users.length === 0) {
    return (
      <section className={`py-12 sm:py-20 border-y relative overflow-hidden ${isDark ? 'bg-emerald-950/30 border-white/5' : 'bg-[#C6A87C]/5 border-[#C6A87C]/20'}`}>
         <div className="flex flex-col justify-center items-center h-32 gap-3 text-center px-4">
          <AlertCircle className={`w-8 h-8 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
          <p className={`text-sm ${isDark ? 'text-red-200' : 'text-red-800'}`}>Unable to load registered users.</p>
          <button onClick={loadUsers} className={`text-xs px-3 py-1 rounded border ${isDark ? 'border-white/10 hover:bg-white/10' : 'border-[#C6A87C]/30 hover:bg-[#C6A87C]/10 text-[#0F392B]'}`}>Retry</button>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className={`py-16 sm:py-24 border-y relative overflow-hidden ${isDark ? 'bg-emerald-950/30 border-white/5' : 'bg-[#C6A87C]/5 border-[#C6A87C]/20'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Header */}
          <div className="text-center mb-12">
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-6 backdrop-blur-md ${isDark ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' : 'bg-[#1A4D2E]/5 text-[#1A4D2E] border-[#1A4D2E]/20'}`}>
              <Users size={14} />
              <span className="text-xs font-bold uppercase tracking-widest">Joined: {users.length}</span>
            </div>
            <h3 className={`text-3xl sm:text-4xl md:text-5xl font-cinzel font-bold mb-6 ${isDark ? 'text-yellow-100' : 'text-[#0F392B]'}`}>
              Who's Joining the Table
            </h3>

            {/* Special Quote Section */}
            <div className={`max-w-3xl mx-auto p-6 rounded-2xl border relative mt-8 ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-[#C6A87C]/20 shadow-sm'}`}>
               <Quote className={`absolute -top-3 -left-3 w-8 h-8 ${isDark ? 'text-yellow-500' : 'text-[#1A4D2E]'} bg-transparent`} fill="currentColor" />
               <p className={`font-serif text-lg sm:text-xl mb-2 ${isDark ? 'text-yellow-100' : 'text-[#0F392B]'}`}>{quote.ar}</p>
               <p className={`text-sm sm:text-base italic mb-1 ${isDark ? 'text-emerald-200/70' : 'text-[#0F392B]/70'}`}>{quote.en}</p>
               <p className={`text-sm sm:text-base font-bengali opacity-60 ${isDark ? 'text-emerald-200' : 'text-[#0F392B]'}`}>{quote.bn}</p>
            </div>
          </div>

          {/* Static Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {displayUsers.map((user, idx) => (
              <UserCard key={`${user.studentId}-${idx}`} user={user} />
            ))}
          </div>

          {/* See All Button */}
          {hasMore && (
            <div className="mt-12 flex justify-center">
              <button
                onClick={() => setIsModalOpen(true)}
                className={`group relative px-8 py-3 rounded-full font-cinzel font-bold tracking-wider transition-all hover:scale-105 active:scale-95 ${
                  isDark
                  ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-emerald-950 shadow-lg shadow-yellow-500/20'
                  : 'bg-[#1A4D2E] text-[#F9F7F2] shadow-lg shadow-[#1A4D2E]/20 hover:bg-[#143d24]'
                }`}
              >
                Ramadan Style
                <span className="absolute inset-0 rounded-full bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-500" />
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && users.length === 0 && (
             <div className="text-center py-12">
                <p className={`opacity-60 ${isDark ? 'text-emerald-100' : 'text-[#0F392B]'}`}>
                    Be the first to register!
                </p>
             </div>
          )}
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          >
            {/* Backdrop */}
            <div
              className={`absolute inset-0 backdrop-blur-xl ${isDark ? 'bg-emerald-950/90' : 'bg-[#F9F7F2]/90'}`}
              onClick={() => setIsModalOpen(false)}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className={`relative z-10 w-full max-w-6xl h-full max-h-[85vh] flex flex-col rounded-[2.5rem] shadow-2xl overflow-hidden border ${
                isDark ? 'bg-[#0a2f26] border-white/10' : 'bg-white border-[#C6A87C]/20'
              }`}
            >
              {/* Modal Header */}
              <div className={`shrink-0 p-6 sm:p-8 border-b flex justify-between items-center ${isDark ? 'border-white/10' : 'border-[#C6A87C]/20'}`}>
                <div>
                  <h2 className={`text-2xl sm:text-3xl font-cinzel font-bold ${isDark ? 'text-yellow-100' : 'text-[#0F392B]'}`}>All Guests</h2>
                  <p className={`text-sm opacity-60 ${isDark ? 'text-emerald-200' : 'text-[#0F392B]'}`}>Batch 231 Iftar Gathering</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-white/10 text-emerald-200' : 'hover:bg-[#1A4D2E]/5 text-[#1A4D2E]'}`}
                >
                  <X size={24} />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {users.map((user, idx) => (
                    <UserCard key={`modal-${user.studentId}-${idx}`} user={user} />
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className={`shrink-0 p-4 border-t text-center text-xs uppercase tracking-widest opacity-40 ${isDark ? 'border-white/10 text-emerald-100' : 'border-[#C6A87C]/20 text-[#0F392B]'}`}>
                Total Joined: {users.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default RegisteredUsers;
