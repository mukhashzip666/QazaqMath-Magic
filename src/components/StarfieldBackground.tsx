import React, { useEffect, useRef } from 'react';

interface StarfieldBackgroundProps {
  celebrationTrigger?: number | null;
}

interface Star {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  speed: number;
  symbol?: string;
}

interface BurstParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
}

export const StarfieldBackground: React.FC<StarfieldBackgroundProps> = ({
  celebrationTrigger,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const burstsRef = useRef<BurstParticle[]>([]);

  useEffect(() => {
    if (celebrationTrigger && celebrationTrigger > 0) {
      const colors = ['#00f2fe', '#fbbf24', '#a855f7', '#38bdf8', '#f472b6'];
      const newParticles: BurstParticle[] = [];
      const cx = window.innerWidth * 0.4;
      const cy = window.innerHeight * 0.45;
      for (let i = 0; i < 65; i++) {
        const angle = (Math.PI * 2 * i) / 65 + (Math.random() - 0.5) * 0.3;
        const speed = 2 + Math.random() * 7;
        newParticles.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.5,
          size: 2 + Math.random() * 3.5,
          color: colors[i % colors.length],
          alpha: 1,
        });
      }
      burstsRef.current.push(...newParticles);
    }
  }, [celebrationTrigger]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const symbols = ['0', '1', '2⁰', '2¹', '2²', '2³', '2⁴', '✦'];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const stars: Star[] = Array.from({ length: 55 }, (_, i) => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: 0.8 + Math.random() * 1.8,
      alpha: 0.15 + Math.random() * 0.55,
      speed: 0.15 + Math.random() * 0.35,
      symbol: i % 5 === 0 ? symbols[i % symbols.length] : undefined,
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const star of stars) {
        star.y -= star.speed;
        if (star.y < -20) {
          star.y = canvas.height + 10;
          star.x = Math.random() * canvas.width;
        }

        if (star.symbol) {
          ctx.save();
          ctx.font = '11px "Fira Code", monospace';
          ctx.fillStyle = `rgba(0, 242, 254, ${star.alpha * 0.45})`;
          ctx.fillText(star.symbol, star.x, star.y);
          ctx.restore();
        } else {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(196, 181, 253, ${star.alpha})`;
          ctx.fill();
        }
      }

      // Render celebration burst particles
      const remaining: BurstParticle[] = [];
      for (const p of burstsRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.12; // gravity
        p.alpha -= 0.016;
        if (p.alpha > 0) {
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
          remaining.push(p);
        }
      }
      burstsRef.current = remaining;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-75"
      aria-hidden="true"
    />
  );
};
