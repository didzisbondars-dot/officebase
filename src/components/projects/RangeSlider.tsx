"use client";

import { useRef, useEffect } from "react";

interface RangeSliderProps {
  min: number;
  max: number;
  values: [number, number];
  onChange: (values: [number, number]) => void;
  ticks?: number[];
}

export function RangeSlider({ min, max, values, onChange, ticks }: RangeSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<[number, number]>(values);
  const onChangeRef = useRef(onChange);

  // Keep refs in sync — no stale closures
  useEffect(() => { valuesRef.current = values; }, [values]);
  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);

  const getPercent = (val: number) => ((val - min) / (max - min)) * 100;

  const snap = (raw: number) => {
    const clamped = Math.max(min, Math.min(max, raw));
    if (!ticks || ticks.length === 0) return Math.round(clamped);
    return ticks.reduce((prev, curr) =>
      Math.abs(curr - clamped) < Math.abs(prev - clamped) ? curr : prev
    );
  };

  const startDrag = (which: "min" | "max") => (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const move = (ev: MouseEvent | TouchEvent) => {
      const track = trackRef.current;
      if (!track) return;
      const clientX = "touches" in ev ? ev.touches[0].clientX : ev.clientX;
      const rect = track.getBoundingClientRect();
      const pct = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
      const val = snap(pct * (max - min) + min);
      const cur = valuesRef.current;

      let next: [number, number];
      if (which === "min") {
        next = [Math.min(val, cur[1] - 1), cur[1]];
      } else {
        next = [cur[0], Math.max(val, cur[0] + 1)];
      }
      valuesRef.current = next;
      onChangeRef.current(next);
    };

    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", up);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    window.addEventListener("touchmove", move);
    window.addEventListener("touchend", up);
  };

  return (
    <div className="w-full select-none px-2.5">
      <div ref={trackRef} className="relative h-6 flex items-center">
        {/* Grey track only to the right of max handle */}
        <div className="absolute h-1.5 bg-border rounded-full" style={{ left: `${getPercent(values[1])}%`, right: 0 }} />
        {/* Active navy range */}
        <div
          className="absolute h-1.5 bg-[var(--brand-navy)] rounded-full pointer-events-none"
          style={{ left: `${getPercent(values[0])}%`, right: `${100 - getPercent(values[1])}%` }}
        />
        <div
          onMouseDown={startDrag("min")}
          onTouchStart={startDrag("min")}
          className="absolute -translate-x-1/2 w-5 h-5 rounded-full bg-white border-2 border-[var(--brand-navy)] shadow-md cursor-grab active:cursor-grabbing hover:scale-110 transition-transform"
          style={{ left: `${getPercent(values[0])}%`, zIndex: 10 }}
        />
        <div
          onMouseDown={startDrag("max")}
          onTouchStart={startDrag("max")}
          className="absolute -translate-x-1/2 w-5 h-5 rounded-full bg-white border-2 border-[var(--brand-navy)] shadow-md cursor-grab active:cursor-grabbing hover:scale-110 transition-transform"
          style={{ left: `${getPercent(values[1])}%`, zIndex: 10 }}
        />
      </div>
      {ticks && (
        <div className="relative w-full mt-2 h-4">
          {ticks.map((t) => (
            <span key={t} className="absolute -translate-x-1/2 text-xs text-muted-foreground" style={{ left: `${getPercent(t)}%` }}>
              €{t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
