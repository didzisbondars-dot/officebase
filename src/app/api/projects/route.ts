export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getProjects } from "@/lib/airtable";
import type { SearchFilters } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const filters: SearchFilters = {
      query: searchParams.get("q") || undefined,
      city: searchParams.get("city") || undefined,
      district: searchParams.get("district") || undefined,
      status: searchParams.getAll("status"),
      propertyType: searchParams.getAll("type"),
      minArea: searchParams.get("minArea") ? Number(searchParams.get("minArea")) : undefined,
      maxArea: searchParams.get("maxArea") ? Number(searchParams.get("maxArea")) : undefined,
      minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
      maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
    };

    const projects = await getProjects(filters);
    return NextResponse.json({ data: projects, total: projects.length });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}
