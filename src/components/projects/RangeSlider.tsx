"use client";

import { useRef, useCallback } from "react";

interface RangeSliderProps {
  min: number;
  max: number;
  values: [number, number];
  onChange: (values: [number, number]) => void;
  ticks?: number[];
}

export function RangeSlider({ min, max, values, onChange, ticks }: RangeSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const getPercent = (val: number) => ((val - min) / (max - min)) * 100;

  const getValueFromEvent = useCallback((clientX: number) => {
    const track = trackRef.current;
    if (!track) return 0;
    const rect = track.getBoundingClientRect();
    const percent = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
    const raw = percent * (max - min) + min;
    if (ticks) {
      return ticks.reduce((prev, curr) => Math.abs(curr - raw) < Math.abs(prev - raw) ? curr : prev);
    }
    return Math.round(raw);
  }, [min, max, ticks]);

  const startDrag = (which: "min" | "max") => (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const move = (ev: MouseEvent | TouchEvent) => {
      const clientX = "touches" in ev ? ev.touches[0].clientX : ev.clientX;
      const val = getValueFromEvent(clientX);
      if (which === "min") {
        onChange([Math.min(val, values[1] - (ticks ? 1 : 1)), values[1]]);
      } else {
        onChange([values[0], Math.max(val, values[0] + (ticks ? 1 : 1))]);
      }
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
    <div className="w-full select-none">
      <div ref={trackRef} className="relative h-6 flex items-center cursor-pointer">
        {/* Track */}
        <div className="absolute w-full h-1.5 bg-border rounded-full" />
        {/* Active range */}
        <div
          className="absolute h-1.5 bg-[var(--brand-navy)] rounded-full"
          style={{ left: `${getPercent(values[0])}%`, right: `${100 - getPercent(values[1])}%` }}
        />
        {/* Min handle */}
        <div
          onMouseDown={startDrag("min")}
          onTouchStart={startDrag("min")}
          className="absolute -translate-x-1/2 w-5 h-5 rounded-full bg-white border-2 border-[var(--brand-navy)] shadow-md cursor-grab active:cursor-grabbing hover:scale-110 transition-transform"
          style={{ left: `${getPercent(values[0])}%`, zIndex: 3 }}
        />
        {/* Max handle */}
        <div
          onMouseDown={startDrag("max")}
          onTouchStart={startDrag("max")}
          className="absolute -translate-x-1/2 w-5 h-5 rounded-full bg-white border-2 border-[var(--brand-navy)] shadow-md cursor-grab active:cursor-grabbing hover:scale-110 transition-transform"
          style={{ left: `${getPercent(values[1])}%`, zIndex: 3 }}
        />
      </div>
      {ticks && (
        <div className="relative w-full mt-1">
          {ticks.map((t) => (
            <span
              key={t}
              className="absolute -translate-x-1/2 text-xs text-muted-foreground"
              style={{ left: `${getPercent(t)}%` }}
            >
              €{t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
