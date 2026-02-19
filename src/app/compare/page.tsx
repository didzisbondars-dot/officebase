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
    // Reverting to the original key 'compare'
    const saved = localStorage.getItem("compare");
    if (saved) {
      const ids = JSON.parse(saved);
      if (ids.length > 0) {
        getProjectsByIds(ids)
          .then(setProjects)
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const removeItem = (id: string) => {
    const newProjects = projects.filter(p => p.id !== id);
    setProjects(newProjects);
    localStorage.setItem("compare", JSON.stringify(newProjects.map(p => p.id)));
  };

  if (loading) return <div className="min-h-screen pt-24 flex items-center justify-center">Loading comparison...</div>;

  if (!projects.length) return (
    <div className="min-h-screen pt-24 flex flex-col items-center justify-center gap-4">
      <p className="text-muted-foreground">No projects selected.</p>
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
          <h1 className="text-3xl font-bold">Compare Projects</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
              <div className="p-6 space-y-4">
                <h3 className="font-bold text-xl">{project.name}</h3>
                <div className="space-y-2 text-sm border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span className="font-medium">{project.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">District</span>
                    <span className="font-medium">{project.district}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Area</span>
                    <span className="font-medium">{project.totalArea} m²</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
