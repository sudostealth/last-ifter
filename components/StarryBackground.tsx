
import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
// Add missing Moon import from lucide-react
import { Moon } from 'lucide-react';
import { Theme } from '../types';

interface StarryBackgroundProps {
  theme: Theme;
}

const StarryBackground: React.FC<StarryBackgroundProps> = ({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const scrollYRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let stars: { x: number; y: number; size: number; speed: number; opacity: number; originalX: number; originalY: number; color: string; twinkleSpeed: number }[] = [];
    const starCount = 350; // High density for big screens

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      stars = [];
      const isDark = theme === Theme.DARK;
      for (let i = 0; i < starCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * (isDark ? 1.6 : 2.0);
        stars.push({
          x,
          y,
          originalX: x,
          originalY: y,
          size,
          speed: Math.random() * 0.05 + 0.01,
          opacity: Math.random() * 0.5 + 0.1,
          twinkleSpeed: Math.random() * 0.02 + 0.005,
          color: isDark 
            ? (Math.random() > 0.85 ? '#fef9c3' : '#eab308') 
            : (Math.random() > 0.85 ? '#86efac' : '#059669')
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        mouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const handleScroll = () => {
      scrollYRef.current = window.scrollY;
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const isDark = theme === Theme.DARK;
      
      stars.forEach(star => {
        // Scroll Parallax Logic
        const scrollOffset = scrollYRef.current * star.speed * 1.5;
        let currentY = (star.originalY - scrollOffset) % canvas.height;
        if (currentY < 0) currentY += canvas.height;

        // Interaction: Mouse Influence (Spirit Light Effect)
        const dx = mouseRef.current.x - star.x;
        const dy = mouseRef.current.y - currentY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 250;
        
        let offsetX = 0;
        let offsetY = 0;
        
        if (dist < maxDist) {
          const angle = Math.atan2(dy, dx);
          const force = (maxDist - dist) / maxDist;
          // Stars flow away from mouse slightly then return
          offsetX = Math.cos(angle + Math.PI) * force * 40;
          offsetY = Math.sin(angle + Math.PI) * force * 40;
        }

        ctx.globalAlpha = isDark ? star.opacity : star.opacity * 0.25;
        ctx.fillStyle = star.color;
        
        ctx.beginPath();
        // Rare Sparkling Star Effect
        if (Math.random() > 0.9997) {
          const s = star.size * 4;
          ctx.moveTo(star.x + offsetX, currentY + offsetY - s);
          ctx.lineTo(star.x + offsetX + s, currentY + offsetY);
          ctx.lineTo(star.x + offsetX, currentY + offsetY + s);
          ctx.lineTo(star.x + offsetX - s, currentY + offsetY);
          ctx.closePath();
        } else {
          ctx.arc(star.x + offsetX, currentY + offsetY, star.size, 0, Math.PI * 2);
        }
        ctx.fill();
        
        // Upward drift
        star.originalY -= star.speed * 0.5;
        
        // Organic Twinkling
        star.opacity += (Math.random() - 0.5) * star.twinkleSpeed;
        if (star.opacity < 0.1) star.opacity = 0.1;
        if (star.opacity > 0.8) star.opacity = 0.8;
      });

      // Cursor Light Aura
      if (mouseRef.current.x !== -1000) {
        const auraGradient = ctx.createRadialGradient(
          mouseRef.current.x, mouseRef.current.y, 0,
          mouseRef.current.x, mouseRef.current.y, 180
        );
        auraGradient.addColorStop(0, isDark ? 'rgba(234, 179, 8, 0.08)' : 'rgba(16, 185, 129, 0.05)');
        auraGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = auraGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [theme]);

  const { scrollY } = useScroll();
  const bgPatternY = useTransform(scrollY, [0, 5000], [0, -600]);

  return (
    <div className={`fixed inset-0 z-[-1] overflow-hidden pointer-events-none transition-colors duration-1000 ${
      theme === Theme.DARK 
      ? "bg-[#010c08]" 
      : "bg-[#fdfcf5]"
    }`}>
      {/* Background Gradients */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${theme === Theme.DARK ? 'opacity-100' : 'opacity-0'}`}>
         <div className="absolute inset-0 bg-gradient-to-b from-[#012a23] via-[#011410] to-[#010807]" />
      </div>
      <div className={`absolute inset-0 transition-opacity duration-1000 ${theme === Theme.DARK ? 'opacity-0' : 'opacity-100'}`}>
         <div className="absolute inset-0 bg-gradient-to-b from-[#f0fdf4] via-[#fdfcf5] to-[#f0fdf4]" />
      </div>

      <canvas ref={canvasRef} className="absolute inset-0" />
      
      {/* Scroll-Reactive Patterns */}
      <motion.div 
        style={{ y: bgPatternY }}
        className={`absolute inset-0 opacity-[0.04] pointer-events-none flex flex-col items-center justify-around ${theme === Theme.DARK ? 'invert text-emerald-50' : 'text-emerald-900'}`}
      >
          {[...Array(6)].map((_, i) => (
             <div key={i} className={`flex w-full justify-around ${i % 2 === 0 ? 'translate-x-12' : '-translate-x-12'}`}>
                <svg width="150" height="150" viewBox="0 0 100 100" className="rotate-45">
                   <path d="M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z" fill="currentColor" />
                </svg>
                <svg width="100" height="100" viewBox="0 0 100 100">
                   <rect x="25" y="25" width="50" height="50" transform="rotate(45 50 50)" stroke="currentColor" fill="none" strokeWidth="1" />
                </svg>
             </div>
          ))}
      </motion.div>

      {/* Floating Interactive Elements */}
      <motion.div 
        style={{ y: useTransform(scrollY, [0, 2000], [0, -400]) }}
        className={`absolute top-[10%] right-[10%] animate-float ${theme === Theme.DARK ? 'opacity-20' : 'opacity-5'}`}
      >
          <Moon size={120} className={theme === Theme.DARK ? 'text-yellow-400' : 'text-emerald-600'} fill="currentColor" />
      </motion.div>
    </div>
  );
};

export default StarryBackground;
