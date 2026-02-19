"use client";

import { useEffect, useRef, useState } from "react";
import type { Project } from "@/types";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { X, ExternalLink } from "lucide-react";

interface MapViewProps {
  projects: Project[];
  className?: string;
  selectedId?: string;
  onProjectSelect?: (project: Project | null) => void;
}

export function MapView({ projects, className, onProjectSelect }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) return;

    const validProjects = projects.filter((p) => p.latitude !== 0 && p.longitude !== 0);

    import("mapbox-gl").then(({ default: mapboxgl }) => {
      mapboxgl.accessToken = token;

      const map = new mapboxgl.Map({
        container: mapContainer.current!,
        style: "mapbox://styles/mapbox/light-v11",
        center: [24.105186, 56.946285],
        zoom: 13,
      });

      mapRef.current = map;

      map.on("load", () => {
        setMapLoaded(true);

        // Add projects as GeoJSON source
        map.addSource("projects", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: validProjects.map((p) => ({
              type: "Feature",
              geometry: { type: "Point", coordinates: [p.longitude, p.latitude] },
              properties: {
                id: p.id,
                name: p.name,
                type: p.propertyType,
                color: p.propertyType.includes("A") ? "#c8882a" :
                       p.propertyType.includes("B") ? "#0f1f3d" : "#6b7280",
              },
            })),
          },
        });

        // Add circle layer
        map.addLayer({
          id: "projects-circles",
          type: "circle",
          source: "projects",
          paint: {
            "circle-radius": 11,
            "circle-color": ["get", "color"],
            "circle-stroke-width": 2,
            "circle-stroke-color": "#ffffff",
            "circle-opacity": 0.9,
          },
        });

        // Hover effect
        map.addLayer({
          id: "projects-circles-hover",
          type: "circle",
          source: "projects",
          paint: {
            "circle-radius": 12,
            "circle-color": ["get", "color"],
            "circle-stroke-width": 2,
            "circle-stroke-color": "#ffffff",
            "circle-opacity": 0,
          },
        });

        // Click handler
        map.on("click", "projects-circles", (e) => {
          if (!e.features || !e.features[0]) return;
          const id = e.features[0].properties?.id;
          const project = validProjects.find((p) => p.id === id);
          if (project) {
            setSelectedProject(project);
            onProjectSelect?.(project);
          }
        });

        // Cursor
        map.on("mouseenter", "projects-circles", () => {
          map.getCanvas().style.cursor = "pointer";
          map.setPaintProperty("projects-circles", "circle-radius", 14);
        });
        map.on("mouseleave", "projects-circles", () => {
          map.getCanvas().style.cursor = "";
          map.setPaintProperty("projects-circles", "circle-radius", 8);
        });
      });
    });

    return () => {
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={cn("relative overflow-hidden border border-border", className)}>
      <div ref={mapContainer} className="w-full h-full min-h-[600px]" />

      {!mapLoaded && (
        <div className="absolute inset-0 bg-muted flex items-center justify-center">
          <div className="text-sm text-muted-foreground animate-pulse">Loading map...</div>
        </div>
      )}

      {mapLoaded && (
        <div className="absolute top-3 left-3 bg-white rounded-xl shadow-md border border-border p-3 text-xs space-y-1.5">
          <p className="font-semibold text-foreground mb-1">Building Class</p>
          {[
            { color: "#c8882a", label: "Class A" },
            { color: "#0f1f3d", label: "Class B" },
            { color: "#6b7280", label: "Class B/C" },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2">
              <span style={{ background: color }} className="w-3 h-3 rounded-full shrink-0 border border-white shadow-sm inline-block" />
              <span className="text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      )}

      {selectedProject && (
        <div className="absolute bottom-4 left-4 w-80 bg-white rounded-2xl shadow-2xl border border-border overflow-hidden">
          <button
            onClick={() => { setSelectedProject(null); onProjectSelect?.(null); }}
            className="absolute top-3 right-3 z-10 w-7 h-7 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
          <div className="relative h-48">
            {selectedProject.images[0] ? (
              <Image src={selectedProject.images[0].url} alt={selectedProject.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="font-display text-4xl text-muted-foreground/30">{selectedProject.name.charAt(0)}</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-3 left-3">
              <span className="text-xs font-semibold text-white bg-[var(--brand-gold)] px-2.5 py-1 rounded-full">{selectedProject.propertyType}</span>
            </div>
          </div>
          <div className="p-4 space-y-3">
            <h3 className="font-display text-xl text-[var(--brand-navy)] leading-tight">{selectedProject.name}</h3>
            <div className="space-y-1.5">
              {selectedProject.address && (
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="shrink-0 mt-0.5">📍</span>
                  <span>{selectedProject.address}, {selectedProject.district}</span>
                </div>
              )}
              {selectedProject.totalArea > 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>📐</span>
                  <span>{selectedProject.totalArea.toLocaleString()} sqm total area</span>
                </div>
              )}
              {selectedProject.minUnitSize > 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>🏢</span>
                  <span>{selectedProject.minUnitSize.toLocaleString()} sqm GLA</span>
                </div>
              )}
            </div>
            <Link
              href={`/projects/${selectedProject.slug}`}
              className="flex items-center justify-center gap-1.5 w-full text-sm font-medium bg-[var(--brand-navy)] text-white py-2.5 rounded-xl hover:bg-[var(--brand-navy)]/90 transition-colors"
            >
              View Full Details <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
