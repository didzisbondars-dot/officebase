"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, MapPin, Building, Maximize2, User, ChevronLeft, ChevronRight } from "lucide-react";
import type { Project } from "@/types";
import { formatArea, formatCurrency, getStatusColor, getStatusDot, cn } from "@/lib/utils";
import { LeadForm } from "@/components/projects/LeadForm";

export default function ProjectDetailClient({ project }: { project: Project }) {
  const [imgIndex, setImgIndex] = useState(0);
  const images = project.images;

  return (
    <div className="min-h-screen bg-[var(--brand-warm)] pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/projects" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Projects
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* LEFT: Lead form */}
          <div className="lg:col-span-2 space-y-4">
            <LeadForm projectName={project.name} projectId={project.id} />
          </div>

          {/* RIGHT: Project details */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-border overflow-hidden">

            {/* Image gallery */}
            {images.length > 0 && (
              <div className="relative h-72 bg-muted group">
                <Image src={images[imgIndex].url} alt={project.name} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                {images.length > 1 && (
                  <>
                    <button onClick={() => setImgIndex((i) => (i - 1 + images.length) % images.length)} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={() => setImgIndex((i) => (i + 1) % images.length)} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full">{imgIndex + 1} / {images.length}</div>
                  </>
                )}
              </div>
            )}

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 p-3 overflow-x-auto border-b border-border">
                {images.map((img, i) => (
                  <button key={img.id} onClick={() => setImgIndex(i)} className={cn("relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all", i === imgIndex ? "border-[var(--brand-gold)]" : "border-transparent opacity-60 hover:opacity-100")}>
                    <Image src={img.url} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Header */}
              <div>
                <span className={cn("inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border mb-3", getStatusColor(project.status))}>
                  <span className={cn("w-1.5 h-1.5 rounded-full", getStatusDot(project.status))} />
                  {project.status}
                </span>
                <h1 className="font-display text-3xl text-[var(--brand-navy)] mb-2">{project.name}</h1>
                <p className="text-muted-foreground flex items-center gap-1.5 text-sm">
                  <MapPin className="w-4 h-4 shrink-0" />{project.address}{project.district ? `, ${project.district}` : ""}, {project.city}
                </p>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { icon: Building, label: "Class", value: project.propertyType },
                  { icon: User, label: "Owner", value: project.developer || "—" },
                  { icon: Maximize2, label: "Total Area", value: project.totalArea ? formatArea(project.totalArea) : "—" },
                  { icon: Maximize2, label: "GLA", value: project.minUnitSize ? formatArea(project.minUnitSize) : "—" },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="bg-[var(--brand-warm)] rounded-xl p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">{label}</p>
                    </div>
                    <p className="text-sm font-semibold text-[var(--brand-navy)]">{value}</p>
                  </div>
                ))}
              </div>

              {/* Rent price */}
              {!!project.rentPricePerSqm && project.rentPricePerSqm > 0 && (
                <div className="flex items-center justify-between p-4 bg-[var(--brand-navy)]/5 rounded-xl border border-[var(--brand-navy)]/10">
                  <span className="text-sm font-medium text-[var(--brand-navy)]">Asking Rent Rate</span>
                  <span className="text-xl font-bold text-[var(--brand-navy)]">€{project.rentPricePerSqm} <span className="text-sm font-normal text-muted-foreground">/ sqm / mo</span></span>
                </div>
              )}

              {/* Description */}
              {project.description && (
                <div>
                  <h2 className="font-semibold text-base mb-2">About</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">{project.description}</p>
                </div>
              )}

              {/* Amenities */}
              {project.amenities.length > 0 && (
                <div>
                  <h2 className="font-semibold text-base mb-3">Amenities</h2>
                  <div className="flex flex-wrap gap-2">
                    {project.amenities.map(a => (
                      <span key={a} className="text-xs bg-[var(--brand-warm)] border border-border px-3 py-1 rounded-full">{a}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
