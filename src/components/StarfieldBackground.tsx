import React, { useEffect, useRef } from 'react';

interface StarfieldBackgroundProps {
  celebrationTrigger?: number | null;
}

interface FloatingGlyph {
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
      const colors = ['#4A9FE8', '#D92732', '#172B3A', '#DCEEFF'];
      const newParticles: BurstParticle[] = [];
      const cx = window.innerWidth * 0.4;
      const cy = window.innerHeight * 0.45;
      for (let i = 0; i < 55; i++) {
        const angle = (Math.PI * 2 * i) / 55 + (Math.random() - 0.5) * 0.3;
        const speed = 2 + Math.random() * 6.5;
        newParticles.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.5,
          size: 2.5 + Math.random() * 3.5,
          color: colors[i % colors.length],
          alpha: 0.9,
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
    const symbols = ['0', '1', '2⁰', '2¹', '2²', '2³', '2⁴'];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const glyphs: FloatingGlyph[] = Array.from({ length: 32 }, (_, i) => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: 1.2 + Math.random() * 1.5,
      alpha: 0.1 + Math.random() * 0.22,
      speed: 0.12 + Math.random() * 0.25,
      symbol: i % 4 === 0 ? symbols[i % symbols.length] : undefined,
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const g of glyphs) {
        g.y -= g.speed;
        if (g.y < -20) {
          g.y = canvas.height + 10;
          g.x = Math.random() * canvas.width;
        }

        if (g.symbol) {
          ctx.save();
          ctx.font = '11px "Fira Code", monospace';
          ctx.fillStyle = `rgba(74, 159, 232, ${g.alpha})`;
          ctx.fillText(g.symbol, g.x, g.y);
          ctx.restore();
        } else {
          ctx.beginPath();
          ctx.arc(g.x, g.y, g.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(74, 159, 232, ${g.alpha * 0.8})`;
          ctx.fill();
        }
      }

      // Render celebration burst particles
      const remaining: BurstParticle[] = [];
      for (const p of burstsRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.12;
        p.alpha -= 0.018;
        if (p.alpha > 0) {
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fillStyle = p.color;
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
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
};
