'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, X } from "lucide-react";
import { getCompareProjects } from "./actions";

export default function ComparePage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("compare");
    if (saved) {
      try {
        const ids = JSON.parse(saved);
        if (Array.isArray(ids) && ids.length > 0) {
          // Calls our new secure Server Action
          getCompareProjects(ids)
            .then(data => {
              if (data) setProjects(data);
            })
            .catch(err => console.error("Action error:", err))
            .catch(err => console.error("Compare fetch error:", err)).finally(() => setLoading(false));
        } else {
          setLoading(false);
        }
      } catch (e) {
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

  if (loading) return <div className="min-h-screen pt-24 flex items-center justify-center font-medium">Loading comparison...</div>;

  if (!projects || projects.length === 0) return (
    <div className="min-h-screen pt-24 flex flex-col items-center justify-center gap-4">
      <p className="text-slate-500 text-lg">No projects selected for comparison.</p>
      <Link href="/projects" className="px-6 py-2 bg-[#1B2B44] text-white rounded-lg hover:opacity-90 transition-opacity">
        Back to Projects
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFCFB] pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/projects" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900">
            <ArrowLeft className="w-4 h-4" />Back
          </Link>
          <h1 className="text-3xl font-bold text-[#1B2B44]">Compare ({projects.length}/3)</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative flex flex-col">
              <button 
                onClick={() => removeItem(project.id)}
                className="absolute top-3 right-3 p-1.5 bg-white/90 rounded-full hover:bg-white z-10 shadow-sm border border-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="aspect-[4/3] relative overflow-hidden bg-slate-100">
                {project.images?.[0]?.url ? (
                  <img src={project.images[0].url} alt={project.name || "Project"} className="object-cover w-full h-full" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 italic">No Image</div>
                )}
              </div>

              <div className="p-6 flex-grow flex flex-col">
                <div className="mb-6">
                  <h3 className="font-bold text-xl leading-tight mb-1 text-[#1B2B44]">{project.name || "Unnamed Project"}</h3>
                  <p className="text-sm text-slate-500">{project.developer || "Developer N/A"}</p>
                </div>
                
                <div className="space-y-4 text-sm border-t border-slate-100 pt-6 mt-auto">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Status</span>
                    <span className="font-medium mt-0.5 text-slate-900">{project.status || "N/A"}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">District</span>
                    <span className="font-medium mt-0.5 text-slate-900">{project.district || "N/A"}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Total Area</span>
                    <span className="font-medium mt-0.5 text-slate-900">{project.totalArea ? `${project.totalArea} m²` : "Contact for details"}</span>
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
