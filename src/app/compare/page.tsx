'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, X } from "lucide-react";
import { getProjectsByIds } from "@/lib/airtable";
import type { Project } from "@/types";

export default function ComparePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("compare-projects");
    if (saved) {
      const ids = JSON.parse(saved);
      getProjectsByIds(ids).then(setProjects).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const removeItem = (id: string) => {
    const newProjects = projects.filter(p => p.id !== id);
    setProjects(newProjects);
    localStorage.setItem("compare-projects", JSON.stringify(newProjects.map(p => p.id)));
  };

  if (loading) return <div className="min-h-screen pt-24 flex items-center justify-center">Loading comparison...</div>;
  if (!projects.length) return (
    <div className="min-h-screen pt-24 flex flex-col items-center justify-center gap-4">
      <p className="text-muted-foreground">No projects selected for comparison.</p>
      <Link href="/projects" className="text-sm text-[var(--brand-navy)] hover:underline">← Back to Projects</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--brand-warm)] pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/projects" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />Back
          </Link>
          <h1 className="text-3xl font-bold">Compare Projects ({projects.length}/5)</h1>
        </div>

        <div className="overflow-x-auto pb-6">
          <div className="min-w-[1200px] grid grid-cols-5 gap-4">
            {projects.map((project) => (
              <div key={project.id} className="bg-white rounded-xl shadow-sm border overflow-hidden relative">
                <button 
                  onClick={() => removeItem(project.id)}
                  className="absolute top-2 right-2 p-1 bg-white/80 rounded-full hover:bg-white z-10"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="aspect-video relative overflow-hidden">
                  {project.images?.[0] && (
                    <img src={project.images[0].url} alt={project.name} className="object-cover w-full h-full" />
                  )}
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <h3 className="font-bold text-lg leading-tight mb-1">{project.name}</h3>
                    <p className="text-sm text-muted-foreground">{project.developer}</p>
                  </div>
                  <div className="space-y-2 text-sm border-t pt-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <span className="font-medium text-right">{project.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type</span>
                      <span className="font-medium text-right">{project.propertyType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Area</span>
                      <span className="font-medium text-right">{project.totalArea} m²</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">District</span>
                      <span className="font-medium text-right">{project.district}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
