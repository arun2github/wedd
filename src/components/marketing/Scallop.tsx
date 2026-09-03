/**
 * The scalloped edge between two bands of colour.
 *
 * Not a decorative wave. This is the cusped — *foliated* — arch of Mughal
 * architecture, the same profile that runs along a jharokha balcony and the
 * top of a mehrab, and the same family as the `.arch` used elsewhere on the
 * platform. Repeating it along a horizontal edge is how it appears in the
 * building: a colonnade, not a single opening.
 *
 * Drawn as one stretched path rather than a repeating background image, so it
 * scales to any viewport width without seams and costs no request.
 */
export function Scallop({
  fill,
  className = "",
  flip = false,
  cusps = 14,
}: {
  /** CSS colour of the band *below* the edge. */
  fill: string;
  className?: string;
  /** Point the cusps upward, for a band ending rather than beginning. */
  flip?: boolean;
  cusps?: number;
}) {
  const W = 1440;
  const H = 48;
  const step = W / cusps;

  /* Each cusp is a single quadratic arc; `T` would chain them into a smooth
     sine, which is a wave. A scallop needs every arc to restart, so each one is
     written out. */
  let d = `M0,${H} `;
  for (let i = 0; i < cusps; i++) {
    const x0 = i * step;
    d += `Q${x0 + step / 2},-6 ${x0 + step},${H} `;
  }
  d += `L${W},${H} L0,${H} Z`;

  return (
    <div aria-hidden="true" className={`pointer-events-none relative w-full ${className}`}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className={`block h-8 w-full sm:h-12 ${flip ? "rotate-180" : ""}`}
      >
        <path d={d} fill={fill} />
      </svg>
    </div>
  );
}
