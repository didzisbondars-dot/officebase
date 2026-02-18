import Link from "next/link";
import { Building2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[var(--brand-navy)] text-white/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <span className="font-display text-lg text-white">OfficeBase</span>
            </div>
            <p className="text-sm leading-relaxed">
              Discover and compare premium office projects. Your trusted source for commercial real estate intelligence.
            </p>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4 text-sm">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/projects" className="hover:text-white transition-colors">All Projects</Link></li>
              <li><Link href="/map" className="hover:text-white transition-colors">Map View</Link></li>
              <li><Link href="/projects?status=Available" className="hover:text-white transition-colors">Available Now</Link></li>
              <li><Link href="/projects?type=Grade A Office" className="hover:text-white transition-colors">Grade A Offices</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4 text-sm">Property Types</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/projects?type=Grade A Office" className="hover:text-white transition-colors">Grade A Office</Link></li>
              <li><Link href="/projects?type=Co-working" className="hover:text-white transition-colors">Co-working</Link></li>
              <li><Link href="/projects?type=Mixed Use" className="hover:text-white transition-colors">Mixed Use</Link></li>
              <li><Link href="/projects?type=Grade B Office" className="hover:text-white transition-colors">Grade B Office</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <p>© {new Date().getFullYear()} OfficeBase. All rights reserved.</p>
          <p>Data sourced and curated for accuracy.</p>
        </div>
      </div>
    </footer>
  );
}
