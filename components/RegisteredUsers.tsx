
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Users, Sparkles, Loader2 } from 'lucide-react';
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

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchRegisteredUsers();
        if (data && data.length > 0) {
            setUsers(data);
        }
      } catch (err) {
        console.error("Failed to load users", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();

    // Poll every 30 seconds for real-time updates
    const interval = setInterval(loadUsers, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading && users.length === 0) return null;
  if (users.length === 0) return null;

  // Duplicate list enough times to fill width + ensure seamless loop
  // If few users, duplicate more.
  const minItems = 10;
  const multiplier = Math.ceil(minItems / users.length) + 2;
  const displayUsers = Array(multiplier).fill(users).flat();

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
        <div className={`absolute left-0 top-0 bottom-0 w-16 sm:w-32 z-20 bg-gradient-to-r ${isDark ? 'from-[#022c22] to-transparent' : 'from-emerald-50 to-transparent'}`} />
        <div className={`absolute right-0 top-0 bottom-0 w-16 sm:w-32 z-20 bg-gradient-to-l ${isDark ? 'from-[#022c22] to-transparent' : 'from-emerald-50 to-transparent'}`} />

        <div className="flex w-max">
            <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{
                duration: Math.max(20, displayUsers.length * 3), // Dynamic duration based on length
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
                    <div className="overflow-hidden">
                    <h4 className={`font-bold text-sm sm:text-base truncate ${isDark ? 'text-yellow-50' : 'text-emerald-900'}`}>{user.name}</h4>
                    <p className={`text-xs font-mono opacity-60 mt-0.5 ${isDark ? 'text-emerald-200' : 'text-emerald-800'}`}>{user.studentId}</p>
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
