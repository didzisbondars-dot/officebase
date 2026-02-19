"use client";

import { useEffect, useRef, useState, useCallback } from "react";
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

export function MapView({ projects, className, selectedId, onProjectSelect }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
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

        const validProjects = projects.filter((p) => p.latitude !== 0 && p.longitude !== 0);
        
        validProjects.forEach((project) => {
          const color =
            project.propertyType.includes("A") ? "#c8882a" :
            project.propertyType.includes("B") ? "#0f1f3d" : "#6b7280";

          const el = document.createElement("div");
          el.style.cssText = `
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: ${color};
            border: 2px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.4);
            cursor: pointer;
            transition: transform 0.15s, box-shadow 0.15s;
          `;

          el.addEventListener("mouseenter", () => {
            el.style.transform = "scale(1.8)";
            el.style.boxShadow = "0 4px 12px rgba(0,0,0,0.5)";
          });
          el.addEventListener("mouseleave", () => {
            el.style.transform = "scale(1)";
            el.style.boxShadow = "0 2px 6px rgba(0,0,0,0.4)";
          });
          el.addEventListener("click", () => handleSelect(project));

          const marker = new mapboxgl.Marker({ element: el })
            .setLngLat([project.longitude, project.latitude])
            .addTo(map);
          
          markersRef.current.push(marker);
        });
      });
    });

    return () => {
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
  }, [projects, handleSelect]);

  useEffect(() => {
    if (!mapRef.current || !selectedId) return;
    const project = projects.find((p) => p.id === selectedId);
    if (project?.latitude && project?.longitude) {
      mapRef.current.flyTo({ center: [project.longitude, project.latitude], zoom: 16, duration: 1000 });
      setSelectedProject(project);
    }
  }, [selectedId, projects]);

  return (
    <div className={cn("relative rounded-2xl overflow-hidden border border-border", className)}>
      <div ref={mapContainer} className="w-full h-full min-h-[500px]" />

      {!mapLoaded && (
        <div className="absolute inset-0 bg-muted flex items-center justify-center">
          <div className="text-sm text-muted-foreground animate-pulse">Loading map...</div>
        </div>
      )}

      {mapLoaded && (
        <div className="absolute top-3 left-3 bg-white rounded-xl shadow-md border border-border p-3 text-xs space-y-1.5">
          <p className="font-semibold text-foreground mb-2">Building Class</p>
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
        <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-72 bg-white rounded-xl shadow-2xl border border-border overflow-hidden">
          <button onClick={() => handleSelect(null)} className="absolute top-2 right-2 z-10 w-6 h-6 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center transition-colors">
            <X className="w-3.5 h-3.5 text-white" />
          </button>
          {selectedProject.images[0] && (
            <div className="relative h-36">
              <Image src={selectedProject.images[0].url} alt={selectedProject.name} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
          )}
          <div className="p-3">
            <span className="text-xs font-medium text-[var(--brand-gold)]">{selectedProject.propertyType}</span>
            <h3 className="font-display text-base text-foreground mb-0.5">{selectedProject.name}</h3>
            <p className="text-xs text-muted-foreground mb-3">{selectedProject.address}</p>
            <Link href={`/projects/${selectedProject.slug}`} className="flex items-center justify-center gap-1.5 w-full text-xs font-medium bg-[var(--brand-navy)] text-white py-2 rounded-lg hover:bg-[var(--brand-navy)]/90 transition-colors">
              View Details <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
