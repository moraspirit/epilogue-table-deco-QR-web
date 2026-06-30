import { useEffect, useRef } from 'react';

type FireVariant = 'arrival' | 'hub';

interface RealFireFXProps {
  variant?: FireVariant;
  /** Repeat burst every N ms. Omit or 0 = single burst (arrival default). */
  repeatIntervalMs?: number;
  className?: string;
}

interface VariantConfig {
  burstDurationMs: number;
  maxParticles: number;
  spawnPerFrame: number;
  emberSpawnPerFrame: number;
  sizeMin: number;
  sizeMax: number;
}

// Real fire palettes — white-hot core → yellow → orange → deep red → smoke fade
const FIRE_TEXTURE_PALETTES: [number, string][][] = [
  [
    [0, 'rgba(255, 255, 255, 1)'],
    [0.08, 'rgba(255, 255, 210, 1)'],
    [0.22, 'rgba(255, 210, 60, 0.92)'],
    [0.42, 'rgba(255, 120, 10, 0.72)'],
    [0.62, 'rgba(220, 45, 0, 0.42)'],
    [0.82, 'rgba(120, 15, 0, 0.1)'],
    [1, 'rgba(0, 0, 0, 0)'],
  ],
  [
    [0, 'rgba(255, 250, 230, 1)'],
    [0.1, 'rgba(255, 235, 120, 0.98)'],
    [0.28, 'rgba(255, 170, 30, 0.85)'],
    [0.5, 'rgba(255, 85, 0, 0.55)'],
    [0.72, 'rgba(190, 30, 0, 0.18)'],
    [1, 'rgba(0, 0, 0, 0)'],
  ],
  [
    [0, 'rgba(255, 255, 255, 0.95)'],
    [0.12, 'rgba(255, 200, 80, 0.9)'],
    [0.35, 'rgba(255, 110, 0, 0.65)'],
    [0.58, 'rgba(200, 35, 0, 0.35)'],
    [0.78, 'rgba(80, 10, 0, 0.08)'],
    [1, 'rgba(0, 0, 0, 0)'],
  ],
];

const VARIANTS: Record<FireVariant, VariantConfig> = {
  arrival: {
    burstDurationMs: 2200,
    maxParticles: 250,
    spawnPerFrame: 6,
    emberSpawnPerFrame: 0,
    sizeMin: 60,
    sizeMax: 240,
  },
  hub: {
    burstDurationMs: 2200,
    maxParticles: 230,
    spawnPerFrame: 6,
    emberSpawnPerFrame: 3,
    sizeMin: 55,
    sizeMax: 220,
  },
};

const HUB_MOBILE_OVERRIDES: Partial<VariantConfig> = {
  maxParticles: 80,
  spawnPerFrame: 2,
  emberSpawnPerFrame: 0,
  sizeMin: 40,
  sizeMax: 130,
};

