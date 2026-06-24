import { motion } from 'motion/react';

export default function ScreenArtists() {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center text-center px-6 relative select-none">
      {/* Background glow */}
      <div className="absolute w-80 h-80 rounded-full bg-neon-purple/10 blur-[70px] -z-10" />

      <span className="text-[11px] font-mono tracking-[0.4em] text-neon-green mb-6 uppercase text-glow-green">
        FEATURING LIVE
      </span>
      
      <h2 className="text-5xl md:text-6xl font-display font-black text-white uppercase tracking-widest leading-[1.3]">
        BNS
        <br />
        DADDY
      </h2>
    </div>
  );
}
