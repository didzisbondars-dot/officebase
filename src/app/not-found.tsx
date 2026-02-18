import Link from "next/link";
import { Building2 } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--brand-warm)]">
      <div className="text-center">
        <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h1 className="font-display text-4xl text-[var(--brand-navy)] mb-2">
          Project Not Found
        </h1>
        <p className="text-muted-foreground mb-6">
          This project doesn&apos;t exist or may have been removed.
        </p>
        <Link
          href="/projects"
          className="px-5 py-2.5 bg-[var(--brand-navy)] text-white text-sm font-medium rounded-xl hover:bg-[var(--brand-navy)]/90 transition-all"
        >
          Browse All Projects
        </Link>
      </div>
    </div>
  );
}
