"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Building2, Menu, X, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/projects", label: "Projects" },
  { href: "/map", label: "Map View" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isHome = pathname === "/";

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled || !isHome
          ? "bg-white/95 backdrop-blur border-b border-border shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                scrolled || !isHome
                  ? "bg-[var(--brand-navy)]"
                  : "bg-white/20 backdrop-blur"
              )}
            >
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <span
              className={cn(
                "font-display text-xl font-normal transition-colors",
                scrolled || !isHome ? "text-[var(--brand-navy)]" : "text-white"
              )}
            >
              OfficeBase
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "text-[var(--brand-gold)]"
                    : scrolled || !isHome
                    ? "text-foreground/70 hover:text-foreground"
                    : "text-white/80 hover:text-white"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/projects"
              className={cn(
                "flex items-center gap-1 text-sm font-medium px-4 py-2 rounded-lg transition-all",
                scrolled || !isHome
                  ? "bg-[var(--brand-navy)] text-white hover:bg-[var(--brand-navy)]/90"
                  : "bg-white text-[var(--brand-navy)] hover:bg-white/90"
              )}
            >
              Browse All
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className={cn(
              "md:hidden p-2 rounded-lg transition-colors",
              scrolled || !isHome
                ? "text-foreground hover:bg-muted"
                : "text-white hover:bg-white/10"
            )}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-border">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-sm font-medium text-foreground/70 hover:text-foreground py-2"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/projects"
              className="block text-sm font-medium bg-[var(--brand-navy)] text-white py-2 px-4 rounded-lg text-center"
              onClick={() => setMobileOpen(false)}
            >
              Browse All Projects
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
