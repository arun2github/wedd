"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { m, useReducedMotion } from "framer-motion";
import { useScrollController } from "@/components/providers/SmoothScrollProvider";

/**
 * Media that expands as you scroll, then hands the page back.
 *
 * Adapted from the published component, with four changes this codebase forces:
 *
 * 1. `m.*` instead of `motion.*`. `MotionProvider` wraps the app in
 *    `LazyMotion … strict`, which makes `motion.*` throw on purpose so the
 *    feature bundle stays lazy. The original would have crashed on mount.
 *
 * 2. Lenis holds the page still instead of `window.scrollTo(0, 0)`. Lenis owns
 *    scrolling here, and a `scrollTo` fired from a scroll handler fights it
 *    every frame — the page judders and the expansion stutters. Taking the
 *    existing refcounted lock stops Lenis cleanly, and releasing it at full
 *    expansion hands scrolling back.
 *
 * 3. Progress lives in a ref as well as state. The original re-registered five
 *    window listeners on every one of the ~120 progress updates in a single
 *    expansion; the listeners now attach once.
 *
 * 4. Reduced motion opens fully on mount. The effect is a scroll hijack the
 *    visitor cannot interrupt, which is precisely what that setting asks us
 *    not to do.
 */

interface ScrollExpandMediaProps {
  mediaType?: "video" | "image";
  mediaSrc: string;
  posterSrc?: string;
  /**
   * A still behind the expanding frame, fading out as the frame grows.
   *
   * Optional. Left off, the frame grows on the page ground instead — which is
   * the right call when the media is itself a full scene and a second image
   * behind it would only be competing wallpaper.
   */
  bgImageSrc?: string;
  /**
   * A film behind the expanding frame, looping, fading out as the frame grows.
   *
   * Takes precedence over `bgImageSrc` when both are given. Under
   * `prefers-reduced-motion` it does not play at all and `bgPosterSrc` is
   * rendered as a still instead — a full-bleed moving background is the exact
   * thing that setting exists to switch off, and unlike the scroll expansion
   * it never ends on its own.
   */
  bgVideoSrc?: string;
  /** First frame of `bgVideoSrc`. Shown while it decodes, and in place of it
   *  when motion is reduced, so the layer is never empty. */
  bgPosterSrc?: string;
  title?: string;
  date?: string;
  scrollToExpand?: string;
  textBlend?: boolean;
  /**
   * Render the title for screen readers and search engines only.
   *
   * A hero can be wordless; a document cannot be headingless. Dropping the
   * `h1` entirely would leave the page with no top-level heading at all, so it
   * stays in the markup and leaves the screen.
   */
  titleHidden?: boolean;
  children?: ReactNode;
}

