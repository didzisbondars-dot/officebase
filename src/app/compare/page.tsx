"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MapPin, CheckCircle2, XCircle } from "lucide-react";
import type { Project } from "@/types";
import { formatArea, getStatusColor, getStatusDot, cn } from "@/lib/utils";
import { CompareProvider } from "@/components/compare/CompareContext";

function CompareContent() {
  const searchParams = useSearchParams();
  const idsParam = searchParams.get("ids");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!idsParam) { setLoading(false); return; }
    const ids = idsParam.split(",").filter(Boolean);
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data) => {
        const all: Project[] = data.data || [];
        setProjects(ids.map((id) => all.find((p) => p.id === id)).filter(Boolean) as Project[]);
      })
      .finally(() => setLoading(false));
  }, [idsParam]);

  const rows = [
    { label: "Property Type", fn: (p: Project) => p.propertyType },
    { label: "Total Area", fn: (p: Project) => p.totalArea ? formatArea(p.totalArea) : "—" },
    { label: "GLA", fn: (p: Project) => p.minUnitSize ? formatArea(p.minUnitSize) : "—" },
    { label: "Owner/Developer", fn: (p: Project) => p.developer || "—" },
    { label: "District", fn: (p: Project) => p.district || "—" },
    { label: "Address", fn: (p: Project) => p.address || "—" },
  ];

  if (loading) return <div className="min-h-screen pt-24 flex items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>;
  if (!projects.length) return (
    <div className="min-h-screen pt-24 flex flex-col items-center justify-center gap-4">
      <p className="text-muted-foreground">No projects selected for comparison.</p>
      <Link href="/projects" className="px-5 py-2 bg-[var(--brand-navy)] text-white rounded-lg text-sm">Back to Projects</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--brand-warm)] pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/projects" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />Back
          </Link>
          <h1 className="font-display text-2xl sm:text-3xl text-[var(--brand-navy)]">Compare Projects</h1>
        </div>

        {/* Mobile: stacked cards */}
        <div className="block lg:hidden space-y-6">
          {projects.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl border border-border overflow-hidden">
              <div className="relative h-48">
                {p.images[0] ? <Image src={p.images[0].url} alt={p.name} fill className="object-cover" /> : <div className="w-full h-full bg-muted" />}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <span className={cn("inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border", getStatusColor(p.status))}>
                    <span className={cn("w-1.5 h-1.5 rounded-full", getStatusDot(p.status))} />{p.status}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-display text-xl mb-1">{p.name}</h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mb-4"><MapPin className="w-3 h-3" />{p.district}, {p.city}</p>
                <div className="space-y-3">
                  {rows.map((row) => (
                    <div key={row.label} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                      <span className="text-sm text-muted-foreground">{row.label}</span>
                      <span className="text-sm font-medium">{row.fn(p)}</span>
                    </div>
                  ))}
                </div>
                <Link href={`/projects/${p.slug}`} className="mt-4 block text-center text-sm font-medium text-[var(--brand-navy)] hover:underline">View Project →</Link>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: table */}
        <div className="hidden lg:block bg-white rounded-2xl border border-border overflow-hidden">
          <div className="grid border-b border-border" style={{ gridTemplateColumns: `200px repeat(${projects.length}, 1fr)` }}>
            <div className="p-5 bg-muted/40" />
            {projects.map((p) => (
              <div key={p.id} className="p-5 border-l border-border">
                <div className="relative h-32 rounded-xl overflow-hidden mb-3 bg-muted">
                  {p.images[0] && <Image src={p.images[0].url} alt={p.name} fill className="object-cover" />}
                </div>
                <span className={cn("inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border mb-1", getStatusColor(p.status))}>
                  <span className={cn("w-1.5 h-1.5 rounded-full", getStatusDot(p.status))} />{p.status}
                </span>
                <h3 className="font-display text-lg">{p.name}</h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" />{p.district}, {p.city}</p>
                <Link href={`/projects/${p.slug}`} className="text-xs text-[var(--brand-navy)] hover:underline mt-1 block">View →</Link>
              </div>
            ))}
          </div>
          {rows.map((row) => (
            <div key={row.label} className="grid border-b border-border hover:bg-muted/20" style={{ gridTemplateColumns: `200px repeat(${projects.length}, 1fr)` }}>
              <div className="p-4 text-sm font-medium text-muted-foreground bg-muted/20">{row.label}</div>
              {projects.map((p) => <div key={p.id} className="p-4 border-l border-border text-sm">{row.fn(p)}</div>)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <CompareProvider>
      <Suspense fallback={<div className="min-h-screen pt-24 flex items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>}>
        <CompareContent />
      </Suspense>
    </CompareProvider>
  );
}
