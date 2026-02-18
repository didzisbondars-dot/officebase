"use client";

import { useCompare } from "./CompareContext";
import { X, GitCompareArrows } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function CompareBar() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();

  if (compareList.length === 0) return null;

  const compareUrl = `/compare?ids=${compareList.map((p) => p.id).join(",")}`;

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50",
        "bg-[var(--brand-navy)] text-white",
        "border-t border-white/10",
        "shadow-2xl",
        "animate-fade-up"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-medium text-white/80 shrink-0">
            <GitCompareArrows className="w-4 h-4" />
            Compare ({compareList.length}/3)
          </div>

          <div className="flex items-center gap-3 flex-1 overflow-x-auto">
            {compareList.map((project) => (
              <div
                key={project.id}
                className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5 shrink-0"
              >
                {project.images[0] && (
                  <div className="w-6 h-6 rounded overflow-hidden shrink-0">
                    <Image
                      src={project.images[0].url}
                      alt={project.name}
                      width={24}
                      height={24}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
                <span className="text-sm text-white font-medium whitespace-nowrap max-w-[120px] truncate">
                  {project.name}
                </span>
                <button
                  onClick={() => removeFromCompare(project.id)}
                  className="ml-1 text-white/60 hover:text-white transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {compareList.length < 3 &&
              Array.from({ length: 3 - compareList.length }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 border border-dashed border-white/20 rounded-lg px-3 py-1.5 shrink-0"
                >
                  <span className="text-sm text-white/30 whitespace-nowrap">
                    Add project...
                  </span>
                </div>
              ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={clearCompare}
              className="text-xs text-white/60 hover:text-white transition-colors"
            >
              Clear
            </button>
            <Link
              href={compareUrl}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                compareList.length >= 2
                  ? "bg-[var(--brand-gold)] text-white hover:bg-[var(--brand-gold)]/90"
                  : "bg-white/10 text-white/40 cursor-not-allowed"
              )}
              onClick={(e) => compareList.length < 2 && e.preventDefault()}
            >
              Compare Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
