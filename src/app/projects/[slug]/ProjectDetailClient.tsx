"use client";

import Image from "next/image";
import { LeadForm } from "@/components/projects/LeadForm";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, MapPin, Building, Maximize2, Calendar, User, ChevronLeft, ChevronRight } from "lucide-react";
import type { Project } from "@/types";
import { formatArea, formatCurrency, getStatusColor, getStatusDot, cn } from "@/lib/utils";

export default function ProjectDetailClient({ project }: { project: Project }) {
  const [imgIndex, setImgIndex] = useState(0);
  const images = project.images;

  return (
    <div className="min-h-screen bg-[var(--brand-warm)] pt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/projects" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Projects
        </Link>

        {/* Main image */}
        {images.length > 0 && (
          <div className="mb-4">
            <div className="relative h-96 rounded-2xl overflow-hidden bg-muted group">
              <Image src={images[imgIndex].url} alt={project.name} fill className="object-cover transition-all duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setImgIndex((i) => (i - 1 + images.length) % images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setImgIndex((i) => (i + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full">
                    {imgIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setImgIndex(i)}
                    className={cn(
                      "relative w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all",
                      i === imgIndex ? "border-[var(--brand-gold)]" : "border-transparent opacity-60 hover:opacity-100"
                    )}
                  >
                    <Image src={img.url} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main info */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <span className={cn("inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border mb-3", getStatusColor(project.status))}>
                <span className={cn("w-1.5 h-1.5 rounded-full", getStatusDot(project.status))} />
                {project.status}
              </span>
              <h1 className="font-display text-4xl text-[var(--brand-navy)] mb-2">{project.name}</h1>
              <p className="text-muted-foreground flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />{project.address}{project.district ? `, ${project.district}` : ""}, {project.city}
              </p>
            </div>

            {project.description && (
              <div>
                <h2 className="font-semibold text-lg mb-2">About</h2>
                <p className="text-muted-foreground leading-relaxed">{project.description}</p>
              </div>
            )}

            {project.amenities.length > 0 && (
              <div>
                <h2 className="font-semibold text-lg mb-3">Amenities</h2>
                <div className="flex flex-wrap gap-2">
                  {project.amenities.map(a => (
                    <span key={a} className="text-xs bg-white border border-border px-3 py-1 rounded-full">{a}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-border p-5 space-y-4">
              <h2 className="font-semibold">Property Details</h2>
              {[
                { icon: Building, label: "Class", value: project.propertyType },
                { icon: User, label: "Owner", value: project.developer },
                { icon: Maximize2, label: "Total Area", value: project.totalArea ? formatArea(project.totalArea) : null },
                { icon: Maximize2, label: "GLA", value: project.minUnitSize ? formatArea(project.minUnitSize) : null },
                { icon: Building, label: "Floors", value: project.floors ? `${project.floors} floors` : null },
                { icon: Calendar, label: "Completion", value: project.completionDate || null },
              ].filter(row => row.value).map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <Icon className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-sm font-medium">{value}</p>
                  </div>
                </div>
              ))}

              {project.salePricePerSqm && (
                <div className="pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground">Sale Price / sqm</p>
                  <p className="text-lg font-semibold text-[var(--brand-navy)]">{formatCurrency(project.salePricePerSqm)}</p>
                </div>
              )}
              {project.rentPricePerSqm && (
                <div className="pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground">Rent / sqm / month</p>
                  <p className="text-lg font-semibold text-[var(--brand-navy)]">{formatCurrency(project.rentPricePerSqm)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Lead form */}
          <LeadForm projectName={project.name} projectId={project.id} />
        </div>
      </div>
    </div>
  );
}
