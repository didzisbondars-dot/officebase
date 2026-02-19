"use client";

import { useState, useEffect, useCallback } from "react";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { SearchFiltersPanel } from "@/components/projects/SearchFilters";
import { MapView } from "@/components/map/MapView";
import { CompareProvider } from "@/components/compare/CompareContext";
import { CompareBar } from "@/components/compare/CompareBar";
import type { Project, SearchFilters } from "@/types";
import { Building2, LayoutGrid, List, Map, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type ViewMode = "grid" | "list" | "split";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [cities, setCities] = useState<string[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>();

  const fetchProjects = useCallback(async (filters: SearchFilters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.query) params.set("q", filters.query);
      if (filters.city) params.set("city", filters.city);
      if (filters.status) filters.status.forEach((s) => params.append("status", s));
      if (filters.propertyType) filters.propertyType.forEach((t) => params.append("type", t));
      if (filters.minArea) params.set("minArea", String(filters.minArea));
      if (filters.maxArea) params.set("maxArea", String(filters.maxArea));

      const res = await fetch(`/api/projects?${params.toString()}`);
      const data = await res.json();
      setProjects(data.data || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch cities for dropdown
  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data) => {
        const allCities = [
          ...new Set((data.data as Project[]).map((p) => p.city).filter(Boolean)),
        ].sort();
        setCities(allCities as string[]);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <CompareProvider>
      <div className="min-h-screen bg-[var(--brand-warm)]">
        {/* Page header */}
        <div className="bg-[var(--brand-navy)] pt-24 pb-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-display text-4xl text-white mb-2">Office Projects</h1>
            <p className="text-white/60 text-sm">
              {loading ? "Loading..." : `${total} project${total !== 1 ? "s" : ""} available`}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters */}
          <SearchFiltersPanel
            onFiltersChange={fetchProjects}
            cities={cities}
            className="mb-6"
          />

          {/* View mode toggle */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              {loading ? (
                <span className="flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Loading projects...
                </span>
              ) : (
                `Showing ${projects.length} project${projects.length !== 1 ? "s" : ""}`
              )}
            </p>

            <div className="flex items-center gap-1 bg-white border border-border rounded-lg p-1">
              {(
                [
                  { mode: "grid" as ViewMode, icon: LayoutGrid, label: "Grid" },
                  { mode: "list" as ViewMode, icon: List, label: "List" },
                  { mode: "split" as ViewMode, icon: Map, label: "Map" },
                ] as const
              ).map(({ mode, icon: Icon, label }) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                    viewMode === mode
                      ? "bg-[var(--brand-navy)] text-white"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          {viewMode === "split" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[700px]">
              {/* List side */}
              <div className="overflow-y-auto space-y-4 pr-2">
                {loading ? (
                  <ProjectSkeleton count={4} />
                ) : projects.length === 0 ? (
                  <EmptyState />
                ) : (
                  projects.map((project) => (
                    <div
                      key={project.id}
                      onClick={() => setSelectedProjectId(project.id)}
                      className={cn(
                        "cursor-pointer rounded-2xl transition-all",
                        selectedProjectId === project.id
                          ? "ring-2 ring-[var(--brand-navy)]"
                          : ""
                      )}
                    >
                      <ProjectCard project={project} />
                    </div>
                  ))
                )}
              </div>

              {/* Map side */}
              <div className="sticky top-6">
                <MapView
                  projects={projects}
                  className="h-full"
                  selectedId={selectedProjectId}
                  onProjectSelect={(p) => setSelectedProjectId(p?.id)}
                />
              </div>
            </div>
          ) : loading ? (
            <div
              className={cn(
                "grid gap-6",
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1"
              )}
            >
              <ProjectSkeleton count={6} />
            </div>
          ) : projects.length === 0 ? (
            <EmptyState />
          ) : (
            <div
              className={cn(
                "grid gap-6",
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1 max-w-3xl"
              )}
            >
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </div>
      <CompareBar />
    </CompareProvider>
  );
}

function ProjectSkeleton({ count = 3 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl overflow-hidden border border-border">
          <div className="skeleton h-52" />
          <div className="p-4 space-y-3">
            <div className="skeleton h-3 w-20 rounded" />
            <div className="skeleton h-5 w-3/4 rounded" />
            <div className="skeleton h-3 w-1/2 rounded" />
            <div className="skeleton h-10 rounded" />
          </div>
        </div>
      ))}
    </>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-20 bg-white rounded-2xl border border-border">
      <Building2 className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
      <h3 className="font-display text-lg text-foreground mb-1">No projects found</h3>
      <p className="text-sm text-muted-foreground">
        Try adjusting your filters or search terms.
      </p>
    </div>
  );
}
