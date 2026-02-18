"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, XCircle, ArrowLeft, MapPin } from "lucide-react";
import type { Project } from "@/types";
import { formatCurrency, formatArea, formatDate, getStatusColor, getStatusDot, cn } from "@/lib/utils";
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

  const allAmenities = [...new Set(projects.flatMap((p) => p.amenities))].sort();
  const allCerts = [...new Set(projects.flatMap((p) => p.certifications))].sort();
  const cols = `200px repeat(${projects.length}, 1fr)`;

  if (loading) return <div className="min-h-screen pt-24 flex items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>;
  if (!projects.length) return <div className="min-h-screen pt-24 flex flex-col items-center justify-center gap-4"><p className="text-muted-foreground">No projects selected.</p><Link href="/projects" className="text-sm text-[var(--brand-navy)] hover:underline">← Back to Projects</Link></div>;

  return (
    <div className="min-h-screen bg-[var(--brand-warm)] pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/projects" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="w-4 h-4" />Back</Link>
          <h1 className="font-display text-3xl text-[var(--brand-navy)]">Compare Projects</h1>
        </div>
        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          <div className="grid border-b border-border" style={{ gridTemplateColumns: cols }}>
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
                <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" />{p.district}, {p.city}</p>
                <Link href={`/projects/${p.slug}`} className="text-xs text-[var(--brand-navy)] hover:underline mt-1 block">View →</Link>
              </div>
            ))}
          </div>
          {[
            { label: "Property Type", fn: (p: Project) => p.propertyType },
            { label: "Total Area", fn: (p: Project) => formatArea(p.totalArea) },
            { label: "Unit Sizes", fn: (p: Project) => `${p.minUnitSize}–${p.maxUnitSize} sqm` },
            { label: "Floors", fn: (p: Project) => String(p.floors || "—") },
            { label: "Completion", fn: (p: Project) => formatDate(p.completionDate) },
            { label: "Sale Price/sqm", fn: (p: Project) => p.salePricePerSqm ? formatCurrency(p.salePricePerSqm) : "—" },
            { label: "Rent/sqm/mo", fn: (p: Project) => p.rentPricePerSqm ? formatCurrency(p.rentPricePerSqm) : "—" },
            { label: "Developer", fn: (p: Project) => p.developer },
          ].map((row) => (
            <div key={row.label} className="grid border-b border-border hover:bg-muted/20" style={{ gridTemplateColumns: cols }}>
              <div className="p-4 text-sm font-medium text-muted-foreground bg-muted/20">{row.label}</div>
              {projects.map((p) => <div key={p.id} className="p-4 border-l border-border text-sm">{row.fn(p)}</div>)}
            </div>
          ))}
          {allAmenities.length > 0 && <>
            <div className="grid bg-muted/40 border-b border-border" style={{ gridTemplateColumns: cols }}><div className="p-4 font-semibold text-sm col-span-full">Amenities</div></div>
            {allAmenities.map((a) => (
              <div key={a} className="grid border-b border-border hover:bg-muted/20" style={{ gridTemplateColumns: cols }}>
                <div className="p-4 text-sm text-muted-foreground bg-muted/20">{a}</div>
                {projects.map((p) => <div key={p.id} className="p-4 border-l border-border">{p.amenities.includes(a) ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-muted-foreground/30" />}</div>)}
              </div>
            ))}
          </>}
          {allCerts.length > 0 && <>
            <div className="grid bg-muted/40 border-b border-border" style={{ gridTemplateColumns: cols }}><div className="p-4 font-semibold text-sm col-span-full">Certifications</div></div>
            {allCerts.map((c) => (
              <div key={c} className="grid border-b border-border hover:bg-muted/20" style={{ gridTemplateColumns: cols }}>
                <div className="p-4 text-sm text-muted-foreground bg-muted/20">{c}</div>
                {projects.map((p) => <div key={p.id} className="p-4 border-l border-border">{p.certifications.includes(c) ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-muted-foreground/30" />}</div>)}
              </div>
            ))}
          </>}
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
