import { motion } from 'motion/react';

export default function ScreenCreative() {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center text-center px-6 relative select-none">
      {/* Background glow */}
      <div className="absolute w-96 h-96 rounded-full bg-neon-pink/10 blur-[80px] -z-10" />

      <h2 className="text-3xl md:text-4xl font-display font-black text-white uppercase tracking-widest mb-6">
        MUSIC
      </h2>
      <h2 className="text-3xl md:text-4xl font-display font-black text-neon-blue text-glow-blue uppercase tracking-widest mb-6">
        MEMORIES
      </h2>
      <h2 className="text-3xl md:text-4xl font-display font-black text-neon-green text-glow-green uppercase tracking-widest">
        EUPHORIA
      </h2>
    </div>
  );
}
