"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";

/**
 * Glow Border — a conic gradient spinning behind a frame, masked down to a
 * ring, so only a comet of light travels the perimeter.
 *
 * Adapted from the Originkit component for this codebase. Four changes, each
 * for a reason:
 *
 * 1. `defaultProps` is gone. React 19 ignores it on function components, so it
 *    was silently doing nothing; the destructured defaults below are the real
 *    ones.
 * 2. `radiusPx` overrides the percentage corner. The original derives the
 *    radius from the measured box, which cannot line up with a Tailwind
 *    `rounded-[1.6rem]` on the element it frames — and a ring a few pixels off
 *    its own card is the most visible way to get this wrong.
 * 3. The loop is parked when the frame is off-screen. This sits on the home
 *    page, where an always-running rAF costs battery for a ring nobody is
 *    looking at.
 * 4. `prefers-reduced-motion` renders the ring static. It is decoration; a
 *    perpetually moving object in peripheral vision is exactly what that
 *    setting is asking us not to do.
 *
 * The gradient layer is sized to the frame's diagonal plus a margin, which is
 * the smallest square that still covers it at every rotation.
 */

type Props = {
  mode?: "standard" | "multi";
  direction?: "clockwise" | "anti-clockwise";
  /** Degrees per second ÷ 3.6. 10 ≈ 36°/s. */
  speed?: number;
  hoverMultiplier?: number;
  rainbowColors?: string[];
  glowColor?: string;
  tailColor?: string;
  baseColor?: string;
  /** Percentage of the arc available to one comet. */
  tailLength?: number;
  dualTails?: boolean;
  borderWidth?: number;
  /** Corner as a percentage of half the shorter edge. Ignored if `radiusPx`. */
  rounded?: number;
  /** Corner in px. Match this to the radius of the element being framed. */
  radiusPx?: number;
  className?: string;
  style?: React.CSSProperties;
};

const DEFAULT_RAINBOW = [
  "#EF4444",
  "#F97316",
  "#EAB308",
  "#22C55E",
  "#3B82F6",
  "#6366F1",
  "#A855F7",
];

