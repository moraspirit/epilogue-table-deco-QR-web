import { motion } from 'motion/react';

export default function ScreenTeaser() {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center px-6 py-10 relative overflow-hidden select-none">
      
      {/* Background glow */}
      <div className="absolute w-96 h-96 rounded-full bg-neon-green/10 blur-[80px] -z-10" />

      <h2 className="text-4xl md:text-5xl font-display font-black text-white text-center uppercase tracking-widest leading-snug">
        PLAY GAMES <br />
        <span className="text-neon-green text-glow-green">WIN FREE TICKETS</span>
      </h2>
      
      <p className="text-sm font-sans text-white/80 font-light mt-6 max-w-xs text-center border border-white/10 p-3 rounded-xl glass-panel">
        Top scores across all three challenges instantly unlock official entry passes to the festival.
      </p>

    </div>
  );
}
