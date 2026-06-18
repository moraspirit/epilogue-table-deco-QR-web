import { motion } from 'motion/react';

export default function ScreenDetails() {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center text-center px-6 relative select-none">
      {/* Background glow */}
      <div className="absolute w-72 h-72 rounded-full bg-neon-blue/10 blur-[60px] -z-10" />

      <h2 className="text-4xl md:text-5xl font-display font-black text-neon-green uppercase tracking-widest text-glow-green mb-4">
        JULY 28
      </h2>
      <h3 className="text-2xl md:text-3xl font-display font-black text-white uppercase tracking-widest mb-3 leading-snug">
        LAGAAN FESTIVAL <br/> GROUND
      </h3>
      <div className="h-[2px] w-12 bg-neon-blue mx-auto mb-4 rounded-full" />
      <p className="text-sm md:text-base font-mono tracking-widest text-white/60 uppercase text-glow-blue">
        6.00 PM ONWARDS
      </p>
    </div>
  );
}
