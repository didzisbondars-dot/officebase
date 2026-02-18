"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  ArrowLeft,
  MapPin,
  Maximize2,
  Building,
  Calendar,
} from "lucide-react";
import type { Project } from "@/types";
import {
  formatCurrency,
  formatArea,
  formatDate,
  getStatusColor,
  getStatusDot,
  cn,
} from "@/lib/utils";
import { CompareProvider } from "@/components/compare/CompareContext";

export default function ComparePage() {
  const searchParams = useSearchParams();
  const idsParam = searchParams.get("ids");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!idsParam) {
      setLoading(false);
      return;
    }

    const ids = idsParam.split(",").filter(Boolean);
    if (!ids.length) {
      setLoading(false);
      return;
    }

    // Fetch all projects and filter by IDs client-side
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data) => {
        const all: Project[] = data.data || [];
        const filtered = ids
          .map((id) => all.find((p) => p.id === id))
          .filter(Boolean) as Project[];
        setProjects(filtered);
      })
      .finally(() => setLoading(false));
  }, [idsParam]);

  const allAmenities = [...new Set(projects.flatMap((p) => p.amenities))].sort();
  const allCerts = [...new Set(projects.flatMap((p) => p.certifications))].sort();

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-muted-foreground">Loading comparison...</div>
      </div>
    );
  }

  if (!projects.length) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center gap-4">
        <p className="text-lg text-muted-foreground">No projects selected for comparison.</p>
        <Link href="/projects" className="text-sm text-[var(--brand-navy)] hover:underline">
          ← Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <CompareProvider>
      <div className="min-h-screen bg-[var(--brand-warm)] pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/projects"
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Projects
            </Link>
            <h1 className="font-display text-3xl text-[var(--brand-navy)]">
              Compare Projects
            </h1>
          </div>

          {/* Comparison table */}
          <div className="bg-white rounded-2xl border border-border overflow-hidden">
            {/* Project headers */}
            <div
              className="grid border-b border-border"
              style={{ gridTemplateColumns: `200px repeat(${projects.length}, 1fr)` }}
            >
              <div className="p-5 bg-muted/40" />
              {projects.map((project) => (
                <div key={project.id} className="p-5 border-l border-border">
                  <div className="relative h-32 rounded-xl overflow-hidden mb-3 bg-muted">
                    {project.images[0] ? (
                      <Image
                        src={project.images[0].url}
                        alt={project.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted to-secondary">
                        <span className="font-display text-3xl text-muted-foreground/30">
                          {project.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="mb-1">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border",
                        getStatusColor(project.status)
                      )}
                    >
                      <span className={cn("w-1.5 h-1.5 rounded-full", getStatusDot(project.status))} />
                      {project.status}
                    </span>
                  </div>
                  <h3 className="font-display text-lg text-foreground">{project.name}</h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" />
                    {project.district}, {project.city}
                  </p>
                  <Link
                    href={`/projects/${project.slug}`}
                    className="inline-block mt-2 text-xs text-[var(--brand-navy)] hover:underline"
                  >
                    View Details →
                  </Link>
                </div>
              ))}
            </div>

            {/* Specs rows */}
            {[
              {
                label: "Property Type",
                render: (p: Project) => p.propertyType,
                icon: Building,
              },
              {
                label: "Total Area",
                render: (p: Project) => formatArea(p.totalArea),
                icon: Maximize2,
              },
              {
                label: "Unit Sizes",
                render: (p: Project) => `${p.minUnitSize}–${p.maxUnitSize} sqm`,
                icon: Maximize2,
              },
              {
                label: "Floors",
                render: (p: Project) => p.floors || "—",
                icon: Building,
              },
              {
                label: "Completion",
                render: (p: Project) => formatDate(p.completionDate),
                icon: Calendar,
              },
              {
                label: "Sale Price / sqm",
                render: (p: Project) =>
                  p.salePricePerSqm
                    ? formatCurrency(p.salePricePerSqm)
                    : "—",
              },
              {
                label: "Rent / sqm / mo",
                render: (p: Project) =>
                  p.rentPricePerSqm
                    ? formatCurrency(p.rentPricePerSqm)
                    : "—",
              },
              {
                label: "Developer",
                render: (p: Project) => p.developer,
              },
            ].map((row) => (
              <div
                key={row.label}
                className="grid border-b border-border hover:bg-muted/20 transition-colors"
                style={{ gridTemplateColumns: `200px repeat(${projects.length}, 1fr)` }}
              >
                <div className="p-4 flex items-center gap-2 text-sm font-medium text-muted-foreground bg-muted/20">
                  {row.label}
                </div>
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="p-4 border-l border-border text-sm text-foreground flex items-center"
                  >
                    {row.render(project)}
                  </div>
                ))}
              </div>
            ))}

            {/* Amenities */}
            {allAmenities.length > 0 && (
              <>
                <div
                  className="grid border-b border-border bg-muted/40"
                  style={{ gridTemplateColumns: `200px repeat(${projects.length}, 1fr)` }}
                >
                  <div className="p-4 text-sm font-semibold text-foreground col-span-full">
                    Amenities
                  </div>
                </div>
                {allAmenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="grid border-b border-border hover:bg-muted/20 transition-colors"
                    style={{ gridTemplateColumns: `200px repeat(${projects.length}, 1fr)` }}
                  >
                    <div className="p-4 text-sm text-muted-foreground bg-muted/20">{amenity}</div>
                    {projects.map((project) => (
                      <div
                        key={project.id}
                        className="p-4 border-l border-border flex items-center"
                      >
                        {project.amenities.includes(amenity) ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-muted-foreground/30" />
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </>
            )}

            {/* Certifications */}
            {allCerts.length > 0 && (
              <>
                <div
                  className="grid border-b border-border bg-muted/40"
                  style={{ gridTemplateColumns: `200px repeat(${projects.length}, 1fr)` }}
                >
                  <div className="p-4 text-sm font-semibold text-foreground col-span-full">
                    Certifications
                  </div>
                </div>
                {allCerts.map((cert) => (
                  <div
                    key={cert}
                    className="grid border-b border-border hover:bg-muted/20 transition-colors"
                    style={{ gridTemplateColumns: `200px repeat(${projects.length}, 1fr)` }}
                  >
                    <div className="p-4 text-sm text-muted-foreground bg-muted/20">{cert}</div>
                    {projects.map((project) => (
                      <div
                        key={project.id}
                        className="p-4 border-l border-border flex items-center"
                      >
                        {project.certifications.includes(cert) ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-muted-foreground/30" />
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </CompareProvider>
  );
}
