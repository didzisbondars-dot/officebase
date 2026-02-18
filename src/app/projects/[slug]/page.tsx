import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getProjectBySlug, getFeaturedProjects } from "@/lib/airtable";
import {
  MapPin,
  Maximize2,
  Building,
  Calendar,
  ArrowLeft,
  Download,
  CheckCircle2,
} from "lucide-react";
import {
  formatCurrency,
  formatArea,
  formatDate,
  getStatusColor,
  getStatusDot,
  cn,
} from "@/lib/utils";
import { ContactForm } from "@/components/projects/ContactForm";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { CompareProvider } from "@/components/compare/CompareContext";
import type { Metadata } from "next";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug).catch(() => null);
  if (!project) return { title: "Project Not Found" };
  return {
    title: project.name,
    description: project.description,
  };
}

export const revalidate = 300;

export default async function ProjectDetailPage({ params }: Props) {
  const [project, related] = await Promise.all([
    getProjectBySlug(params.slug).catch(() => null),
    getFeaturedProjects(3).catch(() => []),
  ]);

  if (!project) notFound();

  const images = project.images.length > 0 ? project.images : [];

  return (
    <CompareProvider>
      <div className="min-h-screen bg-[var(--brand-warm)]">
        {/* Hero image */}
        <div className="relative h-72 sm:h-96 bg-[var(--brand-navy)] overflow-hidden">
          {images[0] && (
            <Image
              src={images[0].url}
              alt={project.name}
              fill
              className="object-cover opacity-60"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-navy)] via-[var(--brand-navy)]/40 to-transparent" />

          {/* Back button */}
          <div className="absolute top-20 left-4 sm:left-8">
            <Link
              href="/projects"
              className="flex items-center gap-1.5 text-sm text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Projects
            </Link>
          </div>

          {/* Title overlay */}
          <div className="absolute bottom-6 left-4 sm:left-8 right-4 sm:right-8">
            <div className="flex items-center gap-2 mb-2">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                  getStatusColor(project.status)
                )}
              >
                <span className={cn("w-1.5 h-1.5 rounded-full", getStatusDot(project.status))} />
                {project.status}
              </span>
              <span className="text-white/60 text-xs">{project.propertyType}</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl text-white">{project.name}</h1>
            <p className="text-white/70 text-sm mt-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              {project.address}, {project.district}, {project.city}
            </p>
          </div>
        </div>

        {/* Main content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column - details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Key stats */}
              <div className="bg-white rounded-2xl border border-border p-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-[var(--brand-warm)] rounded-xl">
                    <Maximize2 className="w-4 h-4 text-[var(--brand-gold)] mx-auto mb-1" />
                    <div className="font-display text-lg text-[var(--brand-navy)]">
                      {formatArea(project.totalArea)}
                    </div>
                    <div className="text-xs text-muted-foreground">Total Area</div>
                  </div>
                  <div className="text-center p-3 bg-[var(--brand-warm)] rounded-xl">
                    <Building className="w-4 h-4 text-[var(--brand-gold)] mx-auto mb-1" />
                    <div className="font-display text-lg text-[var(--brand-navy)]">
                      {project.floors}
                    </div>
                    <div className="text-xs text-muted-foreground">Floors</div>
                  </div>
                  <div className="text-center p-3 bg-[var(--brand-warm)] rounded-xl">
                    <Maximize2 className="w-4 h-4 text-[var(--brand-gold)] mx-auto mb-1" />
                    <div className="font-display text-sm text-[var(--brand-navy)]">
                      {project.minUnitSize}–{project.maxUnitSize} sqm
                    </div>
                    <div className="text-xs text-muted-foreground">Unit Sizes</div>
                  </div>
                  <div className="text-center p-3 bg-[var(--brand-warm)] rounded-xl">
                    <Calendar className="w-4 h-4 text-[var(--brand-gold)] mx-auto mb-1" />
                    <div className="font-display text-sm text-[var(--brand-navy)]">
                      {formatDate(project.completionDate)}
                    </div>
                    <div className="text-xs text-muted-foreground">Completion</div>
                  </div>
                </div>

                {/* Pricing */}
                {(project.salePricePerSqm || project.rentPricePerSqm) && (
                  <div className="mt-4 pt-4 border-t border-border flex gap-6">
                    {project.salePricePerSqm && (
                      <div>
                        <div className="text-xs text-muted-foreground mb-0.5">Sale Price</div>
                        <div className="text-xl font-display text-[var(--brand-navy)]">
                          {formatCurrency(project.salePricePerSqm)}
                          <span className="text-sm font-sans text-muted-foreground ml-1">/ sqm</span>
                        </div>
                      </div>
                    )}
                    {project.rentPricePerSqm && (
                      <div>
                        <div className="text-xs text-muted-foreground mb-0.5">Rent Price</div>
                        <div className="text-xl font-display text-[var(--brand-navy)]">
                          {formatCurrency(project.rentPricePerSqm)}
                          <span className="text-sm font-sans text-muted-foreground ml-1">/ sqm / mo</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* About */}
              <div className="bg-white rounded-2xl border border-border p-6">
                <h2 className="font-display text-xl text-[var(--brand-navy)] mb-3">About the Project</h2>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  {project.description}
                </p>
                <div className="mt-4 text-sm text-muted-foreground">
                  <strong className="text-foreground">Developer:</strong> {project.developer}
                </div>
              </div>

              {/* Amenities */}
              {project.amenities.length > 0 && (
                <div className="bg-white rounded-2xl border border-border p-6">
                  <h2 className="font-display text-xl text-[var(--brand-navy)] mb-4">Amenities</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {project.amenities.map((amenity) => (
                      <div
                        key={amenity}
                        className="flex items-center gap-2 text-sm text-foreground"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        {amenity}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {project.certifications.length > 0 && (
                <div className="bg-white rounded-2xl border border-border p-6">
                  <h2 className="font-display text-xl text-[var(--brand-navy)] mb-4">
                    Green Certifications
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {project.certifications.map((cert) => (
                      <span
                        key={cert}
                        className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-sm px-3 py-1.5 rounded-full font-medium"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Gallery */}
              {images.length > 1 && (
                <div className="bg-white rounded-2xl border border-border p-6">
                  <h2 className="font-display text-xl text-[var(--brand-navy)] mb-4">Gallery</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {images.slice(1).map((img, i) => (
                      <div key={img.id || i} className="relative h-40 rounded-xl overflow-hidden">
                        <Image
                          src={img.url}
                          alt={`${project.name} - ${i + 2}`}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Downloads */}
              {(project.floorPlanUrl || project.brochureUrl) && (
                <div className="bg-white rounded-2xl border border-border p-6">
                  <h2 className="font-display text-xl text-[var(--brand-navy)] mb-4">Downloads</h2>
                  <div className="flex flex-wrap gap-3">
                    {project.floorPlanUrl && (
                      <a
                        href={project.floorPlanUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-lg text-sm font-medium hover:border-[var(--brand-navy)] hover:text-[var(--brand-navy)] transition-all"
                      >
                        <Download className="w-4 h-4" />
                        Floor Plan
                      </a>
                    )}
                    {project.brochureUrl && (
                      <a
                        href={project.brochureUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-lg text-sm font-medium hover:border-[var(--brand-navy)] hover:text-[var(--brand-navy)] transition-all"
                      >
                        <Download className="w-4 h-4" />
                        Brochure
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right column - contact form */}
            <div className="lg:col-span-1">
              <div className="sticky top-20">
                <ContactForm project={project} />
              </div>
            </div>
          </div>

          {/* Related projects */}
          {related.filter((r) => r.id !== project.id).length > 0 && (
            <div className="mt-16">
              <h2 className="font-display text-3xl text-[var(--brand-navy)] mb-8">
                More Projects
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {related
                  .filter((r) => r.id !== project.id)
                  .slice(0, 3)
                  .map((p) => (
                    <ProjectCard key={p.id} project={p} />
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </CompareProvider>
  );
}
