"use client";

import { useState } from "react";
import { Send, CheckCircle2, Loader2 } from "lucide-react";

interface LeadFormProps {
  projectName: string;
  projectId: string;
}

export function LeadForm({ projectName, projectId }: LeadFormProps) {
  const [form, setForm] = useState({ name: "", company: "", email: "", phone: "", sqm: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async () => {
    if (!form.name || !form.email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, projectName, projectId }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") return (
    <div className="bg-white rounded-2xl border border-border p-5 text-center space-y-3">
      <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
      <h3 className="font-semibold text-lg text-[var(--brand-navy)]">Request Sent!</h3>
      <p className="text-sm text-muted-foreground">We'll be in touch within 24 hours about <strong>{projectName}</strong>.</p>
    </div>
  );

  return (
    <div className="bg-[var(--brand-navy)] rounded-2xl p-5 space-y-4">
      <div>
        <h3 className="font-semibold text-white text-lg">Request Information</h3>
        <p className="text-white/60 text-xs mt-0.5">Get details about {projectName}</p>
      </div>
      <div className="space-y-3">
        <input placeholder="Your name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2.5 text-sm bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[var(--brand-gold)] transition-all" />
        <div className="grid grid-cols-2 gap-2">
          <input placeholder="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="w-full px-3 py-2.5 text-sm bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[var(--brand-gold)] transition-all" />
          <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2.5 text-sm bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[var(--brand-gold)] transition-all" />
        </div>
        <input placeholder="Email address *" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2.5 text-sm bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[var(--brand-gold)] transition-all" />
        <input placeholder="Space needed (sqm)" type="number" value={form.sqm} onChange={(e) => setForm({ ...form, sqm: e.target.value })} className="w-full px-3 py-2.5 text-sm bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[var(--brand-gold)] transition-all" />
        <textarea placeholder="Any specific requirements? (optional)" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={3} className="w-full px-3 py-2.5 text-sm bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[var(--brand-gold)] transition-all resize-none" />
      </div>
      {status === "error" && <p className="text-red-400 text-xs">Something went wrong. Please try again.</p>}
      <button onClick={handleSubmit} disabled={status === "loading" || !form.name || !form.email} className="w-full flex items-center justify-center gap-2 py-3 bg-[var(--brand-gold)] text-white font-medium rounded-xl hover:bg-[var(--brand-gold)]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
        {status === "loading" ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : <><Send className="w-4 h-4" /> Send Request</>}
      </button>
      <p className="text-white/30 text-xs text-center">Your information is kept private and secure.</p>
    </div>
  );
}
