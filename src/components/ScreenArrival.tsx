import { motion } from 'motion/react';
import RealFireFX from './RealFireFX';

export default function ScreenArrival() {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center px-4 relative select-none overflow-hidden">
      
      {/* Intense customized robust canvas particle fire passing from bottom-left to top-right */}
      <RealFireFX />

      {/* Background glowing gradients for aesthetic depth */}
      <div className="absolute w-80 h-80 rounded-full bg-neon-green/5 blur-[80px] top-1/4 -z-10 animate-pulse" />
      <div className="absolute w-64 h-64 rounded-full bg-neon-purple/10 blur-[60px] bottom-1/4 -z-10" />

      {/* Main Center Segment: Simplified, high-impact branding */}
      <div className="flex flex-col items-center justify-center text-center relative w-full max-w-sm">

        {/* Small trailer lead-in text */}
        <p className="text-[10px] sm:text-xs font-mono tracking-[0.35em] text-neon-green mb-3 uppercase font-semibold text-glow-green">
          THE EVENT PORTAL
        </p>

        {/* Hero festival title */}
        <h1 className="text-[12vw] sm:text-6xl md:text-7xl font-display font-black tracking-[0.02em] sm:tracking-[0.08em] text-white select-none text-glow-purple relative z-10 w-full flex items-center justify-center">
          EPILOGUE
          <span className="text-neon-green font-black font-display ml-1 select-none text-glow-green">
            '26
          </span>
        </h1>

        {/* MoraSpirit text/branding directly below the hero logo */}
        <div className="mt-8 flex flex-col items-center gap-1.5 w-full">
          <span className="text-[9px] sm:text-[11px] font-mono tracking-[0.4em] text-white/50 uppercase font-medium">
            POWERED BY
          </span>
          <span className="text-sm sm:text-lg font-display font-black tracking-[0.2em] text-white text-glow-blue uppercase mt-1">
            MORASPIRIT
          </span>
          <span className="text-[8px] sm:text-[9px] font-mono tracking-[0.16em] text-neon-green/90 uppercase block mt-1">
            University of Moratuwa
          </span>
        </div>
      </div>
    </div>
  );
}
