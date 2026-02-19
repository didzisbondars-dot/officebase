'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, X } from "lucide-react";

interface SimpleProject {
  id: string;
  name: string;
  status?: string;
  district?: string;
  totalArea?: number;
}

export default function ComparePage() {
  const [projects, setProjects] = useState<SimpleProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("compare-projects");
    if (saved) {
      try {
        const ids: string[] = JSON.parse(saved);
        fetch('/api/projects')
          .then(res => res.json())
          .then((allProjects: SimpleProject[]) => {
            const filtered = allProjects.filter((p: SimpleProject) => ids.includes(p.id));
            setProjects(filtered);
          })
          .catch(() => setLoading(false))
          .finally(() => setLoading(false));
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
    localStorage.setItem("compare-projects", JSON.stringify(newProjects.map(p => p.id)));
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading comparison...</div>;

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/projects" className="flex items-center gap-1 text-sm text-slate-500 hover:text-black">
            <ArrowLeft size={16} /> Back to Projects
          </Link>
          <h1 className="text-2xl font-bold">Compare ({projects.length}/5)</h1>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border">
            <p className="text-slate-500">No projects selected.</p>
          </div>
        ) : (
          <div className="overflow-x-auto pb-4">
            <div className="min-w-[1000px] grid grid-cols-5 gap-4">
              {projects.map((project) => (
                <div key={project.id} className="bg-white border rounded-lg p-4 relative flex flex-col shadow-sm">
                  <button 
                    onClick={() => removeItem(project.id)}
                    className="absolute top-2 right-2 p-1 hover:bg-slate-100 rounded transition-colors"
                  >
                    <X size={14} />
                  </button>
                  <h3 className="font-bold text-lg mb-4 pr-6 leading-tight min-h-[3rem] line-clamp-2">
                    {project.name}
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="border-t pt-2">
                      <span className="block text-slate-400 text-[10px] uppercase font-bold tracking-wider">Status</span>
                      <span className="font-medium">{project.status || 'N/A'}</span>
                    </div>
                    <div className="border-t pt-2">
                      <span className="block text-slate-400 text-[10px] uppercase font-bold tracking-wider">District</span>
                      <span className="font-medium">{project.district || 'N/A'}</span>
                    </div>
                    <div className="border-t pt-2">
                      <span className="block text-slate-400 text-[10px] uppercase font-bold tracking-wider">Area</span>
                      <span className="font-medium">{project.totalArea ? `${project.totalArea} m²` : 'Contact us'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
