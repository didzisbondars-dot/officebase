"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  company: z.string().optional(),
  message: z.string().min(10, "Please write a bit more"),
  unitSize: z.string().optional(),
  budget: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface ContactFormProps {
  project: Project;
  className?: string;
}

export function ContactForm({ project, className }: ContactFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setStatus("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          projectId: project.id,
          projectName: project.name,
          unitSize: data.unitSize ? Number(data.unitSize) : undefined,
          budget: data.budget ? Number(data.budget) : undefined,
        }),
      });

      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div
        className={cn(
          "bg-white rounded-2xl border border-border p-8 text-center",
          className
        )}
      >
        <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
        <h3 className="font-display text-xl text-foreground mb-2">
          Inquiry Sent!
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Thank you for your interest in {project.name}. Our team will get back to you within 24 hours.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="text-sm text-[var(--brand-navy)] hover:underline"
        >
          Send another inquiry
        </button>
      </div>
    );
  }

  return (
    <div className={cn("bg-white rounded-2xl border border-border p-6", className)}>
      <h3 className="font-display text-xl text-foreground mb-1">
        Enquire About This Project
      </h3>
      <p className="text-sm text-muted-foreground mb-5">
        Fill out the form and we&apos;ll connect you with the right team.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              Your Name <span className="text-red-500">*</span>
            </label>
            <input
              {...register("name")}
              placeholder="John Smith"
              className={cn(
                "w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-navy)]/20 focus:border-[var(--brand-navy)] transition-all",
                errors.name ? "border-red-400" : "border-border"
              )}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              {...register("email")}
              type="email"
              placeholder="john@company.com"
              className={cn(
                "w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-navy)]/20 focus:border-[var(--brand-navy)] transition-all",
                errors.email ? "border-red-400" : "border-border"
              )}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              Phone
            </label>
            <input
              {...register("phone")}
              type="tel"
              placeholder="+1 (555) 000-0000"
              className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-navy)]/20 focus:border-[var(--brand-navy)] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              Company
            </label>
            <input
              {...register("company")}
              placeholder="Acme Corp"
              className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-navy)]/20 focus:border-[var(--brand-navy)] transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              Unit Size (sqm)
            </label>
            <input
              {...register("unitSize")}
              type="number"
              placeholder="e.g. 500"
              className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-navy)]/20 focus:border-[var(--brand-navy)] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              Budget (USD)
            </label>
            <input
              {...register("budget")}
              type="number"
              placeholder="e.g. 1000000"
              className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-navy)]/20 focus:border-[var(--brand-navy)] transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-foreground mb-1">
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register("message")}
            rows={3}
            placeholder="I'm interested in learning more about available units..."
            className={cn(
              "w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-navy)]/20 focus:border-[var(--brand-navy)] transition-all resize-none",
              errors.message ? "border-red-400" : "border-border"
            )}
          />
          {errors.message && (
            <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>
          )}
        </div>

        {status === "error" && (
          <p className="text-sm text-red-500">
            Something went wrong. Please try again.
          </p>
        )}

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[var(--brand-navy)] text-white text-sm font-medium rounded-xl hover:bg-[var(--brand-navy)]/90 disabled:opacity-60 transition-all"
        >
          {status === "loading" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          {status === "loading" ? "Sending..." : "Send Inquiry"}
        </button>

        <p className="text-xs text-center text-muted-foreground">
          By submitting, you agree to be contacted about this property.
        </p>
      </form>
    </div>
  );
}
