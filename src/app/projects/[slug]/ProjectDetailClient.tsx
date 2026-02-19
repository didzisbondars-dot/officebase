"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MapPin, Building, Maximize2, Calendar, User } from "lucide-react";
import type { Project } from "@/types";
import { formatArea, formatCurrency, getStatusColor, getStatusDot, cn } from "@/lib/utils";

export default function ProjectDetailClient({ project }: { project: Project }) {
  return (
    <div className="min-h-screen bg-[var(--brand-warm)] pt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/projects" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Projects
        </Link>

        {/* Image */}
        {project.images.length > 0 && (
          <div className="relative h-72 rounded-2xl overflow-hidden mb-8 bg-muted">
            <Image src={project.images[0].url} alt={project.name} fill className="object-cover" />
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
                { icon: Maximize2, label: "Total Area", value: project.totalArea ? formatArea(project.totalArea) : "—" },
                { icon: Maximize2, label: "GLA", value: project.minUnitSize ? formatArea(project.minUnitSize) : "—" },
                { icon: Building, label: "Floors", value: project.floors ? `${project.floors} floors` : "—" },
                { icon: Calendar, label: "Completion", value: project.completionDate || "—" },
              ].map(({ icon: Icon, label, value }) => value && value !== "—" ? (
                <div key={label} className="flex items-start gap-3">
                  <Icon className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-sm font-medium">{value}</p>
                  </div>
                </div>
              ) : null)}

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
        </div>
      </div>
    </div>
  );
}
