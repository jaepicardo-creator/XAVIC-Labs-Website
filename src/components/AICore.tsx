import { useEffect, useRef, type PointerEvent } from "react";
import { Orbit } from "lucide-react";

/** Pointer updates are coalesced into one frame without re-rendering React. */
export default function AICore() {
  const art = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const frame = useRef<number | null>(null);
  const interactive = useRef(false);

  function reset() {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
    stage.current?.style.removeProperty("--core-x");
    stage.current?.style.removeProperty("--core-y");
    art.current?.removeAttribute("data-interacting");
    art.current?.style.removeProperty("--core-energy");
  }

  useEffect(() => {
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia?.("(hover: hover) and (pointer: fine)");
    const update = () => {
      interactive.current = Boolean(fine?.matches && !reduced?.matches);
      if (!interactive.current) reset();
    };
    update();
    reduced?.addEventListener("change", update);
    fine?.addEventListener("change", update);
    let visible = true;
    const pause = () => {
      if (art.current)
        art.current.dataset.paused = String(!visible || document.hidden);
      if (!visible || document.hidden) reset();
    };
    const observer =
      "IntersectionObserver" in window
        ? new IntersectionObserver((entries) => {
            visible = entries[0]?.isIntersecting ?? true;
            pause();
          })
        : null;
    if (art.current) observer?.observe(art.current);
    document.addEventListener("visibilitychange", pause);
    pause();
    return () => {
      reset();
      observer?.disconnect();
      reduced?.removeEventListener("change", update);
      fine?.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", pause);
    };
  }, []);

  function move(event: PointerEvent<HTMLDivElement>) {
    if (!interactive.current || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    const x =
      Math.max(
        -1,
        Math.min(1, ((event.clientX - bounds.left) / bounds.width) * 2 - 1),
      ) * 8;
    const y =
      Math.max(
        -1,
        Math.min(1, ((event.clientY - bounds.top) / bounds.height) * 2 - 1),
      ) * 8;
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      stage.current?.style.setProperty("--core-x", `${x}px`);
      stage.current?.style.setProperty("--core-y", `${y}px`);
      art.current?.style.setProperty(
        "--core-energy",
        String(0.2 + Math.min(1, Math.hypot(x, y) / 8) * 0.6),
      );
      art.current?.setAttribute("data-interacting", "true");
      frame.current = null;
    });
  }

  return (
    <div
      className="hero-art"
      ref={art}
      aria-hidden="true"
      onPointerMove={move}
      onPointerLeave={reset}
    >
      <div className="art-grid" />
      <div className="orbital-stage" ref={stage}>
        <div className="interaction-glow" />
        <div className="orbit orbit-one">
          <div className="orbital-data-track">
            <span className="orbital-point" />
          </div>
        </div>
        <div className="orbit orbit-two">
          <div className="orbital-data-track">
            <span className="orbital-point" />
          </div>
        </div>
        <div className="orbit orbit-three">
          <div className="orbital-data-track">
            <span className="orbital-point" />
          </div>
        </div>
        <div className="core">
          <Orbit size={92} strokeWidth={0.7} />
        </div>
      </div>
      <span className="art-label label-top">X / EXPERIMENTAL CORE</span>
      <span className="art-label label-bottom">
        SYSTEM ONLINE <span className="status-dot" />
      </span>
      <span className="coordinate">XAVIC / NEURAL STUDY</span>
    </div>
  );
}
