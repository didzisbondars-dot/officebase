"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Maximize2, GitCompareArrows, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn, formatCurrency, formatArea, getStatusColor, getStatusDot, truncate } from "@/lib/utils";
import type { Project } from "@/types";
import { useCompare } from "@/components/compare/CompareContext";

interface ProjectCardProps {
  project: Project;
  className?: string;
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  const { addToCompare, removeFromCompare, isInCompare, canAdd } = useCompare();
  const inCompare = isInCompare(project.id);
  const [imgIndex, setImgIndex] = useState(0);

  const images = project.images;
  const heroImage = images[imgIndex];
  const price = project.salePricePerSqm || project.rentPricePerSqm;
  const priceLabel = project.salePricePerSqm ? "/ sqm (sale)" : "/ sqm / mo";

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCompare) removeFromCompare(project.id);
    else if (canAdd) addToCompare(project);
  };

  const prevImg = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIndex((i) => (i - 1 + images.length) % images.length);
  };

  const nextImg = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIndex((i) => (i + 1) % images.length);
  };

  return (
    <Link href={`/projects/${project.slug}`} className={cn("group block", className)}>
      <article className="bg-white rounded-2xl overflow-hidden border border-border hover:border-[var(--brand-gold)]/40 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
        {/* Image */}
        <div className="relative h-52 overflow-hidden bg-muted">
          {heroImage ? (
            <Image
              src={heroImage.url}
              alt={project.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted to-secondary">
              <span className="font-display text-4xl text-muted-foreground/50">{project.name.charAt(0)}</span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

          {/* Prev/Next arrows - only if multiple images */}
          {images.length > 1 && (
            <>
              <button onClick={prevImg} className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={nextImg} className="absolute right-10 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <ChevronRight className="w-4 h-4" />
              </button>
              {/* Dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setImgIndex(i); }}
                    className={cn("w-1.5 h-1.5 rounded-full transition-all", i === imgIndex ? "bg-white scale-125" : "bg-white/50")}
                  />
                ))}
              </div>
            </>
          )}

          {/* Status badge */}
          <div className="absolute top-3 left-3">
            <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border", getStatusColor(project.status))}>
              <span className={cn("w-1.5 h-1.5 rounded-full", getStatusDot(project.status))} />
              {project.status}
            </span>
          </div>

          {/* Compare button */}
          <button
            onClick={handleCompare}
            className={cn(
              "absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all z-10",
              inCompare ? "bg-[var(--brand-gold)] text-white" : "bg-black/40 text-white hover:bg-black/60",
              !canAdd && !inCompare && "opacity-40 cursor-not-allowed"
            )}
            title={inCompare ? "Remove from compare" : "Add to compare"}
          >
            {inCompare ? <Check className="w-4 h-4" /> : <GitCompareArrows className="w-4 h-4" />}
          </button>

          {/* Image counter */}
          {images.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full z-10">
              {imgIndex + 1}/{images.length}
            </div>
          )}

          {project.featured && (
            <div className="absolute bottom-3 left-3">
              <span className="bg-[var(--brand-gold)] text-white text-xs font-medium px-2 py-0.5 rounded">Featured</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="mb-1">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{project.propertyType}</span>
          </div>
          <h3 className="font-display text-lg leading-tight text-foreground mb-1 group-hover:text-[var(--brand-navy)] transition-colors">{project.name}</h3>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{project.district}, {project.city}</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">{truncate(project.description || "", 90)}</p>
          <div className="flex items-center gap-4 pt-3 border-t border-border">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Maximize2 className="w-3.5 h-3.5" />
              <span>{formatArea(project.totalArea)}</span>
            </div>
            {price && (
              <div className="ml-auto text-right">
                <div className="text-sm font-semibold text-[var(--brand-navy)]">{formatCurrency(price, "USD", true)}</div>
                <div className="text-xs text-muted-foreground">{priceLabel}</div>
              </div>
            )}
          </div>
          {project.amenities.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {project.amenities.slice(0, 3).map((amenity) => (
                <span key={amenity} className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">{amenity}</span>
              ))}
              {project.amenities.length > 3 && (
                <span className="text-xs text-muted-foreground px-1 py-0.5">+{project.amenities.length - 3}</span>
              )}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
