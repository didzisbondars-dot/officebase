import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Building2, MapPin, TrendingUp, Shield } from "lucide-react";
import { getFeaturedProjects } from "@/lib/airtable";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { CompareProvider } from "@/components/compare/CompareContext";

export const revalidate = 300; // revalidate every 5 minutes

const stats = [
  { label: "Active Projects", value: "120+", icon: Building2 },
  { label: "Cities Covered", value: "12", icon: MapPin },
  { label: "Grade A Buildings", value: "85%", icon: TrendingUp },
  { label: "Verified Listings", value: "100%", icon: Shield },
];

export default async function HomePage() {
  const featuredProjects = await getFeaturedProjects(6).catch(() => []);

  return (
    <CompareProvider>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-[var(--brand-navy)]">
        {/* Background texture */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-navy)] via-[var(--brand-navy)] to-[#1a3a6b]" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Decorative elements */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[var(--brand-gold)]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6 animate-fade-up">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-gold)]" />
              <span className="text-sm text-white/80 font-medium">
                Premium Office Project Intelligence
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white leading-tight mb-4 animate-fade-up stagger-1">
              Find Your Next
              <br />
              <em className="not-italic text-[var(--brand-gold)]">Office Space</em>
            </h1>

            <p className="text-base text-white/70 leading-relaxed mb-6 max-w-xl animate-fade-up stagger-2">
              Curated Grade A offices, co-working spaces, and mixed-use developments. Compare projects, explore on the map, and connect with developers directly.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 animate-fade-up stagger-3">
              <Link
                href="/projects"
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[var(--brand-gold)] text-white font-medium rounded-xl hover:bg-[var(--brand-gold)]/90 transition-all group"
              >
                Browse Projects
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/map"
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white/10 border border-white/20 text-white font-medium rounded-xl hover:bg-white/20 transition-all"
              >
                <MapPin className="w-4 h-4" />
                Explore Map
              </Link>
            </div>

            {/* Trust bar */}
            <div className="mt-12 animate-fade-up stagger-3">
              <p className="text-xs text-white/40 uppercase tracking-widest mb-5 font-medium">Trusted by</p>
              <div className="flex flex-wrap items-center gap-8">
                {[
                  { name: "Citadele", text: "CITADELE" },
                  { name: "Swedbank", text: "Swedbank" },
                  { name: "Elko Grupa", text: "ELKO GRUPA" },
                  { name: "Printful", text: "Printful" },
                ].map((brand) => (
                  <div key={brand.name} className="text-white/30 hover:text-white/60 transition-colors font-semibold text-lg tracking-tight">
                    {brand.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <div className="w-px h-10 bg-white/20" />
          <span className="text-xs text-white/40 font-mono">scroll</span>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`flex flex-col items-center py-8 px-4 ${
                  i < 3 ? "md:border-r border-border" : ""
                } ${i < 2 ? "border-r sm:border-r-0" : ""}`}
              >
                <stat.icon className="w-5 h-5 text-[var(--brand-gold)] mb-2" />
                <div className="font-display text-3xl text-[var(--brand-navy)] mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured projects */}
      <section className="py-20 bg-[var(--brand-warm)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-sm font-medium text-[var(--brand-gold)] uppercase tracking-widest mb-2">
                Handpicked
              </p>
              <h2 className="font-display text-4xl text-[var(--brand-navy)]">
                Featured Projects
              </h2>
            </div>
            <Link
              href="/projects"
              className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-[var(--brand-navy)] hover:text-[var(--brand-gold)] transition-colors group"
            >
              View all projects
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {featuredProjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-border">
              <Building2 className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No featured projects yet.</p>
              <p className="text-sm text-muted-foreground mt-1">
                Mark projects as Featured in Airtable to show them here.
              </p>
            </div>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/projects"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--brand-navy)] hover:text-[var(--brand-gold)] transition-colors"
            >
              View all projects
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[var(--brand-navy)] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-4xl mb-4">
            List Your Project on OfficeBase
          </h2>
          <p className="text-white/70 mb-8 leading-relaxed">
            Are you a developer or broker? Get your office project in front of serious tenants and investors. All listings are manually curated for quality.
          </p>
          <a
            href="mailto:listings@officebase.com"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-[var(--brand-gold)] text-white font-medium rounded-xl hover:bg-[var(--brand-gold)]/90 transition-all"
          >
            Contact Us to List
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>
    </CompareProvider>
  );
}
