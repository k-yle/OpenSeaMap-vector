import { useEffect, useRef } from 'react';
import { SCALE } from '../style.js';

export const Stars: React.FC = () => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;

    // high DPI
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width * SCALE;
    canvas.height = height * SCALE;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(SCALE, SCALE);

    // px² ÷ densityFactor
    const starCount = Math.min(canvas.width, canvas.height) ** 2 / 1000;

    const stars = Array.from({ length: starCount }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5,
      t: Math.random(),
      tʹ: Math.random(),
    }));

    ctx.fillStyle = '#001';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (const { x, y, r, t, tʹ } of stars) {
      // interpolate from hsl(245, 98%, 81%) to #fff
      const h = 245;
      const s = 98 * (1 - t);
      const l = 81 + (100 - 81) * t;
      ctx.fillStyle = `hsl(${h}, ${s}%, ${l}%)`;

      ctx.globalAlpha = tʹ;

      ctx.beginPath();
      ctx.arc(x, y, r, 0, 2 * Math.PI);
      ctx.fill();
    }
  }, []);

  return <canvas ref={ref} />;
};
