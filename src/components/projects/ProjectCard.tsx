"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Maximize2, GitCompareArrows, Check } from "lucide-react";
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

  const heroImage = project.images[0];
  const price = project.salePricePerSqm || project.rentPricePerSqm;
  const priceLabel = project.salePricePerSqm ? "/ sqm (sale)" : "/ sqm / mo";

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCompare) {
      removeFromCompare(project.id);
    } else if (canAdd) {
      addToCompare(project);
    }
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
              <span className="font-display text-4xl text-muted-foreground/30">
                {project.name.charAt(0)}
              </span>
            </div>
          )}

          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

          {/* Status badge */}
          <div className="absolute top-3 left-3">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                getStatusColor(project.status)
              )}
            >
              <span className={cn("w-1.5 h-1.5 rounded-full", getStatusDot(project.status))} />
              {project.status}
            </span>
          </div>

          {/* Compare button */}
          <button
            onClick={handleCompare}
            className={cn(
              "absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all",
              inCompare
                ? "bg-[var(--brand-gold)] text-white"
                : "bg-black/40 text-white hover:bg-black/60",
              !canAdd && !inCompare && "opacity-40 cursor-not-allowed"
            )}
            title={inCompare ? "Remove from compare" : "Add to compare"}
          >
            {inCompare ? (
              <Check className="w-4 h-4" />
            ) : (
              <GitCompareArrows className="w-4 h-4" />
            )}
          </button>

          {/* Featured badge */}
          {project.featured && (
            <div className="absolute bottom-3 left-3">
              <span className="bg-[var(--brand-gold)] text-white text-xs font-medium px-2 py-0.5 rounded">
                Featured
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="mb-1">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
              {project.propertyType}
            </span>
          </div>

          <h3 className="font-display text-lg leading-tight text-foreground mb-1 group-hover:text-[var(--brand-navy)] transition-colors">
            {project.name}
          </h3>

          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{project.district}, {project.city}</span>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            {truncate(project.description, 90)}
          </p>

          <div className="flex items-center gap-4 pt-3 border-t border-border">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Maximize2 className="w-3.5 h-3.5" />
              <span>{formatArea(project.totalArea)}</span>
            </div>

            {price && (
              <div className="ml-auto text-right">
                <div className="text-sm font-semibold text-[var(--brand-navy)]">
                  {formatCurrency(price, "USD", true)}
                </div>
                <div className="text-xs text-muted-foreground">{priceLabel}</div>
              </div>
            )}
          </div>

          {project.amenities.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {project.amenities.slice(0, 3).map((amenity) => (
                <span
                  key={amenity}
                  className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded"
                >
                  {amenity}
                </span>
              ))}
              {project.amenities.length > 3 && (
                <span className="text-xs text-muted-foreground px-1 py-0.5">
                  +{project.amenities.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
