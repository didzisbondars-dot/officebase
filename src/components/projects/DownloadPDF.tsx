"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import type { Project } from "@/types";
import { formatArea } from "@/lib/utils";

export function DownloadPDF({ project }: { project: Project }) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const { default: jsPDF } = await import("jspdf");
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const W = 210;
      const M = 16;
      const CW = W - M * 2;
      let y = 0;

      // Header
      doc.setFillColor(15, 31, 61);
      doc.rect(0, 0, W, 42, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("OfficeBase", M, 18);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(180, 180, 180);
      doc.text("Commercial Real Estate · Riga", M, 25);
      doc.setTextColor(200, 136, 42);
      doc.setFontSize(8);
      doc.text(new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }), W - M, 18, { align: "right" });

      y = 54;

      // Title
      doc.setTextColor(15, 31, 61);
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text(project.name, M, y);
      y += 7;

      // Address
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      doc.text(`${project.address}${project.district ? ", " + project.district : ""}, ${project.city}`, M, y);
      y += 6;

      // Status pill
      const sc = (project.status as string) === "Available" ? [16, 185, 129] :
        project.status === "Under construction" ? [245, 158, 11] :
        project.status === "Fully leased out" ? [239, 68, 68] : [59, 130, 246];
      doc.setFillColor(sc[0], sc[1], sc[2]);
      doc.roundedRect(M, y, 40, 7, 2, 2, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.text(project.status, M + 20, y + 4.5, { align: "center" });
      y += 14;

      // Image
      if (project.images.length > 0) {
        try {
          const img = new Image();
          img.crossOrigin = "anonymous";
          await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = project.images[0].url; });
          const canvas = document.createElement("canvas");
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          canvas.getContext("2d")!.drawImage(img, 0, 0);
          const imgH = Math.min(Math.round((CW * img.naturalHeight) / img.naturalWidth), 70);
          doc.addImage(canvas.toDataURL("image/jpeg", 0.85), "JPEG", M, y, CW, imgH, undefined, "FAST");
          y += imgH + 8;
        } catch { /* CORS blocked, skip */ }
      }

      // Divider
      doc.setDrawColor(220, 220, 220);
      doc.line(M, y, W - M, y);
      y += 8;

      // Stats
      const stats = [
        { label: "Building Class", value: `Class ${project.propertyType}` },
        { label: "Owner", value: project.developer || "—" },
        { label: "Total Area", value: project.totalArea ? formatArea(project.totalArea) : "—" },
        { label: "GLA", value: project.minUnitSize ? formatArea(project.minUnitSize) : "—" },
        ...(project.rentPricePerSqm ? [{ label: "Rent / sqm / mo", value: `EUR ${project.rentPricePerSqm}` }] : []),
        ...((project as any).availableArea ? [{ label: "Available Area", value: formatArea((project as any).availableArea) }] : []),
      ];

      const colW = CW / 2;
      stats.forEach((s, i) => {
        const col = i % 2;
        const x = M + col * colW;
        if (col === 0 && i > 0) y += 14;
        doc.setFontSize(7);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(140, 140, 140);
        doc.text(s.label.toUpperCase(), x, y);
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(15, 31, 61);
        doc.text(s.value, x, y + 5);
      });
      y += 18;

      // Description
      if (project.description) {
        doc.setDrawColor(220, 220, 220);
        doc.line(M, y, W - M, y);
        y += 8;
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(15, 31, 61);
        doc.text("About this property", M, y);
        y += 6;
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(80, 80, 80);
        const lines = doc.splitTextToSize(project.description, CW);
        doc.text(lines, M, y);
        y += lines.length * 4.5 + 6;
      }

      // Amenities
      if (project.amenities.length > 0) {
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(15, 31, 61);
        doc.text("Amenities", M, y);
        y += 6;
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(80, 80, 80);
        const aLines = doc.splitTextToSize(project.amenities.join("  ·  "), CW);
        doc.text(aLines, M, y);
      }

      // Footer
      doc.setFillColor(15, 31, 61);
      doc.rect(0, 281, W, 16, "F");
      doc.setTextColor(180, 180, 180);
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.text("officebase.vercel.app  ·  Commercial Real Estate Riga", W / 2, 291, { align: "center" });

      doc.save(`${project.name.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.pdf`);
    } catch (err) {
      console.error("PDF error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleDownload} disabled={loading} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white border border-white/30 rounded-xl hover:bg-white/90 transition-all disabled:opacity-50 shadow-sm backdrop-blur-sm">
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
      {loading ? "Generating..." : "Download PDF"}
    </button>
  );
}
