
import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { Theme } from '../types';

interface RamadanBackgroundProps {
  theme: Theme;
}

const RamadanBackground: React.FC<RamadanBackgroundProps> = ({ theme }) => {
  const isDark = theme === Theme.DARK;
  const { scrollY } = useScroll();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Lanterns Component
  const Lantern = ({ size, x, y, delay, duration, swing }: any) => {
    const parallaxX = useTransform(mouseX, [0, 1], [-20 * size, 20 * size]);
    const parallaxY = useTransform(mouseY, [0, 1], [-20 * size, 20 * size]);

    return (
      <motion.div
        style={{
          left: x,
          top: y,
          x: parallaxX,
          y: parallaxY,
          position: 'absolute'
        }}
        animate={{
          y: [0, -10, 0],
          rotate: swing ? [-2, 2, -2] : 0,
        }}
        transition={{
          y: {
            duration: duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: delay
          },
          rotate: {
            duration: duration * 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: delay
          }
        }}
        className="z-0 pointer-events-none opacity-80"
      >
        <svg
          width={size * 40}
          height={size * 60}
          viewBox="0 0 100 150"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={isDark ? "drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" : "drop-shadow-[0_0_10px_rgba(5,150,105,0.3)]"}
        >
          {/* Lantern Top Ring */}
          <path d="M45 5H55V15H45V5Z" fill={isDark ? "#fbbf24" : "#059669"} />
          {/* Lantern Cap */}
          <path d="M20 30L50 15L80 30" stroke={isDark ? "#fbbf24" : "#059669"} strokeWidth="2" fill="none"/>
          <path d="M20 30Q50 5 80 30Z" fill={isDark ? "#fbbf24" : "#059669"} opacity="0.8"/>

          {/* Lantern Body */}
          <path d="M20 30L25 90L50 105L75 90L80 30" fill={isDark ? "rgba(251, 191, 36, 0.2)" : "rgba(5, 150, 105, 0.1)"} stroke={isDark ? "#fbbf24" : "#059669"} strokeWidth="2"/>

          {/* Inner details (Pattern) */}
          <path d="M35 40L65 40L60 80L40 80L35 40Z" fill={isDark ? "rgba(251, 191, 36, 0.4)" : "rgba(5, 150, 105, 0.2)"} />

          {/* Light Glow Center */}
          <circle cx="50" cy="60" r="10" fill={isDark ? "#fbbf24" : "#fbbf24"} fillOpacity="0.6" filter="url(#glow)">
             <animate attributeName="opacity" values="0.4;0.8;0.4" dur="3s" repeatCount="indefinite" />
          </circle>

          {/* Bottom tassel */}
          <line x1="50" y1="105" x2="50" y2="135" stroke={isDark ? "#fbbf24" : "#059669"} strokeWidth="2" />
          <circle cx="50" cy="140" r="3" fill={isDark ? "#fbbf24" : "#059669"} />

          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
        </svg>
      </motion.div>
    );
  };

  // Stars
  const Star = ({ x, y, size, duration, delay }: any) => (
    <motion.div
      style={{ left: x, top: y }}
      animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
      transition={{ duration: duration, repeat: Infinity, delay: delay, ease: "easeInOut" }}
      className={`absolute rounded-full ${isDark ? 'bg-white' : 'bg-emerald-600'}`}
      initial={{ width: size, height: size }}
    />
  );

  return (
    <div ref={containerRef} className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Background Gradient */}
      <div className={`absolute inset-0 transition-colors duration-1000 ${
        isDark ? 'bg-gradient-to-b from-[#0f172a] via-[#022c22] to-[#0f172a]' : 'bg-gradient-to-b from-emerald-50 via-white to-emerald-50'
      }`} />

      {/* Moon - Parallax */}
      <motion.div
        style={{
           x: useTransform(mouseX, [0, 1], [20, -20]),
           y: useTransform(mouseY, [0, 1], [20, -20]),
        }}
        className="absolute top-10 right-10 sm:right-20 opacity-20 sm:opacity-40"
      >
        <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 20C130 20 160 40 180 80C140 80 110 50 110 10C110 10 100 10 100 20Z"
            fill={isDark ? "#fbbf24" : "#059669"}
            className="drop-shadow-[0_0_30px_rgba(251,191,36,0.3)]"
          />
        </svg>
      </motion.div>

      {/* Floating Lanterns */}
      <Lantern size={1.5} x="10%" y="-5%" delay={0} duration={4} swing />
      <Lantern size={1.0} x="85%" y="10%" delay={1} duration={5} swing />
      <Lantern size={0.8} x="20%" y="15%" delay={2} duration={6} swing />
      <Lantern size={1.2} x="70%" y="-2%" delay={0.5} duration={4.5} swing />

      {/* Random Stars */}
      {[...Array(30)].map((_, i) => (
        <Star
          key={i}
          x={`${Math.random() * 100}%`}
          y={`${Math.random() * 100}%`}
          size={Math.random() * 3 + 1}
          duration={Math.random() * 3 + 2}
          delay={Math.random() * 2}
        />
      ))}

      {/* Decorative Islamic Pattern Overlay (Subtle) */}
      <div className={`absolute inset-0 opacity-[0.03] ${isDark ? 'bg-[url("https://www.transparenttextures.com/patterns/arabesque.png")] invert' : 'bg-[url("https://www.transparenttextures.com/patterns/arabesque.png")]'}`} />
    </div>
  );
};

export default RamadanBackground;