export function ScrollExpandMedia({
  mediaType = "image",
  mediaSrc,
  posterSrc,
  bgImageSrc,
  bgVideoSrc,
  bgPosterSrc,
  title,
  date,
  scrollToExpand,
  textBlend,
  titleHidden = false,
  children,
}: ScrollExpandMediaProps) {
  const prefersReduced = useReducedMotion();
  const scroll = useScrollController();

  const [progress, setProgress] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  /* Mirrors of the two values the listeners read, so the listeners can attach
     once instead of on every progress update. */
  const progressRef = useRef(0);
  const expandedRef = useRef(false);
  const touchStartY = useRef(0);

  /*
    Reduced motion opens the media fully, derived at render rather than pushed
    through an effect. Setting three pieces of state inside an effect just to
    reach a value that is a pure function of a prop causes a cascading render —
    and the listeners below already bail out for the same condition, so there
    is nothing to keep in sync.
  */
  const forceOpen = Boolean(prefersReduced);
  const shownProgress = forceOpen ? 1 : progress;
  const isExpanded = forceOpen || expanded;
  const contentVisible = forceOpen || showContent;

  /* Hold the page still only while the media is still growing. Lenis is
     stopped, so the wheel and touch deltas below are the only thing moving
     anything — and the moment it is fully open the lock is released and normal
     scrolling resumes. */
  useEffect(() => {
    if (isExpanded || forceOpen) return;
    scroll.lock();
    return () => scroll.unlock();
  }, [scroll, isExpanded, forceOpen]);

  useEffect(() => {
    if (forceOpen) return;

    const advance = (delta: number) => {
      const next = Math.min(Math.max(progressRef.current + delta, 0), 1);
      progressRef.current = next;
      setProgress(next);

      if (next >= 1) {
        expandedRef.current = true;
        setExpanded(true);
        setShowContent(true);
      } else if (next < 0.75) {
        setShowContent(false);
      }
    };

    const onWheel = (e: globalThis.WheelEvent) => {
      /* Scrolling back up at the very top collapses it again, so the opening
         can be replayed rather than being a one-way door. */
      if (expandedRef.current) {
        if (e.deltaY < 0 && window.scrollY <= 5) {
          expandedRef.current = false;
          setExpanded(false);
          e.preventDefault();
        }
        return;
      }
      e.preventDefault();
      advance(e.deltaY * 0.0009);
    };

    const onTouchStart = (e: globalThis.TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const onTouchMove = (e: globalThis.TouchEvent) => {
      if (!touchStartY.current) return;
      const y = e.touches[0].clientY;
      const deltaY = touchStartY.current - y;

      if (expandedRef.current) {
        if (deltaY < -20 && window.scrollY <= 5) {
          expandedRef.current = false;
          setExpanded(false);
          e.preventDefault();
        }
        return;
      }
      e.preventDefault();
      /* A thumb travels far less than a wheel spins, and collapsing needs to
         feel lighter than expanding or it never happens by accident. */
      advance(deltaY * (deltaY < 0 ? 0.008 : 0.005));
      touchStartY.current = y;
    };

    const onTouchEnd = () => { touchStartY.current = 0; };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: false });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [forceOpen]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const mediaWidth = 300 + shownProgress * (isMobile ? 650 : 1250);
  const mediaHeight = 400 + shownProgress * (isMobile ? 200 : 400);
  const textShift = shownProgress * (isMobile ? 180 : 150);

  /* The still standing in for the background: the video's own poster when
     there is a video, otherwise the plain background image. `next/image`
     throws on an empty src, so the layer renders nothing rather than a
     placeholder when neither is supplied. */
  const bgStill = bgVideoSrc ? bgPosterSrc : bgImageSrc;

  const [firstWord, ...rest] = (title ?? "").split(" ");
  const restOfTitle = rest.join(" ");

  return (
    <div className="overflow-x-hidden transition-colors duration-700 ease-in-out">
      <section className="relative flex min-h-[100dvh] flex-col items-center justify-start">
        <div className="relative flex min-h-[100dvh] w-full flex-col items-center">
          {bgVideoSrc || bgImageSrc ? (
            <m.div
              className="absolute inset-0 z-0 h-full"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 - shownProgress }}
              transition={{ duration: 0.1 }}
            >
              {bgVideoSrc && !prefersReduced ? (
                <video
                  src={bgVideoSrc}
                  poster={bgPosterSrc}
                  autoPlay
                  muted
                  loop
                  playsInline
                  /* Decorative. It carries no information the page does not
                     already say in words, so it is hidden from the tree
                     rather than announced as an unlabelled media element. */
                  aria-hidden="true"
                  tabIndex={-1}
                  className="size-full object-cover object-center"
                />
              ) : bgStill ? (
                <Image
                  src={bgStill}
                  alt=""
                  fill
                  sizes="100vw"
                  priority
                  className="object-cover object-center"
                />
              ) : null}
              <div className="absolute inset-0 bg-aubergine/35" />
            </m.div>
          ) : null}

          <div className="container relative z-10 mx-auto flex flex-col items-center justify-start">
            <div className="relative flex h-[100dvh] w-full flex-col items-center justify-center">
              <div
                className="absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 rounded-2xl transition-none"
                style={{
                  width: `${mediaWidth}px`,
                  height: `${mediaHeight}px`,
                  maxWidth: "95vw",
                  maxHeight: "85vh",
                  boxShadow: "0 0 60px rgba(42, 21, 32, 0.35)",
                }}
              >
                {mediaType === "video" ? (
                  <div className="pointer-events-none relative h-full w-full">
                    <video
                      src={mediaSrc}
                      poster={posterSrc}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="auto"
                      controls={false}
                      disablePictureInPicture
                      className="h-full w-full rounded-xl object-cover"
                    />
                    <m.div
                      className="absolute inset-0 rounded-xl bg-aubergine/40"
                      initial={{ opacity: 0.6 }}
                      animate={{ opacity: 0.5 - shownProgress * 0.35 }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                ) : (
                  <div className="relative h-full w-full">
                    <Image
                      src={mediaSrc}
                      alt={title ?? ""}
                      fill
                      sizes="95vw"
                      priority
                      className="rounded-xl object-cover"
                    />
                    <m.div
                      className="absolute inset-0 rounded-xl bg-aubergine/45"
                      initial={{ opacity: 0.6 }}
                      animate={{ opacity: 0.6 - shownProgress * 0.4 }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                )}

                <div className="relative z-10 mt-4 flex flex-col items-center text-center transition-none">
                  {date && (
                    <p
                      className="font-display text-2xl text-linen"
                      style={{ transform: `translateX(-${textShift}vw)` }}
                    >
                      {date}
                    </p>
                  )}
                  {scrollToExpand && (
                    <p
                      className="text-[0.68rem] uppercase tracking-[0.28em] text-linen/75"
                      style={{ transform: `translateX(${textShift}vw)` }}
                    >
                      {scrollToExpand}
                    </p>
                  )}
                </div>
              </div>

              {/* The title splits and travels outward as the media grows —
                  the words getting out of the picture's way. When hidden it
                  keeps its place in the document and leaves the screen. */}
              {titleHidden ? (
                <h1 className="sr-only">{title}</h1>
              ) : (
                <div
                  className={`relative z-10 flex w-full flex-col items-center justify-center gap-2 text-center transition-none ${
                    textBlend ? "mix-blend-difference" : ""
                  }`}
                >
                  <h1
                    className="font-display text-[clamp(2.6rem,7vw,5.4rem)] font-light leading-[0.95] tracking-[-0.02em] text-linen transition-none"
                    style={{ transform: `translateX(-${textShift}vw)` }}
                  >
                    {firstWord}
                  </h1>
                  <h2
                    className="font-display text-[clamp(2.6rem,7vw,5.4rem)] font-light leading-[0.95] tracking-[-0.02em] text-linen transition-none"
                    style={{ transform: `translateX(${textShift}vw)` }}
                  >
                    {restOfTitle}
                  </h2>
                </div>
              )}
            </div>

            <m.section
              className="flex w-full flex-col px-6 py-12 md:px-14 lg:py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: contentVisible ? 1 : 0 }}
              transition={{ duration: 0.7 }}
              /* Hidden from assistive tech and from tab order until it is
                 actually on screen, so a keyboard user does not land inside an
                 invisible block. */
              aria-hidden={!contentVisible}
              inert={!contentVisible}
            >
              {children}
            </m.section>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ScrollExpandMedia;
