
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Users, Loader2, AlertCircle } from 'lucide-react';
import { fetchRegisteredUsers, RegisteredUser } from '../services/googleSheet';
import { Theme } from '../types';

interface RegisteredUsersProps {
  theme: Theme;
}

const RegisteredUsers: React.FC<RegisteredUsersProps> = ({ theme }) => {
  const [users, setUsers] = useState<RegisteredUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
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

    // Poll every 30 seconds for real-time updates
    const interval = setInterval(loadUsers, 30000);
    return () => clearInterval(interval);
  }, []);

  // Duplicate list enough times to fill width + ensure seamless loop
  // If few users, duplicate more.
  const minItems = 10;
  const multiplier = users.length > 0 ? Math.ceil(minItems / users.length) + 2 : 1;
  const displayUsers = users.length > 0 ? Array(multiplier).fill(users).flat() : [];

  if (loading && users.length === 0) {
    return (
      <section className={`py-12 sm:py-20 border-y relative overflow-hidden ${isDark ? 'bg-emerald-950/30 border-white/5' : 'bg-emerald-50/50 border-emerald-100'}`}>
        <div className="flex justify-center items-center h-32">
          <Loader2 className={`animate-spin ${isDark ? 'text-yellow-500' : 'text-emerald-600'}`} size={32} />
        </div>
      </section>
    );
  }

  if (error && users.length === 0) {
    return (
      <section className={`py-12 sm:py-20 border-y relative overflow-hidden ${isDark ? 'bg-emerald-950/30 border-white/5' : 'bg-emerald-50/50 border-emerald-100'}`}>
         <div className="flex flex-col justify-center items-center h-32 gap-3 text-center px-4">
          <AlertCircle className={`w-8 h-8 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
          <p className={`text-sm ${isDark ? 'text-red-200' : 'text-red-800'}`}>Unable to load registered users.</p>
          <button
            onClick={loadUsers}
            className={`text-xs px-3 py-1 rounded border ${isDark ? 'border-white/10 hover:bg-white/10' : 'border-emerald-200 hover:bg-emerald-100'}`}
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  if (!loading && !error && users.length === 0) {
     return (
      <section className={`py-12 sm:py-20 border-y relative overflow-hidden ${isDark ? 'bg-emerald-950/30 border-white/5' : 'bg-emerald-50/50 border-emerald-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-8 text-center relative z-10">
            <h3 className={`text-2xl sm:text-3xl font-cinzel font-bold mb-4 ${isDark ? 'text-yellow-100' : 'text-emerald-900'}`}>
              Who's Joining the Table
            </h3>
            <p className={`opacity-60 ${isDark ? 'text-emerald-100' : 'text-emerald-900'}`}>
                Be the first to register!
            </p>
        </div>
      </section>
     );
  }

  return (
    <section className={`py-12 sm:py-20 border-y relative overflow-hidden ${isDark ? 'bg-emerald-950/30 border-white/5' : 'bg-emerald-50/50 border-emerald-100'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-8 text-center relative z-10">
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-4 backdrop-blur-md ${isDark ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' : 'bg-emerald-100 text-emerald-800 border-emerald-200'}`}>
           <Users size={14} />
           <span className="text-xs font-bold uppercase tracking-widest">Joined: {users.length}</span>
        </div>
        <h3 className={`text-2xl sm:text-3xl md:text-4xl font-cinzel font-bold ${isDark ? 'text-yellow-100' : 'text-emerald-900'}`}>
          Who's Joining the Table
        </h3>
      </div>

      <div className="relative w-full overflow-hidden py-4">
        {/* Gradient Masks for fade effect on edges */}
        <div className={`absolute left-0 top-0 bottom-0 w-8 sm:w-16 md:w-32 z-20 bg-gradient-to-r pointer-events-none ${isDark ? 'from-[#022c22] to-transparent' : 'from-emerald-50 to-transparent'}`} />
        <div className={`absolute right-0 top-0 bottom-0 w-8 sm:w-16 md:w-32 z-20 bg-gradient-to-l pointer-events-none ${isDark ? 'from-[#022c22] to-transparent' : 'from-emerald-50 to-transparent'}`} />

        <div className="flex w-max">
            <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{
                duration: Math.max(20, displayUsers.length * 2.5), // slightly faster on mobile feels better? Or slower. Adjusted multiplier.
                ease: "linear",
                repeat: Infinity
            }}
            className="flex gap-4 sm:gap-6 px-4"
            >
            {/* Render double the content to allow for seamless -50% translation loop */}
            {[...displayUsers, ...displayUsers].map((user, idx) => (
                <div
                key={`${user.studentId}-${idx}`}
                className={`w-64 sm:w-72 flex-shrink-0 p-5 rounded-2xl border backdrop-blur-md transition-all hover:scale-[1.02] ${
                    isDark
                    ? 'bg-white/5 border-white/5 hover:border-yellow-500/30 hover:bg-white/10'
                    : 'bg-white/60 border-emerald-100 hover:border-emerald-300 shadow-sm'
                }`}
                >
                <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isDark ? 'bg-yellow-500/20 text-yellow-400' : 'bg-emerald-100 text-emerald-600'}`}>
                        <User size={18} />
                    </div>
                    <div className="overflow-hidden flex-1">
                    <h4 className={`font-bold text-sm sm:text-base truncate ${isDark ? 'text-yellow-50' : 'text-emerald-900'}`}>{user.name}</h4>
                    <p className={`text-xs font-mono opacity-60 mt-0.5 truncate ${isDark ? 'text-emerald-200' : 'text-emerald-800'}`}>{user.studentId}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded border ${isDark ? 'border-white/10 bg-white/5 text-emerald-100/70' : 'border-emerald-200 bg-emerald-50 text-emerald-800/70'}`}>
                            Batch {user.batch || '231'}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded border ${isDark ? 'border-white/10 bg-white/5 text-emerald-100/70' : 'border-emerald-200 bg-emerald-50 text-emerald-800/70'}`}>
                            {user.dept || 'CSE'}
                        </span>
                    </div>
                    </div>
                </div>
                </div>
            ))}
            </motion.div>
        </div>
      </div>
    </section>
  );
};

export default RegisteredUsers;