export function GlowBorder({
  mode = "standard",
  direction = "clockwise",
  speed = 10,
  hoverMultiplier = 5,
  rainbowColors,
  glowColor = "#00FFE8",
  tailColor = "#00EDFF66",
  baseColor = "rgba(255, 255, 255, 0.04)",
  tailLength = 60,
  dualTails = true,
  borderWidth = 5,
  rounded = 0,
  radiusPx,
  className,
  style,
}: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);

  // Rounded is a percentage, and a CSS percentage border-radius makes an
  // ellipse rather than a pill — so the frame is measured and the corner
  // worked out in px, with 100% landing on half the shorter edge.
  const [box, setBox] = useState({ w: 0, h: 0 });

  const colors =
    Array.isArray(rainbowColors) && rainbowColors.length
      ? rainbowColors
      : DEFAULT_RAINBOW;

  const isRainbow = mode === "multi";

  // Live props for the rAF loop — mutated in place so a prop change never
  // restarts the loop or snaps the comet back to 0°.
  const live = useRef({ speed, hoverMultiplier, direction });
  useEffect(() => {
    live.current = { speed, hoverMultiplier, direction };
  }, [speed, hoverMultiplier, direction]);

  useEffect(() => {
    const host = hostRef.current;
    const layer = layerRef.current;
    if (!host || !layer) return;

    // The rotating square has to cover the frame at EVERY angle, and a centred
    // square of side s only covers its inscribed circle, radius s/2. The
    // frame's corners sit on its circumcircle, radius diagonal/2. Sizing the
    // square to exactly the diagonal puts its edge right on those corners, so
    // at the rotations where that edge runs closest it shaves them off — a 45°
    // chamfer on two opposite corners. The margin is what keeps them covered.
    const sizeLayer = (w: number, h: number) => {
      setBox({ w, h });
      const size = Math.ceil(Math.hypot(w, h)) + 24;
      layer.style.width = `${size}px`;
      layer.style.height = `${size}px`;
      layer.style.top = `calc(50% - ${size / 2}px)`;
      layer.style.left = `calc(50% - ${size / 2}px)`;
    };
    sizeLayer(host.clientWidth, host.clientHeight);

    // Hit testing needs viewport coordinates, so that rect is cached
    // separately and refreshed on layout changes rather than per pointer event.
    let rect = host.getBoundingClientRect();
    const refreshRect = () => {
      rect = host.getBoundingClientRect();
    };

    const ro = new ResizeObserver((entries) => {
      const cr = entries[0]?.contentRect;
      sizeLayer(cr?.width ?? host.clientWidth, cr?.height ?? host.clientHeight);
      refreshRect();
    });
    ro.observe(host);
    window.addEventListener("scroll", refreshRect, { passive: true });
    window.addEventListener("resize", refreshRect);

    const stillPreferred = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let boost = 1;
    let boostTarget = 1;
    let rotation = 0;
    let visible = true;
    let raf = 0;
    let last = 0;

    const frame = (now: number) => {
      // Clamp dt so a backgrounded tab does not spin the comet away, and so
      // the first frame after a park does not jump.
      const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
      last = now;
      const p = live.current;

      boost += (boostTarget - boost) * (1 - Math.exp(-dt / 0.12));
      rotation = (rotation + p.speed * 3.6 * boost * dt) % 360;
      const flip = p.direction === "clockwise" ? 1 : -1;
      layer.style.transform = `scaleX(${flip}) rotate(${rotation}deg)`;

      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (raf || stillPreferred) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      if (!raf) return;
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const onMove = (e: PointerEvent) => {
      if (!visible) return;
      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;
      boostTarget = inside ? live.current.hoverMultiplier : 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    // Park the loop while the ring is off-screen.
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) {
          refreshRect();
          start();
        } else {
          boostTarget = 1;
          stop();
        }
      },
      { rootMargin: "128px" },
    );
    io.observe(host);

    // Draw one frame regardless, so the ring is present when motion is off.
    layer.style.transform = `scaleX(${direction === "clockwise" ? 1 : -1}) rotate(0deg)`;

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("scroll", refreshRect);
      window.removeEventListener("resize", refreshRect);
      window.removeEventListener("pointermove", onMove);
    };
  }, [direction]);

  const corner =
    radiusPx ??
    (Math.max(0, Math.min(100, rounded)) / 100) * (Math.min(box.w, box.h) / 2);

  const buildGradient = () => {
    if (isRainbow) {
      return `conic-gradient(from 0deg at 50% 50%, ${colors.join(", ")}, ${colors[0]})`;
    }

    // Tail Length is a % of the arc available to one comet: the whole ring for
    // a single tail, half of it for two. Held just under the full sweep so
    // there is always some resting base left to travel over.
    const span = dualTails ? 180 : 360;
    const l = Math.max(
      1,
      (Math.max(0, Math.min(100, tailLength)) / 100) * span * 0.94,
    );
    // The lit head, and the arc it decays over on the leading side. Kept wide
    // on purpose: a conic stop boundary is a ray from the centre, so a tight
    // one reads as a hard diagonal line wherever it crosses a corner.
    const tip = Math.max(6, l * 0.35);
    const decay = Math.max(8, l * 0.3);

    // One comet: head at the END of its arc, decaying forwards past the wrap
    // so the two ends meet on the same colour. Finishing on glowColor at
    // 360deg and restarting on baseColor at 0deg is a hard step, and on a
    // rectangular ring that step lands as a straight diagonal cut across
    // whichever corner the wrap falls on.
    const comet = (end: number) =>
      [
        `${glowColor} ${end}deg`,
        `${tailColor} ${end + decay}deg`,
        `${baseColor} ${end + decay * 2}deg`,
        `${baseColor} ${end + span - l}deg`,
        `${tailColor} ${end + span - tip}deg`,
      ].join(", ");

    const stops = dualTails
      ? `${comet(0)}, ${comet(180)}, ${glowColor} 360deg`
      : `${comet(0)}, ${glowColor} 360deg`;

    return `conic-gradient(from 0deg at 50% 50%, ${stops})`;
  };

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minWidth: 8,
        minHeight: 8,
        boxSizing: "border-box",
        borderRadius: corner,
        padding: Math.max(0, borderWidth),
        overflow: "hidden",
        // Decorative only — it must never eat clicks meant for the content it
        // frames.
        pointerEvents: "none",
        // Punch the fill out of the padding box, leaving just the ring.
        WebkitMaskImage: "linear-gradient(#fff 0 0), linear-gradient(#fff 0 0)",
        WebkitMaskClip: "content-box, border-box",
        WebkitMaskComposite: "xor",
        maskImage: "linear-gradient(#fff 0 0), linear-gradient(#fff 0 0)",
        maskClip: "content-box, border-box",
        maskComposite: "exclude",
        ...style,
      }}
    >
      <div
        ref={layerRef}
        style={{
          position: "absolute",
          // Sized to the diagonal by the effect; these are first-paint values.
          top: 0,
          left: 0,
          width: "200%",
          height: "200%",
          background: buildGradient(),
          transformOrigin: "center center",
          willChange: "transform",
        }}
      />
    </div>
  );
}

export default GlowBorder;
