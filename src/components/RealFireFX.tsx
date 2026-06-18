import { useEffect, useRef } from 'react';

export default function RealFireFX() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;
    let cw = window.innerWidth;
    let ch = window.innerHeight;

    const resize = () => {
      cw = window.innerWidth;
      ch = window.innerHeight;
      canvas.width = cw;
      canvas.height = ch;
    };
    
    window.addEventListener('resize', resize);
    resize();

    // Fire texture using radial gradient
    const createFireTexture = () => {
      const c = document.createElement('canvas');
      c.width = 64;
      c.height = 64;
      const ctx2 = c.getContext('2d');
      if (ctx2) {
        const gradient = ctx2.createRadialGradient(32, 32, 0, 32, 32, 32);
        
        // Realistic fire colors (white-hot center, yellow, orange, red, black)
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)'); 
        gradient.addColorStop(0.1, 'rgba(255, 255, 200, 1)'); 
        gradient.addColorStop(0.3, 'rgba(255, 200, 50, 0.8)'); 
        gradient.addColorStop(0.5, 'rgba(255, 100, 0, 0.5)'); 
        gradient.addColorStop(0.8, 'rgba(150, 20, 0, 0.1)'); 
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx2.fillStyle = gradient;
        ctx2.fillRect(0, 0, 64, 64);
      }
      return c;
    };

    const fireTex = createFireTexture();

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      life: number;
      maxLife: number;
      rotation: number;
      rotSpeed: number;

      constructor() {
        // Spawn tightly in the bottom-left area, mostly off-screen
        this.x = (Math.random() * Math.min(cw * 0.4, 300)) - 100; 
        this.y = ch + (Math.random() * ch * 0.2); 
        
        // Give it a direction from bottom-left to top-right
        const baseSpeed = Math.random() * 5 + 6;
        
        // Vector towards top right (~ 45 degrees up)
        const angle = -Math.PI / 4 + (Math.random() - 0.5) * 0.5;
        
        this.vx = Math.cos(angle) * baseSpeed;
        this.vy = Math.sin(angle) * baseSpeed * 1.5; // faster upwards draft
        
        this.size = Math.random() * 180 + 60; // large flames
        this.life = 0;
        this.maxLife = Math.random() * 150 + 60;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.05;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        
        // Add upward draft, accelerating as it gets hotter
        this.vy -= 0.05; 
        this.vx += 0.03; // pull more to the right over time
        
        // Chaotic turbulence
        this.vx += (Math.random() - 0.5) * 1.5;
        this.vy += (Math.random() - 0.5) * 1.5;

        this.life++;
        this.rotation += this.rotSpeed;
        
        // Shrink slightly to form flame tips
        this.size *= 0.985;
      }

      draw(ctx: CanvasRenderingContext2D) {
        const lifeRatio = this.life / this.maxLife;
        const opacity = Math.max(0, 1 - Math.pow(lifeRatio, 1.2));
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = opacity;
        ctx.drawImage(fireTex, -this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
      }
    }

    const startTime = Date.now();

    const loop = () => {
      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.globalCompositeOperation = 'lighter'; // Additive blending for fire luminescence
      
      const elapsed = Date.now() - startTime;

      // Spawn new particles fast for a roaring fire, but stop after 2.2 seconds
      if (particles.length < 250 && elapsed < 2200) {
        for (let i = 0; i < 6; i++) {
          particles.push(new Particle());
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw(ctx);
        
        if (p.life >= p.maxLife || p.x > cw + 300 || p.y < -300 || p.size < 5) {
          particles.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-40 transform mix-blend-screen"
      style={{ filter: 'blur(1px)' }} 
    />
  );
}
