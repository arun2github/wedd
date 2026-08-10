/**
 * The entrance reveal cascade, in seconds, with t=0 at the moment the envelope
 * finishes opening. Kept in one place so the Hero, the Navbar and the scroll cue
 * can't drift out of sync with each other.
 *
 * Tight on purpose. The cascade is the *last* thing standing between the guest
 * and the site, and by this point they have already watched a curtain and a
 * film — the names should land with the move, not trail two seconds behind it.
 */
export const REVEAL = {
  background: 0,
  eyebrow: 0.26,
  brideName: 0.34,
  ampersand: 0.44,
  groomName: 0.5,
  divider: 0.66,
  message: 0.82,
  date: 0.92,
  scrollCue: 1.06,
  navbar: 1.18,
  /** Cascade complete — scroll is unlocked here. */
  done: 1.3,
} as const;

/**
 * The envelope step, in seconds, with t=0 at the moment the curtain finishes
 * lifting. The clip plays itself — the guest watches rather than drives — so
 * every number here is spent on the guest's behalf and stays deliberately tight.
 */
export const ENVELOPE = {
  /**
   * The clip runs long for something the guest can't skip, and envelope footage
   * survives being hurried in a way that a face or a camera move would not.
   * Faster than this and the flap visibly snaps.
   */
  rate: 1.5,
  /**
   * How far before the clip's last frame the dive begins, in *media* time — so
   * the wall-clock lead is this over `rate`. The camera push starts while the
   * flap is still settling, so the two read as one continuous move instead of
   * an animation that stops and a second one that starts.
   */
  overlap: 0.75,
  /** The dive: the envelope rushes past the camera, the invitation grows out of it. */
  emerge: 1.15,
  /**
   * Muted autoplay is permitted but not guaranteed, and a stalled decoder never
   * fires `ended`. Scroll is frozen for this whole step, so it needs a hard
   * ceiling — past this the invitation emerges whatever the video is doing.
   * Comfortably clear of the clip's own runtime (~3.3s at `rate`).
   */
  ceiling: 5,
} as const;

/** Stagger between individual words inside a name. */
export const WORD_STAGGER = 0.04;

/** Ken Burns settle applied to the hero background as the cascade runs. */
export const BACKGROUND_SETTLE = { from: 1.14, to: 1, duration: 1.3 } as const;

/** Curtain loader timings, in seconds. */
export const CURTAIN = {
  monogramDraw: 0.6,
  /** Never trap the user behind a slow network. */
  maxWait: 1.8,
  split: 0.75,
} as const;
