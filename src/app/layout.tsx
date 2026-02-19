import type { Metadata } from "next";
import "mapbox-gl/dist/mapbox-gl.css";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: {
    template: "%s | OfficeBase",
    default: "OfficeBase — Premium Office Project Aggregator",
  },
  description:
    "Discover and compare the finest office projects across the city. Grade A offices, co-working spaces, and mixed-use developments.",
  keywords: ["office", "commercial real estate", "office space", "Grade A"],
  openGraph: {
    title: "OfficeBase",
    description: "Premium Office Project Aggregator",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
