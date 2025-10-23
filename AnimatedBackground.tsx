import { useEffect, useRef } from "react";

type Props = {
  intensity?: "low" | "medium" | "high";
};

const BG = "#0B0C0E";
const PRIMARY = "#FF6B00"; // orange
const SECONDARY = "#FF4500"; // warm orange
const TERTIARY = "#FFD280"; // light accent


export default function AnimatedBackground({ intensity = "medium" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const runningRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let width = (canvas.width = window.innerWidth * devicePixelRatio);
    let height = (canvas.height = window.innerHeight * devicePixelRatio);
    canvas.style.width = "100%";
    canvas.style.height = "100%";

    // Densidad según intensidad
    const baseFlows = intensity === "low" ? 8 : intensity === "high" ? 22 : 14;

    // Parallax leve
    const parallax = { x: 0, y: 0, targetX: 0, targetY: 0 };

    // Curva Bezier random
    const rand = (min: number, max: number) => Math.random() * (max - min) + min;
    const choose = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

    type Flow = {
      t: number;                 // progreso 0..1
      speed: number;             // incremento por frame
      life: number;              // duración (frames aprox.)
      hue: string;               // color principal
      ctrl: [number, number, number, number, number, number, number, number]; // puntos bezier (p0, p1, p2, p3)
      trail: number;             // largo de estela (0.05..0.2)
      nodePulse: number;         // radio de pulso
    };

    const flows: Flow[] = [];

    const makeCtrl = (): Flow["ctrl"] => {
      const margin = 0.08; // evita pegarse a los bordes
      const sx = rand(margin, 1 - margin) * width;
      const sy = rand(margin, 1 - margin) * height;
      const ex = rand(margin, 1 - margin) * width;
      const ey = rand(margin, 1 - margin) * height;
      const c1x = sx + rand(-0.25, 0.25) * width;
      const c1y = sy + rand(-0.25, 0.25) * height;
      const c2x = ex + rand(-0.25, 0.25) * width;
      const c2y = ey + rand(-0.25, 0.25) * height;
      return [sx, sy, c1x, c1y, c2x, c2y, ex, ey];
    };

    const spawnFlow = () => {
      flows.push({
        t: 0,
        speed: rand(0.001, 0.003), // Slower
        life: rand(300, 500), // Longer life
        hue: choose([PRIMARY, SECONDARY, TERTIARY]),
        ctrl: makeCtrl(),
        trail: rand(0.1, 0.2), // Longer trail
        nodePulse: rand(2.0, 4.0),
      });
    };

    for (let i = 0; i < baseFlows; i++) spawnFlow();

    const bezierPoint = (t: number, p0: number, p1: number, p2: number, p3: number) =>
      Math.pow(1 - t, 3) * p0 +
      3 * Math.pow(1 - t, 2) * t * p1 +
      3 * (1 - t) * Math.pow(t, 2) * p2 +
      Math.pow(t, 3) * p3;

    const drawFlow = (f: Flow) => {
      const [x0, y0, x1, y1, x2, y2, x3, y3] = f.ctrl;

      // Estela
      const steps = 12;
      ctx.lineWidth = Math.max(1, width * 0.0008);
      for (let i = 0; i < steps; i++) {
        const tt = Math.min(1, f.t - (i / steps) * f.trail);
        if (tt <= 0) continue;
        const x = bezierPoint(tt, x0, x1, x2, x3);
        const y = bezierPoint(tt, y0, y1, y2, y3);
        const alpha = (1 - i / steps) * 0.1; // More subtle
        ctx.strokeStyle = withAlpha(f.hue, alpha);
        ctx.beginPath();
        ctx.moveTo(x, y);
        // tramo corto hacia adelante para suavizar
        const t2 = Math.min(1, tt + 0.01);
        const x2p = bezierPoint(t2, x0, x1, x2, x3);
        const y2p = bezierPoint(t2, y0, y1, y2, y3);
        ctx.lineTo(x2p, y2p);
        ctx.stroke();
      }

      // Nodo (punto brillante)
      const tn = Math.max(0, Math.min(1, f.t));
      const nx = bezierPoint(tn, x0, x1, x2, x3);
      const ny = bezierPoint(tn, y0, y1, y2, y3);
      const pulse = 1 + Math.sin(perfNow * 0.01) * 0.25;
      const r = f.nodePulse * pulse * devicePixelRatio;

      const grd = ctx.createRadialGradient(nx, ny, 0, nx, ny, r * 12);
      grd.addColorStop(0, withAlpha(f.hue, 0.25));
      grd.addColorStop(0.5, withAlpha(f.hue, 0.08));
      grd.addColorStop(1, withAlpha(f.hue, 0));
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(nx, ny, r * 12, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = withAlpha("#FFFFFF", 0.5);
      ctx.beginPath();
      ctx.arc(nx, ny, r * 0.75, 0, Math.PI * 2);
      ctx.fill();
    };

    const withAlpha = (hex: string, a: number) => {
      // admite #RRGGBB
      const c = hex.replace("#", "");
      const r = parseInt(c.slice(0, 2), 16);
      const g = parseInt(c.slice(2, 4), 16);
      const b = parseInt(c.slice(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${a})`;
    };

    let perfNow = 0;
    const render = () => {
      if (!runningRef.current) return;

      perfNow = performance.now();

      // Parallax: acercamos a target
      parallax.x += (parallax.targetX - parallax.x) * 0.05;
      parallax.y += (parallax.targetY - parallax.y) * 0.05;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, width, height);

      // Fondo muy sutil para asegurar legibilidad
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, width, height);

      // Desplazamiento suave
      ctx.translate(parallax.x, parallax.y);

      // Dibujar y avanzar
      for (let i = flows.length - 1; i >= 0; i--) {
        const f = flows[i];
        drawFlow(f);
        f.t += f.speed;
        f.life--;
        if (f.t >= 1 || f.life <= 0) {
          flows.splice(i, 1);
          // Respawn con una ligera probabilidad por frame
          if (flows.length < baseFlows) spawnFlow();
        }
      }

      // Pequeños destellos ocasionales
      if (Math.random() < 0.01) spawnFlow();

      rafRef.current = requestAnimationFrame(render);
    };

    // Resize
    const onResize = () => {
      width = canvas.width = window.innerWidth * devicePixelRatio;
      height = canvas.height = window.innerHeight * devicePixelRatio;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
    };
    window.addEventListener("resize", onResize);

    // Parallax (cursor)
    const onMouseMove = (e: MouseEvent) => {
      const dx = (e.clientX / window.innerWidth - 0.5) * 30 * devicePixelRatio;
      const dy = (e.clientY / window.innerHeight - 0.5) * 30 * devicePixelRatio;
      parallax.targetX = dx;
      parallax.targetY = dy;
    };
    window.addEventListener("mousemove", onMouseMove);

    // Reduced motion + tab oculta
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncRunState = () => {
      runningRef.current = !media.matches && !document.hidden;
      if (runningRef.current && rafRef.current == null) {
        rafRef.current = requestAnimationFrame(render);
      } else if (!runningRef.current && rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
    media.addEventListener?.("change", syncRunState);
    document.addEventListener("visibilitychange", syncRunState);

    syncRunState(); // inicia

    return () => {
      runningRef.current = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      media.removeEventListener?.("change", syncRunState);
      document.removeEventListener("visibilitychange", syncRunState);
    };
  }, [intensity]);

  return (
    <canvas
      id="ai-background"
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -2,
        pointerEvents: "none",
        background: BG,
      }}
    />
  );
}