export default function RealFireFX({
  variant = 'arrival',
  repeatIntervalMs = 0,
  className = '',
}: RealFireFXProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const config = {
      ...VARIANTS[variant],
      ...(variant === 'hub' && window.matchMedia('(max-width: 768px)').matches ? HUB_MOBILE_OVERRIDES : {}),
    };
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const isLowPower = isMobile || variant === 'hub';
    const isRepeating = repeatIntervalMs > 0;

    let particles: FlameParticle[] = [];
    let embers: EmberParticle[] = [];
    let animationFrameId: number;
    let cw = window.innerWidth;
    let ch = window.innerHeight;
    let lastCycle = -1;
    let lastFrameTime = 0;
    const frameInterval = isMobile ? 1000 / 30 : 1000 / 60;

    const resize = () => {
      cw = window.innerWidth;
      ch = window.innerHeight;
      const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio, 2);
      canvas.width = Math.floor(cw * dpr);
      canvas.height = Math.floor(ch * dpr);
      canvas.style.width = `${cw}px`;
      canvas.style.height = `${ch}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    window.addEventListener('resize', resize);
    resize();

    const createFireTexture = (stops: [number, string][]) => {
      const c = document.createElement('canvas');
      c.width = 64;
      c.height = 64;
      const ctx2 = c.getContext('2d');
      if (ctx2) {
        const gradient = ctx2.createRadialGradient(32, 32, 0, 32, 32, 32);
        stops.forEach(([stop, color]) => gradient.addColorStop(stop, color));
        ctx2.fillStyle = gradient;
        ctx2.fillRect(0, 0, 64, 64);
      }
      return c;
    };

    const fireTextures = isMobile
      ? [createFireTexture(FIRE_TEXTURE_PALETTES[0])]
      : FIRE_TEXTURE_PALETTES.map(createFireTexture);

    type SpawnZone = 'bottom-left' | 'bottom-right' | 'bottom-center';

    const pickSpawnZone = (): SpawnZone => {
      if (variant !== 'hub') return 'bottom-left';
      const roll = Math.random();
      if (roll < 0.4) return 'bottom-right';
      if (roll < 0.7) return 'bottom-left';
      return 'bottom-center';
    };

    class FlameParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      life: number;
      maxLife: number;
      rotation: number;
      rotSpeed: number;
      texture: HTMLCanvasElement;

      constructor() {
        const zone = pickSpawnZone();

        if (zone === 'bottom-right') {
          this.x = cw - Math.random() * Math.min(cw * 0.38, 320) + 60;
          this.y = ch + Math.random() * ch * 0.18;
          const angle = (-Math.PI * 3) / 4 + (Math.random() - 0.5) * 0.45;
          const baseSpeed = Math.random() * 5 + 5.5;
          this.vx = Math.cos(angle) * baseSpeed;
          this.vy = Math.sin(angle) * baseSpeed * 1.45;
        } else if (zone === 'bottom-center') {
          this.x = cw * 0.3 + Math.random() * cw * 0.4;
          this.y = ch + Math.random() * ch * 0.12;
          const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.6;
          const baseSpeed = Math.random() * 4 + 5;
          this.vx = Math.cos(angle) * baseSpeed * 0.6;
          this.vy = Math.sin(angle) * baseSpeed * 1.2;
        } else {
          this.x = Math.random() * Math.min(cw * 0.4, 300) - 100;
          this.y = ch + Math.random() * ch * 0.2;
          const angle = -Math.PI / 4 + (Math.random() - 0.5) * 0.5;
          const baseSpeed = Math.random() * 5 + 6;
          this.vx = Math.cos(angle) * baseSpeed;
          this.vy = Math.sin(angle) * baseSpeed * 1.5;
        }

        this.size = Math.random() * (config.sizeMax - config.sizeMin) + config.sizeMin;
        this.life = 0;
        this.maxLife = Math.random() * 150 + 60;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.05;
        this.texture = fireTextures[Math.floor(Math.random() * fireTextures.length)];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy -= 0.05;
        this.vx += this.vx >= 0 ? 0.025 : -0.025;
        this.vx += (Math.random() - 0.5) * 1.5;
        this.vy += (Math.random() - 0.5) * 1.5;
        this.life++;
        this.rotation += this.rotSpeed;
        this.size *= 0.985;
      }

      draw(context: CanvasRenderingContext2D) {
        const lifeRatio = this.life / this.maxLife;
        const opacity = Math.max(0, 1 - Math.pow(lifeRatio, 1.2));
        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.rotation);
        context.globalAlpha = opacity;
        context.drawImage(this.texture, -this.size / 2, -this.size / 2, this.size, this.size);
        context.restore();
      }
    }

    class EmberParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      life: number;
      maxLife: number;
      color: string;

      constructor() {
        const zone = pickSpawnZone();
        if (zone === 'bottom-right') {
          this.x = cw - Math.random() * cw * 0.35;
          this.y = ch + Math.random() * 40;
        } else if (zone === 'bottom-center') {
          this.x = cw * 0.35 + Math.random() * cw * 0.3;
          this.y = ch + Math.random() * 30;
        } else {
          this.x = Math.random() * cw * 0.35;
          this.y = ch + Math.random() * 40;
        }

        const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.2;
        const speed = Math.random() * 6 + 4;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.size = Math.random() * 3 + 1.5;
        this.life = 0;
        this.maxLife = Math.random() * 40 + 25;
        const emberColors = [
          'rgba(255, 220, 100, 1)',
          'rgba(255, 160, 40, 1)',
          'rgba(255, 100, 20, 0.9)',
          'rgba(255, 60, 0, 0.85)',
        ];
        this.color = emberColors[Math.floor(Math.random() * emberColors.length)];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy -= 0.08;
        this.vx += (Math.random() - 0.5) * 0.8;
        this.life++;
      }

      draw(context: CanvasRenderingContext2D) {
        const lifeRatio = this.life / this.maxLife;
        const opacity = Math.max(0, 1 - lifeRatio);
        context.save();
        context.globalAlpha = opacity;
        context.fillStyle = this.color;
        if (!isLowPower) {
          context.shadowBlur = 8;
          context.shadowColor = this.color;
        }
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.fill();
        context.restore();
      }
    }

    const startTime = Date.now();

    const getBurstPhase = () => {
      const elapsed = Date.now() - startTime;

      if (!isRepeating) {
        return { isBursting: elapsed < config.burstDurationMs, cycle: 0 };
      }

      const cycle = Math.floor(elapsed / repeatIntervalMs);
      const phase = elapsed % repeatIntervalMs;
      return { isBursting: phase < config.burstDurationMs, cycle };
    };

    const loop = (now: number) => {
      if (now - lastFrameTime < frameInterval) {
        animationFrameId = requestAnimationFrame(loop);
        return;
      }
      lastFrameTime = now;

      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'lighter';

      const { isBursting, cycle } = getBurstPhase();

      if (isRepeating && cycle !== lastCycle) {
        particles = [];
        embers = [];
        lastCycle = cycle;
      }

      if (isBursting) {
        if (particles.length < config.maxParticles) {
          for (let i = 0; i < config.spawnPerFrame; i++) {
            particles.push(new FlameParticle());
          }
        }
        if (config.emberSpawnPerFrame > 0 && embers.length < 120) {
          for (let i = 0; i < config.emberSpawnPerFrame; i++) {
            embers.push(new EmberParticle());
          }
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw(ctx);

        if (p.life >= p.maxLife || p.x > cw + 300 || p.x < -300 || p.y < -300 || p.size < 5) {
          particles.splice(i, 1);
        }
      }

      for (let i = embers.length - 1; i >= 0; i--) {
        const e = embers[i];
        e.update();
        e.draw(ctx);

        if (e.life >= e.maxLife || e.y < -50) {
          embers.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [variant, repeatIntervalMs]);

  const defaultClass =
    variant === 'hub'
      ? 'fixed inset-0 pointer-events-none z-[1] mix-blend-screen'
      : 'absolute inset-0 pointer-events-none z-40 mix-blend-screen';

  return (
    <canvas
      ref={canvasRef}
      className={`${defaultClass} blur-[1px] max-sm:blur-none ${className}`.trim()}
    />
  );
}
