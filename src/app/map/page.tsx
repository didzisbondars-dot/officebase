"use client";

import { useState, useEffect } from "react";
import { MapView } from "@/components/map/MapView";
import { CompareProvider } from "@/components/compare/CompareContext";
import type { Project } from "@/types";
import { Loader2, Building2 } from "lucide-react";
import { cn, getStatusDot } from "@/lib/utils";

const STATUS_LEGEND = [
  { label: "Available", color: "bg-emerald-500" },
  { label: "Under Construction", color: "bg-amber-500" },
  { label: "Coming Soon", color: "bg-blue-500" },
  { label: "Sold Out", color: "bg-red-500" },
];

export default function MapPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data) => {
        setProjects(data.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <CompareProvider>
      <div className="flex flex-col h-screen pt-16">
        {/* Header bar */}
        <div className="bg-[var(--brand-navy)] px-4 sm:px-8 py-3 flex items-center justify-between">
          <h1 className="font-display text-lg text-white">Map View</h1>
          <div className="flex items-center gap-4">
            {STATUS_LEGEND.map((s) => (
              <div key={s.label} className="flex items-center gap-1.5 text-xs text-white/70">
                <span className={cn("w-2 h-2 rounded-full", s.color)} />
                <span className="hidden sm:inline">{s.label}</span>
              </div>
            ))}
          </div>
          <div className="text-xs text-white/50">
            {loading ? "Loading..." : `${projects.length} projects`}
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          {loading ? (
            <div className="absolute inset-0 bg-muted flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 text-[var(--brand-navy)] animate-spin" />
                <p className="text-sm text-muted-foreground">Loading projects...</p>
              </div>
            </div>
          ) : projects.length === 0 ? (
            <div className="absolute inset-0 bg-muted flex flex-col items-center justify-center gap-3">
              <Building2 className="w-10 h-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No projects with coordinates found.</p>
              <p className="text-xs text-muted-foreground">
                Add Latitude and Longitude fields to your Airtable records.
              </p>
            </div>
          ) : (
            <MapView projects={projects} className="w-full h-full rounded-none border-0" />
          )}
        </div>
      </div>
    </CompareProvider>
  );
}
