"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { Project } from "@/types";
import { formatCurrency, cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { X, ExternalLink } from "lucide-react";

interface MapViewProps {
  projects: Project[];
  className?: string;
  selectedId?: string;
  onProjectSelect?: (project: Project | null) => void;
}

export function MapView({ projects, className, selectedId, onProjectSelect }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const handleSelect = useCallback((project: Project | null) => {
    setSelectedProject(project);
    onProjectSelect?.(project);
  }, [onProjectSelect]);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) return;

    import("mapbox-gl").then((mapboxgl) => {
      mapboxgl.default.accessToken = token;
      const validProjects = projects.filter((p) => p.latitude && p.longitude);
      const center = validProjects.length > 0
        ? [validProjects[0].longitude, validProjects[0].latitude] as [number, number]
        : [24.1052, 56.9496] as [number, number];

      const map = new mapboxgl.default.Map({
        container: mapContainer.current!,
        style: "mapbox://styles/mapbox/light-v11",
        center,
        zoom: 12,
      });
      mapRef.current = map;

      map.on("load", () => {
        setMapLoaded(true);
        validProjects.forEach((project) => {
          const statusColor =
            project.status === "Available" ? "#10b981" :
            project.status === "Under Construction" ? "#f59e0b" :
            project.status === "Coming Soon" ? "#3b82f6" : "#6b7280";

          const el = document.createElement("div");
          el.style.cssText = `width:14px;height:14px;border-radius:50%;background:${statusColor};border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);cursor:pointer;transition:transform 0.15s;`;
          el.addEventListener("mouseenter", () => { el.style.transform = "scale(1.5)"; });
          el.addEventListener("mouseleave", () => { el.style.transform = "scale(1)"; });
          el.addEventListener("click", () => handleSelect(project));
          new mapboxgl.default.Marker({ element: el }).setLngLat([project.longitude, project.latitude]).addTo(map);
        });
      });
    });

    return () => { if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; } };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !selectedId) return;
    const project = projects.find((p) => p.id === selectedId);
    if (project?.latitude && project?.longitude) {
      mapRef.current.flyTo({ center: [project.longitude, project.latitude], zoom: 15, duration: 1000 });
      setSelectedProject(project);
    }
  }, [selectedId, projects]);

  return (
    <div className={cn("relative rounded-2xl overflow-hidden border border-border", className)}>
      <div ref={mapContainer} className="w-full h-full" />
      {!mapLoaded && (
        <div className="absolute inset-0 bg-muted flex items-center justify-center">
          <div className="text-sm text-muted-foreground animate-pulse">Loading map...</div>
        </div>
      )}
      {mapLoaded && (
        <div className="absolute top-3 left-3 bg-white rounded-xl shadow-md border border-border p-3 text-xs space-y-1.5">
          {[
            { color: "#10b981", label: "Available" },
            { color: "#f59e0b", label: "Under Construction" },
            { color: "#3b82f6", label: "Coming Soon" },
            { color: "#6b7280", label: "Other" },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2">
              <span style={{ background: color }} className="w-3 h-3 rounded-full shrink-0" />
              <span className="text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      )}
      {selectedProject && (
        <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-72 bg-white rounded-xl shadow-2xl border border-border overflow-hidden">
          <button onClick={() => handleSelect(null)} className="absolute top-2 right-2 z-10 w-6 h-6 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center transition-colors">
            <X className="w-3.5 h-3.5 text-white" />
          </button>
          {selectedProject.images[0] && (
            <div className="relative h-36">
              <Image src={selectedProject.images[0].url} alt={selectedProject.name} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          )}
          <div className="p-3">
            <h3 className="font-display text-base text-foreground mb-0.5">{selectedProject.name}</h3>
            <p className="text-xs text-muted-foreground mb-2">{selectedProject.district}, {selectedProject.city}</p>
            <div className="flex items-center justify-between">
              <div>
                {(selectedProject.salePricePerSqm || selectedProject.rentPricePerSqm) && (
                  <div className="text-sm font-semibold text-[var(--brand-navy)]">
                    {formatCurrency(selectedProject.salePricePerSqm || selectedProject.rentPricePerSqm!)}
                    <span className="text-xs font-normal text-muted-foreground ml-1">/ sqm</span>
                  </div>
                )}
              </div>
              <Link href={`/projects/${selectedProject.slug}`} className="flex items-center gap-1 text-xs font-medium text-[var(--brand-navy)] hover:text-[var(--brand-gold)] transition-colors">
                View Details <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
