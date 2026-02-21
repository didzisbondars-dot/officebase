"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowLeft, MapPin, ChevronLeft, ChevronRight, X, Images, Car, ParkingSquare } from "lucide-react";
import type { Project } from "@/types";
import { formatArea, getStatusDot, cn } from "@/lib/utils";
import { LeadForm } from "@/components/projects/LeadForm";
import { DownloadPDF } from "@/components/projects/DownloadPDF";
import { MapboxMap } from "@/components/map/MapboxMap";

export default function ProjectDetailClient({ project }: { project: Project }) {
  const [imgIndex, setImgIndex] = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const images = project.images;

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 60);
    return () => clearTimeout(t);
  }, []);

  const stats = [
    { label: "Total Area", value: project.totalArea ? formatArea(project.totalArea) : null },
    { label: "GLA", value: project.minUnitSize ? formatArea(project.minUnitSize) : null },
    { label: "Available", value: (project as any).availableArea ? formatArea((project as any).availableArea) : null },
    { label: "Owner", value: project.developer || null },
    { label: "District", value: project.district || null },
    { label: "Class", value: project.propertyType ? `Class ${project.propertyType}` : null },
    { label: "Ground Parking", value: (project as any).parkingGround ? `${(project as any).parkingGround} spaces` : null },
    { label: "Underground", value: (project as any).parkingUnderground ? `${(project as any).parkingUnderground} spaces` : null },
  ].filter(s => s.value);

  return (
    <div className="min-h-screen bg-[#f8f6f2]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        .font-cormorant { font-family: 'Cormorant Garamond', serif; }
        .font-dm { font-family: 'DM Sans', sans-serif; }
        .fade-up { opacity: 0; transform: translateY(18px); transition: opacity 0.7s cubic-bezier(.22,1,.36,1), transform 0.7s cubic-bezier(.22,1,.36,1); }
        .fade-up.in { opacity: 1; transform: translateY(0); }
        .stat-item { border-bottom: 1px solid rgba(0,0,0,0.08); }
        .stat-item:last-child { border-bottom: none; }
        .img-thumb { transition: opacity 0.2s; }
        .img-thumb:hover { opacity: 1 !important; }
      `}</style>

      {/* Full viewport hero */}
      <div className="relative w-full" style={{ height: '100vh', maxHeight: '780px', minHeight: '520px' }}>

        {/* Image */}
        {images.length > 0 ? (
          <Image src={images[imgIndex].url} alt={project.name} fill className="object-cover" priority />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d]" />
        )}

        {/* Gradient overlay — heavier at bottom for text legibility */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.6) 75%, rgba(0,0,0,0.88) 100%)' }} />

        {/* Top bar */}
        <div className={`absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-8 pt-8 fade-up ${loaded ? 'in' : ''}`} style={{ transitionDelay: '0ms' }}>
          <Link href="/projects" className="font-dm inline-flex items-center gap-2 text-white/70 hover:text-white text-xs tracking-widest uppercase transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> All Projects
          </Link>
          <DownloadPDF project={project} />
        </div>

        {/* Image counter + gallery trigger */}
        {images.length > 1 && (
          <button onClick={() => setGalleryOpen(true)} className={`font-dm absolute top-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 text-white/60 hover:text-white text-xs tracking-widest uppercase transition-colors fade-up ${loaded ? 'in' : ''}`} style={{ transitionDelay: '100ms' }}>
            <Images className="w-3.5 h-3.5" />
            {imgIndex + 1} / {images.length}
          </button>
        )}

        {/* Arrow navigation */}
        {images.length > 1 && (
          <>
            <button onClick={() => setImgIndex(i => (i - 1 + images.length) % images.length)} className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full border border-white/20 bg-black/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/40 transition-all">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={() => setImgIndex(i => (i + 1) % images.length)} className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full border border-white/20 bg-black/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/40 transition-all">
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Bottom hero content */}
        <div className="absolute bottom-0 left-0 right-0 z-10 px-8 md:px-14 pb-10">
          <div className="max-w-7xl mx-auto">
            <div className={`fade-up ${loaded ? 'in' : ''}`} style={{ transitionDelay: '120ms' }}>
              <div className="flex items-center gap-3 mb-4">
                <span className="font-dm inline-flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 rounded-full border border-white/25 text-white/80 backdrop-blur-sm">
                  <span className={cn("w-1.5 h-1.5 rounded-full", getStatusDot(project.status))} />
                  {project.status}
                </span>
                <span className="font-dm text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 rounded-full text-white/80" style={{ background: 'rgba(200,136,42,0.7)', backdropFilter: 'blur(8px)' }}>
                  Class {project.propertyType}
                </span>
              </div>
              <h1 className="font-cormorant text-white mb-3 leading-none" style={{ fontSize: 'clamp(2.8rem, 6vw, 5.5rem)', fontWeight: 300, letterSpacing: '-0.01em' }}>
                {project.name}
              </h1>
              <p className="font-dm text-white/55 text-xs tracking-widest uppercase flex items-center gap-2">
                <MapPin className="w-3 h-3" />
                {project.address}{project.district ? `, ${project.district}` : ""}, Riga
              </p>
            </div>

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className={`flex gap-2 mt-5 fade-up ${loaded ? 'in' : ''}`} style={{ transitionDelay: '200ms' }}>
                {images.slice(0, 6).map((img, i) => (
                  <button key={img.id} onClick={() => setImgIndex(i)} className={cn("relative w-14 h-9 rounded overflow-hidden shrink-0 transition-all img-thumb", i === imgIndex ? "ring-2 ring-[#c8882a] opacity-100" : "opacity-40")}>
                    <Image src={img.url} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 md:px-14 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* Left col — 3/5 */}
          <div className="lg:col-span-3 space-y-10">

            {/* Stats — editorial horizontal list */}
            <div className={`fade-up ${loaded ? 'in' : ''}`} style={{ transitionDelay: '250ms' }}>
              {!!project.rentPricePerSqm && project.rentPricePerSqm > 0 && (
                <div className="mb-8 pb-8 border-b border-black/8">
                  <p className="font-dm text-[10px] tracking-[0.2em] uppercase text-black/35 mb-1">Asking Rent Rate</p>
                  <div className="flex items-baseline gap-2">
                    <span className="font-cormorant text-[#1a1a1a]" style={{ fontSize: '4rem', fontWeight: 300, lineHeight: 1 }}>€{project.rentPricePerSqm}</span>
                    <span className="font-dm text-xs text-black/35 tracking-wider">/ sqm / month</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-3 gap-0">
                {stats.map((s, i) => (
                  <div key={s.label} className="stat-item py-4 pr-6">
                    <p className="font-dm text-[9px] tracking-[0.22em] uppercase text-black/35 mb-1">{s.label}</p>
                    <p className="font-cormorant text-[#1a1a1a]" style={{ fontSize: '1.3rem', fontWeight: 400 }}>{s.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            {project.description && (
              <div className={`fade-up ${loaded ? 'in' : ''}`} style={{ transitionDelay: '300ms' }}>
                <p className="font-dm text-[10px] tracking-[0.2em] uppercase text-black/30 mb-4">About</p>
                <p className="font-dm text-[#3a3a3a] leading-relaxed" style={{ fontSize: '0.9rem', fontWeight: 300 }}>{project.description}</p>
              </div>
            )}

            {/* Amenities */}
            {project.amenities.length > 0 && (
              <div className={`fade-up ${loaded ? 'in' : ''}`} style={{ transitionDelay: '340ms' }}>
                <p className="font-dm text-[10px] tracking-[0.2em] uppercase text-black/30 mb-4">Amenities</p>
                <div className="flex flex-wrap gap-2">
                  {project.amenities.map(a => (
                    <span key={a} className="font-dm text-[11px] tracking-wide text-[#3a3a3a] px-3 py-1.5 border border-black/10 rounded-full">{a}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Map */}
            {project.latitude && project.longitude && (
              <div className={`fade-up ${loaded ? 'in' : ''}`} style={{ transitionDelay: '380ms' }}>
                <p className="font-dm text-[10px] tracking-[0.2em] uppercase text-black/30 mb-4">Location</p>
                <div className="relative rounded-xl overflow-hidden" style={{ height: '340px' }}>
                  <MapboxMap latitude={project.latitude} longitude={project.longitude} zoom={12} />
                  <a href={`https://www.google.com/maps?q=${project.latitude},${project.longitude}`} target="_blank" rel="noopener noreferrer" className="font-dm absolute bottom-4 right-4 z-10 bg-white text-[10px] tracking-widest uppercase px-4 py-2 rounded-full shadow-lg text-[#1a1a1a] hover:bg-[#f8f6f2] transition-all">
                    Open Maps ↗
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Right col — 2/5 sticky lead form */}
          <div className="lg:col-span-2">
            <div className="sticky top-24">
              <div className={`fade-up ${loaded ? 'in' : ''}`} style={{ transitionDelay: '200ms' }}>
                <p className="font-dm text-[10px] tracking-[0.2em] uppercase text-black/30 mb-4">Enquire About This Property</p>
                <LeadForm projectName={project.name} projectId={project.id} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery modal */}
      {galleryOpen && (
        <div className="fixed inset-0 z-50 bg-black/97 flex items-center justify-center" onClick={() => setGalleryOpen(false)}>
          <button className="absolute top-6 right-6 font-dm text-white/40 hover:text-white text-xs tracking-widest uppercase flex items-center gap-2 transition-colors">
            <X className="w-4 h-4" /> Close
          </button>
          <button onClick={e => { e.stopPropagation(); setImgIndex(i => (i - 1 + images.length) % images.length); }} className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/15 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-all">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={e => { e.stopPropagation(); setImgIndex(i => (i + 1) % images.length); }} className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/15 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-all">
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="relative w-full max-w-5xl h-[75vh] mx-16" onClick={e => e.stopPropagation()}>
            <Image src={images[imgIndex].url} alt={project.name} fill className="object-contain" />
          </div>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((img, i) => (
              <button key={img.id} onClick={e => { e.stopPropagation(); setImgIndex(i); }} className={cn("relative w-16 h-10 rounded overflow-hidden img-thumb", i === imgIndex ? "opacity-100 ring-1 ring-[#c8882a]" : "opacity-30")}>
                <Image src={img.url} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
          <p className="font-dm absolute bottom-6 right-8 text-white/25 text-xs tracking-widest">{imgIndex + 1} / {images.length}</p>
        </div>
      )}
    </div>
  );
}
