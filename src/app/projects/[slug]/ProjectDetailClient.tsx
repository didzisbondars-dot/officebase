"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, MapPin, Building2, Maximize2, User, Images, ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Project } from "@/types";
import { formatArea, getStatusDot, cn } from "@/lib/utils";
import { LeadForm } from "@/components/projects/LeadForm";
import { DownloadPDF } from "@/components/projects/DownloadPDF";

export default function ProjectDetailClient({ project }: { project: Project }) {
  const [imgIndex, setImgIndex] = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const images = project.images;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="bg-white pt-4 pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative h-[45vh] min-h-[320px] w-full overflow-hidden rounded-2xl">
            {images.length > 0 ? (
              <Image src={images[imgIndex].url} alt={project.name} fill className="object-cover transition-all duration-700" priority />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />
            <div className="absolute top-6 left-6 z-20 pt-16">
              <Link href="/projects" className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm bg-black/30 hover:bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full transition-all">
                <ArrowLeft className="w-4 h-4" /> Back
              </Link>
            </div>
            <div className="absolute top-6 right-6 z-20 pt-16">
              <DownloadPDF project={project} />
            </div>
            {images.length > 1 && (
              <button onClick={() => setGalleryOpen(true)} className="absolute bottom-6 right-6 z-20 inline-flex items-center gap-2 text-white text-sm bg-black/40 hover:bg-black/60 backdrop-blur-sm px-4 py-2.5 rounded-full transition-all border border-white/20">
                <Images className="w-4 h-4" />
                View all {images.length} photos
              </button>
            )}
            {images.length > 1 && (
              <>
                <button onClick={() => setImgIndex((i) => (i - 1 + images.length) % images.length)} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm flex items-center justify-center text-white transition-all border border-white/10">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={() => setImgIndex((i) => (i + 1) % images.length)} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm flex items-center justify-center text-white transition-all border border-white/10">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
            <div className="absolute bottom-0 left-0 right-0 z-10 p-8 md:p-12">
              <div className="flex items-center gap-2 mb-3">
                <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-white border border-white/20")}>
                  <span className={cn("w-1.5 h-1.5 rounded-full", getStatusDot(project.status))} />
                  {project.status}
                </span>
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-[var(--brand-gold)]/90 text-white">
                  Class {project.propertyType}
                </span>
              </div>
              <h1 className="font-display text-4xl md:text-6xl text-white mb-3 drop-shadow-lg">{project.name}</h1>
              <p className="text-white/70 flex items-center gap-1.5 text-sm">
                <MapPin className="w-4 h-4" />{project.address}{project.district ? `, ${project.district}` : ""}, {project.city}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 relative z-10 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-100">
                {[
                  { icon: Maximize2, label: "Total Area", value: project.totalArea ? formatArea(project.totalArea) : "—" },
                  { icon: Maximize2, label: "GLA", value: project.minUnitSize ? formatArea(project.minUnitSize) : "—" },
                  { icon: User, label: "Owner", value: project.developer || "—" },
                  { icon: Building2, label: "District", value: project.district || "—" },
                  ...(project.parkingGround ? [{ icon: Maximize2, label: "Ground Parking", value: `${project.parkingGround} spaces` }] : []),
                  ...(project.parkingUnderground ? [{ icon: Maximize2, label: "Underground Parking", value: `${project.parkingUnderground} spaces` }] : []),
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="px-4 first:pl-0 last:pr-0 flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Icon className="w-3.5 h-3.5" />
                      <span className="text-xs uppercase tracking-wider font-medium">{label}</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-800 truncate">{value}</span>
                  </div>
                ))}
              </div>
              {!!project.rentPricePerSqm && project.rentPricePerSqm > 0 && (
                <div className="mt-5 pt-5 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-sm text-slate-500">Asking Rent Rate</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-[var(--brand-navy)]">€{project.rentPricePerSqm}</span>
                    <span className="text-sm text-slate-400">/ sqm / mo</span>
                  </div>
                </div>
              )}
            </div>

            {project.description && (
              <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 p-6">
                <h2 className="font-display text-xl text-slate-800 mb-3">About this property</h2>
                <p className="text-slate-600 leading-relaxed text-sm">{project.description}</p>
              </div>
            )}

            {project.latitude && project.longitude && (
              <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 overflow-hidden">
                <div className="p-6 pb-3">
                  <h2 className="font-display text-xl text-slate-800">Location</h2>
                  <p className="text-sm text-slate-500 mt-1">{project.address}{project.district ? `, ${project.district}` : ""}, {project.city}</p>
                </div>
                <div className="relative h-80 w-full">
                  <img
                    src={`https://api.mapbox.com/styles/v1/mapbox/light-v11/static/pin-l+0f1f3d(${project.longitude},${project.latitude})/${project.longitude},${project.latitude},13,0/800x320@2x?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`}
                    alt="Project location map"
                    className="w-full h-full object-cover"
                  />
                  <a href={`https://www.google.com/maps?q=${project.latitude},${project.longitude}`} target="_blank" rel="noopener noreferrer" className="absolute bottom-3 right-3 bg-white text-xs px-3 py-1.5 rounded-full shadow-md text-slate-700 hover:bg-slate-50 transition-all">
                    Open in Google Maps ↗
                  </a>
                </div>
              </div>
            )}

            {project.amenities.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 p-6">
                <h2 className="font-display text-xl text-slate-800 mb-4">Amenities</h2>
                <div className="flex flex-wrap gap-2">
                  {project.amenities.map(a => (
                    <span key={a} className="text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full">{a}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <LeadForm projectName={project.name} projectId={project.id} />
            </div>
          </div>
        </div>
      </div>

      {galleryOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          <button onClick={() => setGalleryOpen(false)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all">
            <X className="w-5 h-5" />
          </button>
          <button onClick={() => setImgIndex((i) => (i - 1 + images.length) % images.length)} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button onClick={() => setImgIndex((i) => (i + 1) % images.length)} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all">
            <ChevronRight className="w-6 h-6" />
          </button>
          <div className="relative w-full max-w-5xl h-[80vh] mx-8">
            <Image src={images[imgIndex].url} alt={project.name} fill className="object-contain" />
          </div>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-sm">{imgIndex + 1} / {images.length}</div>
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-lg px-4">
            {images.map((img, i) => (
              <button key={img.id} onClick={() => setImgIndex(i)} className={cn("relative w-14 h-10 rounded-lg overflow-hidden shrink-0 border-2 transition-all", i === imgIndex ? "border-[var(--brand-gold)]" : "border-transparent opacity-50 hover:opacity-80")}>
                <Image src={img.url} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
