import React from 'react';
import { motion } from 'framer-motion';
import {
  Ticket,
  Footprints,
  Brain,
  Compass,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import RealFireFX from './RealFireFX';
// import { HubCard } from '../types'; // Adjust based on your types
// import SocialLinks from './SocialLinks';

interface ScreenHubProps {
  onResetIntro: () => void;
}

// Extended type for our new colorful properties
interface ColorfulHubCard {
  id: string;
  title: string;
  iconName: string;
  description: string;
  ctaText: string;
  url: string;
  // New Color Properties using standard Tailwind colors for guaranteed vibrancy
  bgGradient: string;
  borderColor: string;
  iconBg: string;
  iconText: string;
  badgeClass: string;
  ctaClass: string;
  glowShadow: string;
}

export default function ScreenHub({ onResetIntro }: ScreenHubProps) {
  const cards: ColorfulHubCard[] = [
    {
      id: 'tickets',
      title: 'BUY TICKETS',
      iconName: 'Ticket',
      description: 'Secure your spot instantly. Get your tickets NOW!',
      ctaText: 'BUY NOW',
      url: 'https://epilogue.moraspirit.com',
      bgGradient: 'from-emerald-950/60 to-black/80',
      borderColor: 'border-emerald-500/50 hover:border-emerald-400',
      iconBg: 'bg-emerald-500/20 border-emerald-500/30',
      iconText: 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]',
      badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_15px_rgba(52,211,153,0.3)]',
      ctaClass: 'text-emerald-400',
      glowShadow: 'rgba(52,211,153,0.15)',
    },
    {
      id: 'runner',
      title: 'RUNNER GAME',
      iconName: 'Footprints',
      description: 'Finish in 1st place each week to win a FREE Standard Ticket.',
      ctaText: 'PLAY & WIN',
      url: 'https://go.moraspirit.com/run-game',
      bgGradient: 'from-cyan-950/50 to-black/80',
      borderColor: 'border-cyan-500/30 hover:border-cyan-400/80',
      iconBg: 'bg-cyan-500/10 border-cyan-500/20',
      iconText: 'text-cyan-400',
      badgeClass: 'bg-cyan-950/50 text-cyan-400 border-cyan-500/30',
      ctaClass: 'text-cyan-400',
      glowShadow: 'rgba(34,211,238,0.1)',
    },
    {
      id: 'quiz',
      title: 'QUIZ CHALLENGE',
      iconName: 'Brain',
      description: 'Be the first to answer all questions correctly and win a FREE Ticket.',
      ctaText: 'START & WIN',
      url: 'https://go.moraspirit.com/quizes',
      bgGradient: 'from-violet-950/50 to-black/80',
      borderColor: 'border-violet-500/30 hover:border-violet-400/80',
      iconBg: 'bg-violet-500/10 border-violet-500/20',
      iconText: 'text-violet-400',
      badgeClass: 'bg-violet-950/50 text-violet-400 border-violet-500/30',
      ctaClass: 'text-violet-400',
      glowShadow: 'rgba(167,139,250,0.1)',
    },
    {
      id: 'treasure',
      title: 'TREASURE HUNT',
      iconName: 'Compass',
      description: 'Crack hidden coordinates to unlock a FREE Standard Ticket.',
      ctaText: 'HUNT & WIN',
      url: 'https://go.moraspirit.com/ctf',
      bgGradient: 'from-rose-950/50 to-black/80',
      borderColor: 'border-rose-500/30 hover:border-rose-400/80',
      iconBg: 'bg-rose-500/10 border-rose-500/20',
      iconText: 'text-rose-400',
      badgeClass: 'bg-rose-950/50 text-rose-400 border-rose-500/30',
      ctaClass: 'text-rose-400',
      glowShadow: 'rgba(251,113,133,0.1)',
    },
  ];

  const handleCardClick = (card: ColorfulHubCard) => {
    window.open(card.url, '_blank', 'noopener,noreferrer');
  };

  const renderIcon = (name: string, cls: string) => {
    switch (name) {
      case 'Ticket': return <Ticket className={cls} />;
      case 'Footprints': return <Footprints className={`${cls} group-hover:animate-bounce`} />;
      case 'Brain': return <Brain className={`${cls} group-hover:animate-pulse`} />;
      case 'Compass': return <Compass className={`${cls} animate-spin-slow`} style={{ animationDuration: '6s' }} />;
      default: return <Sparkles className={cls} />;
    }
  };

  // --- Framer Motion Variants ---
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20, scale: 0.95 },
    show: { 
      opacity: 1, 
      x: 0, 
      scale: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    },
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center px-4 py-6 sm:py-10 relative overflow-x-hidden overflow-y-auto select-none bg-black">

      {/* Repeating fire sweep — under cards, hub variant with 4s cycle */}
      <RealFireFX variant="hub" repeatIntervalMs={9000} />
      
      {/* --- COLORFUL AMBIENT BACKGROUND --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] -left-[10%] w-96 h-96 bg-emerald-600/20 rounded-full blur-[100px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[40%] -right-[20%] w-80 h-80 bg-violet-600/20 rounded-full blur-[100px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute -bottom-[10%] left-[20%] w-[30rem] h-[30rem] bg-cyan-600/10 rounded-full blur-[120px]" 
        />
      </div>

      {/* --- TOP HEADER --- */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-sm flex justify-between items-center mb-8 z-10 pt-4"
      >
        <div>
          <h1 className="text-3xl font-display font-black tracking-[0.12em] text-white leading-none flex items-center gap-1">
            EPILOGUE
            <span className="text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]">'26</span>
          </h1>
          <span className="text-[10px] font-mono tracking-[0.2em] text-white/50 block mt-1.5 uppercase">
            Command Center
          </span>
        </div>

        <button
          onClick={onResetIntro}
          className="px-3 py-2 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/15 hover:border-white/30 active:scale-95 transition-all text-[10px] font-mono text-white/90 tracking-widest uppercase h-fit shadow-lg"
        >
          Replay
        </button>
      </motion.div>

      {/* --- MAIN CARDS LIST (Mobile Optimized 1-Column) --- */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex w-full max-w-sm flex-col gap-5 z-10 pb-16 sm:pb-20"
      >
        {cards.map((card) => {
          const isTicketsCard = card.id === 'tickets';
          
          return (
            <motion.div
              variants={itemVariants}
              key={card.id}
              onClick={() => handleCardClick(card)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              // Gives the primary ticket card a continuous breathing glow
              animate={isTicketsCard ? { 
                boxShadow: [`0px 0px 0px ${card.glowShadow}`, `0px 0px 25px ${card.glowShadow}`, `0px 0px 0px ${card.glowShadow}`] 
              } : {}}
              transition={isTicketsCard ? { repeat: Infinity, duration: 2.5 } : {}}
              className={`cursor-pointer rounded-3xl p-5 border backdrop-blur-xl transition-all duration-300 flex items-center gap-4 relative group overflow-hidden shadow-2xl bg-gradient-to-br ${card.bgGradient} ${card.borderColor}`}
            >
              {/* Colorful Hover Flare */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-white/5 to-transparent pointer-events-none" />

              {/* Icon Container (Left Side) */}
              <div className={`w-14 h-14 rounded-2xl shrink-0 flex items-center justify-center relative z-10 shadow-inner border ${card.iconBg}`}>
                {renderIcon(card.iconName, `w-7 h-7 ${card.iconText}`)}
              </div>

              {/* Content Container (Right Side) */}
              <div className="flex-1 min-w-0 flex flex-col justify-between relative z-10">
                
                {/* Title & Badge Row */}
                <div className="flex justify-between items-start gap-2">
                  <h4 className="text-[13px] font-display font-black tracking-widest uppercase text-white truncate drop-shadow-md">
                    {card.title}
                  </h4>
                  <span className={`text-[8px] font-mono tracking-widest px-2 py-1 rounded-md uppercase font-bold shrink-0 border ${card.badgeClass}`}>
                    {isTicketsCard ? 'BUY ZONE' : 'FREE'}
                  </span>
                </div>

                {/* Description */}
                <p className="text-[12px] text-white/60 font-light leading-relaxed mt-1.5 line-clamp-2">
                  {card.description}
                </p>

                {/* CTA Row */}
                <div className="mt-3 flex justify-between items-center text-[10px] font-mono tracking-widest font-extrabold uppercase border-t border-white/10 pt-3">
                  <span className={`group-hover:tracking-[0.2em] transition-all duration-300 ${card.ctaClass}`}>
                    {card.ctaText}
                  </span>
                  <div className={`p-1 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors ${card.ctaClass}`}>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>

              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Footer — fixed over fire at viewport bottom */}
      <motion.footer
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="fixed bottom-0 inset-x-0 z-20 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-2 text-center pointer-events-none"
      >
        <p
          className="text-[10px] sm:text-xs font-display font-black tracking-[0.26em] sm:tracking-[0.28em] text-white/90 uppercase"
          style={{ textShadow: '0 0 14px rgba(0,0,0,0.95), 0 2px 10px rgba(255,100,0,0.4), 0 0 24px rgba(0,0,0,0.6)' }}
        >
          MORASPIRIT <span className="text-emerald-400">2026</span>
        </p>
      </motion.footer>

    </div>
  );
}