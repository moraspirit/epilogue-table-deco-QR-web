import React, { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  speedX: number;
  speedY: number;
  life: number;
  maxLife: number;
}

interface AmbientWavesProps {
  intensity?: number; // 1 to 5
  particlesEnabled?: boolean;
  synthEnabled?: boolean;
  setSynthEnabled?: (val: boolean) => void;
}

export default function AmbientWaves({
  intensity = 2,
  particlesEnabled = true,
  synthEnabled = false,
  setSynthEnabled,
}: AmbientWavesProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const osc1Ref = useRef<OscillatorNode | null>(null);
  const osc2Ref = useRef<OscillatorNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const lfoRef = useRef<OscillatorNode | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const pointerRef = useRef({ x: -1000, y: -1000, isDown: false });

  // Initialize particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    const colors = ['#9d4edd', '#00b4d8', '#ff007f', '#05ff60'];
    const pArr: Particle[] = [];

    // Seed initial particles
    for (let i = 0; i < 40; i++) {
      pArr.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.4,
        life: Math.random() * 100 + 50,
        maxLife: 150,
      });
    }
    particlesRef.current = pArr;

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Animation Loop
  useEffect(() => {
    let animationFrameId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let offset = 0;

    const colors = ['rgba(157, 78, 221, ', 'rgba(5, 255, 96, ', 'rgba(0, 180, 216, ', 'rgba(255, 0, 127, '];

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Draw glowing background gradients
      const radialGlow = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 10,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) * 0.8
      );
      radialGlow.addColorStop(0, '#0c0620');
      radialGlow.addColorStop(1, '#05020a');
      ctx.fillStyle = radialGlow;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Draw animated frequency/sine waves
      offset += 0.006 * intensity;
      const waveCount = 3;
      
      for (let w = 0; w < waveCount; w++) {
        ctx.beginPath();
        ctx.lineWidth = w === 0 ? 3 : w === 1 ? 2 : 1.5;
        
        const alpha = (0.25 - w * 0.06).toFixed(2);
        ctx.strokeStyle = `${colors[w % colors.length]}${alpha})`;

        // Vertical offset for three waves centered close to the middle/bottom half
        const midY = canvas.height * (0.55 + w * 0.05);
        const frequency = 0.003 + w * 0.0015;
        const amplitude = (cardinalHeight() * 0.07) * (w === 0 ? 1 : w === 1 ? 0.7 : 0.5) * intensity;

        for (let x = 0; x <= canvas.width; x += 8) {
          const y = midY + Math.sin(x * frequency + offset * (w + 1)) * amplitude 
                     + Math.cos(x * 0.001 - offset * 0.5) * (amplitude * 0.2);
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();

        // Optionally, fill area under the main wave with a beautiful subtle gradient
        if (w === 0) {
          ctx.lineTo(canvas.width, canvas.height);
          ctx.lineTo(0, canvas.height);
          const fillGrad = ctx.createLinearGradient(0, midY - 100, 0, canvas.height);
          fillGrad.addColorStop(0, 'rgba(157, 78, 221, 0.01)');
          fillGrad.addColorStop(1, 'rgba(0, 180, 216, 0.00)');
          ctx.fillStyle = fillGrad;
          ctx.fill();
        }
      }

      function cardinalHeight() {
        return canvas ? canvas.height : 800;
      }

      // 3. Draw particles
      if (particlesEnabled) {
        const particles = particlesRef.current;
        
        // Spawn particle at touch/pointer if active
        if (pointerRef.current.isDown && Math.random() < 0.4) {
          particles.push({
            x: pointerRef.current.x,
            y: pointerRef.current.y,
            size: Math.random() * 3 + 1.5,
            color: colors[Math.floor(Math.random() * colors.length)] + '0.8)',
            speedX: (Math.random() - 0.5) * 2,
            speedY: (Math.random() - 0.5) * 2,
            life: 100,
            maxLife: 100,
          });
        }

        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.speedX;
          p.y += p.speedY;
          p.life--;

          // Slow deceleration
          p.speedX *= 0.99;
          p.speedY *= 0.99;

          if (p.life <= 0) {
            // Recycle particle
            p.x = Math.random() * canvas.width;
            p.y = Math.random() * canvas.height;
            p.size = Math.random() * 2 + 1;
            p.life = Math.random() * 100 + 50;
            p.speedX = (Math.random() - 0.5) * 0.4;
            p.speedY = (Math.random() - 0.5) * 0.4;
          }

          // Render particle with glow
          const particleAlpha = p.life < 30 ? p.life / 30 : 1;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color.includes('rgba') 
            ? p.color.replace(/[\d.]+\)$/, `${particleAlpha * 0.75})`)
            : `rgba(157, 78, 221, ${particleAlpha * 0.6})`;
          ctx.fill();
        }
      }

      // 4. Subtle center graphic: digital audio line grids or decorative scanner orbits
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width < 500 ? 120 : 180, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
      ctx.lineWidth = 1;
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [intensity, particlesEnabled]);

  // Audio Synthesizer lifecycle
  useEffect(() => {
    if (synthEnabled) {
      try {
        // Create audio context safely
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctxValue = new AudioContextClass();
        audioCtxRef.current = ctxValue;

        // Base soft gain node
        const mainGain = ctxValue.createGain();
        mainGain.gain.setValueAtTime(0, ctxValue.currentTime);
        // Ramp up gradually to protect hearing (low levels: 0.05 max for a cozy pad)
        mainGain.gain.linearRampToValueAtTime(0.06, ctxValue.currentTime + 1.5);
        mainGain.connect(ctxValue.destination);
        gainNodeRef.current = mainGain;

        // Beautiful resonant low-pass filter to sound premium & cosmic
        const lpFilter = ctxValue.createBiquadFilter();
        lpFilter.type = 'lowpass';
        lpFilter.frequency.setValueAtTime(320, ctxValue.currentTime);
        lpFilter.Q.setValueAtTime(4, ctxValue.currentTime);
        lpFilter.connect(mainGain);
        filterRef.current = lpFilter;

        // Carrier 1: Low deep hum at A2 (110Hz)
        const osc1 = ctxValue.createOscillator();
        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(110, ctxValue.currentTime); // Fundamental A2
        
        // Gentle hum volume
        const osc1Gain = ctxValue.createGain();
        osc1Gain.gain.setValueAtTime(0.5, ctxValue.currentTime);
        osc1.connect(lpFilter);
        
        osc1.start();
        osc1Ref.current = osc1;

        // Carrier 2: Perfect fifth major pad at E3 (164.8Hz) or A3 octave (220Hz)
        const osc2 = ctxValue.createOscillator();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(164.81, ctxValue.currentTime); // E3 perfect fifth

        osc2.connect(lpFilter);
        osc2.start();
        osc2Ref.current = osc2;

        // LFO (Low Frequency Oscillator) to modulate the filter for "breathing" sweep
        const lfo = ctxValue.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(0.18, ctxValue.currentTime); // Slow sweep every ~5.5s
        
        const lfoGain = ctxValue.createGain();
        lfoGain.gain.setValueAtTime(150, ctxValue.currentTime); // sweep width in Hz

        lfo.connect(lfoGain);
        lfoGain.connect(lpFilter.frequency);
        lfo.start();
        lfoRef.current = lfo;

      } catch (err) {
        console.warn('Audio synthesis failed to initialize:', err);
      }
    } else {
      // Tear down
      cleanupAudio();
    }

    return () => {
      cleanupAudio();
    };
  }, [synthEnabled]);

  const cleanupAudio = () => {
    try {
      if (osc1Ref.current) {
        osc1Ref.current.stop();
        osc1Ref.current = null;
      }
      if (osc2Ref.current) {
        osc2Ref.current.stop();
        osc2Ref.current = null;
      }
      if (lfoRef.current) {
        lfoRef.current.stop();
        lfoRef.current = null;
      }
      if (audioCtxRef.current) {
        if (audioCtxRef.current.state !== 'closed') {
          audioCtxRef.current.close();
        }
        audioCtxRef.current = null;
      }
    } catch (e) {
      console.warn('Error cleaning up synthesizer:', e);
    }
  };

  // Pointer move updates synthesizer frequencies
  const handlePointerDown = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    pointerRef.current.isDown = true;
    updatePointerCoords(e);
  };

  const handlePointerMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    updatePointerCoords(e);

    // If audio is active, subtly adjust the filter resonance and pitch coordinates
    // left-right controls resonance, bottom-top controls master pad cutoff base!
    if (audioCtxRef.current && filterRef.current && pointerRef.current.isDown) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const xPct = pointerRef.current.x / canvas.width;
      const yPct = 1 - pointerRef.current.y / canvas.height; // 0 at bottom, 1 at top

      // Cutoff between 150Hz and 600Hz
      const targetCutoff = 150 + yPct * 500;
      // Q resonance between 2 and 12
      const targetQ = 2 + xPct * 10;

      filterRef.current.frequency.setValueAtTime(targetCutoff, audioCtxRef.current.currentTime);
      filterRef.current.Q.setValueAtTime(targetQ, audioCtxRef.current.currentTime);

      // Subtle vibrato adjustment
      if (osc1Ref.current && osc2Ref.current) {
        const pitchDrift = (xPct - 0.5) * 2; // -1 to +1Hz drift
        osc1Ref.current.frequency.setValueAtTime(110 + pitchDrift, audioCtxRef.current.currentTime);
        osc2Ref.current.frequency.setValueAtTime(164.81 - pitchDrift * 0.5, audioCtxRef.current.currentTime);
      }
    }
  };

  const handlePointerUp = () => {
    pointerRef.current.isDown = false;
    // Restore default filter sweeper values
    if (audioCtxRef.current && filterRef.current) {
      filterRef.current.frequency.setTargetAtTime(320, audioCtxRef.current.currentTime, 0.5);
      filterRef.current.Q.setTargetAtTime(4, audioCtxRef.current.currentTime, 0.5);
      if (osc1Ref.current && osc2Ref.current) {
        osc1Ref.current.frequency.setTargetAtTime(110, audioCtxRef.current.currentTime, 0.3);
        osc2Ref.current.frequency.setTargetAtTime(164.81, audioCtxRef.current.currentTime, 0.3);
      }
    }
  };

  const updatePointerCoords = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      if (e.touches && e.touches[0]) {
        pointerRef.current.x = e.touches[0].clientX - rect.left;
        pointerRef.current.y = e.touches[0].clientY - rect.top;
      }
    } else {
      pointerRef.current.x = (e as React.MouseEvent).clientX - rect.left;
      pointerRef.current.y = (e as React.MouseEvent).clientY - rect.top;
    }
  };

  // Toggle audio stream helper
  const toggleSound = () => {
    if (setSynthEnabled) {
      setSynthEnabled(!synthEnabled);
    }
  };

  return (
    <div className="absolute inset-0 w-full h-full -z-10 bg-dark-bg select-none pointer-events-auto">
      <canvas
        ref={canvasRef}
        className="block w-full h-full cursor-crosshair"
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
      />
      
      {/* Sound toggle button styled into the background corner */}
      <div className="absolute bottom-5 left-5 z-20 flex items-center gap-2">
        <button
          onClick={toggleSound}
          className="px-3 py-1.5 rounded-full border border-white/10 glass-panel hover:bg-white/5 active:scale-95 transition-all text-[11px] font-mono font-medium tracking-wider flex items-center gap-1.5 text-white/70 hover:text-white"
          title="Synthesize custom low frequency background pad"
          id="toggle_audio_synthetic"
        >
          <span className="relative flex h-2 w-2">
            {synthEnabled && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-purple opacity-75"></span>
            )}
            <span className={`relative inline-flex rounded-full h-2 w-2 ${synthEnabled ? 'bg-neon-purple' : 'bg-gray-500'}`}></span>
          </span>
          {synthEnabled ? 'SYNTH: ACTIVE' : 'SYNTH: OFFLINE'}
        </button>
        {synthEnabled && (
          <span className="text-[9px] font-mono text-white/40 hidden md:inline">
            Drag to modulate cutoff filter
          </span>
        )}
      </div>
    </div>
  );
}
