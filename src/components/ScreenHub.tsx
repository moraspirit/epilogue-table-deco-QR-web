import React from 'react';
import { motion } from 'motion/react';
import { 
  Ticket, 
  Footprints, 
  Brain, 
  Compass, 
  Sparkles, 
  ChevronRight, 
} from 'lucide-react';
import { HubCard } from '../types';

interface ScreenHubProps {
  onResetIntro: () => void;
}

export default function ScreenHub({ onResetIntro }: ScreenHubProps) {
  const cards: HubCard[] = [
    {
      id: 'tickets',
      title: 'BUY PASSES',
      iconName: 'Ticket',
      description: 'Guarantee your entry instantly. Access premium zones.',
      ctaText: 'BUY NOW',
      accentColor: 'text-neon-green border-neon-green/40 bg-neon-green/5',
      glowClass: 'glow-green',
      url: 'https://mora-epilogue-tickets.example.com/purchase',
    },
    {
      id: 'runner',
      title: 'RUNNER GAME',
      iconName: 'Footprints',
      description: 'Rank Top 10 to win a FREE premium ticket.',
      ctaText: 'PLAY & WIN',
      accentColor: 'text-neon-blue border-neon-blue/30 bg-neon-blue/5',
      glowClass: 'glow-blue',
      url: 'https://go.moraspirit.com/run-game',
    },
    {
      id: 'quiz',
      title: 'QUIZ CHALLENGE',
      iconName: 'Brain',
      description: 'Score over 80% to win a FREE student pass.',
      ctaText: 'START & WIN',
      accentColor: 'text-neon-purple border-neon-purple/30 bg-neon-purple/5',
      glowClass: 'glow-purple',
      url: 'https://go.moraspirit.com/quizes',
    },
    {
      id: 'treasure',
      title: 'TREASURE HUNT',
      iconName: 'Compass',
      description: 'Crack hidden coordinates to unlock a FREE VIP pass.',
      ctaText: 'HUNT & WIN',
      accentColor: 'text-neon-pink border-neon-pink/30 bg-neon-pink/5',
      glowClass: 'glow-pink',
      url: 'https://go.moraspirit.com/ctf',
    },
  ];

  const handleCardClick = (card: HubCard) => {
    window.open(card.url, '_blank', 'noopener,noreferrer');
  };

  const renderIcon = (name: string, cls: string) => {
    switch (name) {
      case 'Ticket':
        return <Ticket className={`${cls} text-neon-green`} />;
      case 'Footprints':
        return <Footprints className={`${cls} text-neon-blue animate-pulse`} />;
      case 'Brain':
        return <Brain className={`${cls} text-neon-purple animate-pulse`} />;
      case 'Compass':
        return <Compass className={`${cls} text-neon-pink animate-spin`} style={{ animationDuration: '10s' }} />;
      default:
        return <Sparkles className={cls} />;
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center px-4 relative overflow-hidden select-none">
      
      {/* TOP HEADER */}
      <div className="w-full max-w-md flex justify-between items-end mb-6 z-10 w-full mt-4">
        <div>
          <h1 className="text-2xl font-display font-black tracking-[0.14em] text-white leading-none">
            EPILOGUE<span className="text-neon-green text-glow-green">'26</span>
          </h1>
          <span className="text-[10px] font-mono tracking-widest text-white/50 block mt-1.5 uppercase">
            Official Portal
          </span>
        </div>

        <button
          onClick={onResetIntro}
          className="px-3 py-1.5 rounded-lg border border-white/10 glass-panel hover:bg-white/10 active:scale-95 transition-all text-[10px] font-mono text-white/70 tracking-wider h-fit"
        >
          REPLAY
        </button>
      </div>

      {/* MAIN CARDS */}
      <div className="w-full max-w-md my-auto grid grid-cols-2 gap-4 z-10">
        {cards.map((card) => {
          const isTicketsCard = card.id === 'tickets';
          return (
            <motion.div
              key={card.id}
              onClick={() => handleCardClick(card)}
              whileTap={{ scale: 0.96 }}
              className={`cursor-pointer rounded-2xl p-4 border glass-panel transition-all flex flex-col justify-between min-h-[160px] relative group overflow-hidden ${card.accentColor} ${card.glowClass}`}
            >
              {/* Halos */}
              <div className={`absolute top-0 right-0 w-24 h-24 rounded-full opacity-5 group-hover:opacity-15 transition-opacity blur-[20px] ${
                card.id === 'tickets' ? 'bg-neon-green' : card.id === 'runner' ? 'bg-neon-blue' : card.id === 'quiz' ? 'bg-neon-purple' : 'bg-neon-pink'
              }`} />

              <div className="flex justify-between items-start">
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                  {renderIcon(card.iconName, 'w-5 h-5')}
                </div>
                <span className={`text-[9px] font-mono tracking-wider px-1.5 py-0.5 rounded uppercase font-bold ${
                  isTicketsCard 
                    ? 'bg-neon-green/20 text-neon-green border border-neon-green/30' 
                    : 'bg-white/5 text-white/60 border border-white/10'
                }`}>
                  {isTicketsCard ? 'BUY ZONE' : 'FREE PASS'}
                </span>
              </div>

              <div className="mt-3">
                <h4 className={`text-sm font-display font-black tracking-wider text-slate-100 uppercase ${
                  isTicketsCard ? 'text-glow-green text-neon-green' : ''
                }`}>
                  {card.title}
                </h4>
                <p className="text-[11px] text-white/65 font-light leading-snug mt-1 border-t border-white/5 pt-2">
                  {card.description}
                </p>
              </div>

              <div className="mt-4 flex justify-between items-center text-[10px] font-mono tracking-wider font-extrabold uppercase">
                <span className={`${isTicketsCard ? 'text-neon-green text-glow-green' : 'text-slate-300'}`}>
                  {card.ctaText}
                </span>
                <ChevronRight className={`w-3.5 h-3.5 text-white/50 group-hover:text-white group-hover:translate-x-0.5 transition-all ${
                  isTicketsCard ? 'text-neon-green' : ''
                }`} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
