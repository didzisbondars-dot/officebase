import Airtable from "airtable";
import type { Project, Lead, SearchFilters } from "@/types";

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID!);

const PROJECTS_TABLE = process.env.AIRTABLE_PROJECTS_TABLE || "Projects";
const LEADS_TABLE = process.env.AIRTABLE_LEADS_TABLE || "Leads";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformRecord(record: any): Project {
  const fields = record.fields;
  const images = [];
  const imageField = fields["Image"] || fields["Images"] || [];
  if (Array.isArray(imageField)) {
    for (const att of imageField) {
      images.push({ id: att.id, url: att.url, filename: att.filename, type: "gallery" as const });
    }
  }
  const name = fields["Project name"] || fields["Project Name"] || "";
  return {
    id: record.id,
    slug: fields["Slug"] ? slugify(fields["Slug"]) : slugify(name || record.id),
    name,
    developer: fields["Owner"] || fields["Developer"] || "",
    developerLogo: undefined,
    status: fields["Status"] || "Available",
    propertyType: fields["Building class"] || fields["Property Type"] || "B",
    address: fields["Adress"] || fields["Address"] || "",
    city: "Riga",
    district: fields["City Area"] || fields["District"] || "",
    latitude: fields["Latitude"] ? parseFloat(String(fields["Latitude"])) : 0,
    longitude: fields["Longitude"] ? parseFloat(String(fields["Longitude"])) : 0,
    totalArea: parseFloat(String(fields["GBA"] || 0).replace(/\s/g, "")) || 0,
    minUnitSize: parseFloat(String(fields["GLA"] || 0).replace(/\s/g, "")) || 0,
    maxUnitSize: parseFloat(String(fields["GLA"] || 0).replace(/\s/g, "")) || 0,
    salePricePerSqm: fields["Sale Price per sqm"] ? parseFloat(fields["Sale Price per sqm"]) : undefined,
    availableArea: parseFloat(String(fields["Available area"] || 0)) || 0,
    rentPricePerSqm: parseFloat(String(fields["Asking rent rate"] || 0)) || 0,
    floors: parseInt(fields["Floors"]) || 0,
    completionDate: fields["Completion Date"],
    description: fields["Description"] || fields["Field 3"] || "",
    amenities: fields["Amenities"] || [],
    certifications: fields["Certifications"] || [],
    featured: fields["Featured"] || false,
    images,
    floorPlanUrl: undefined,
    brochureUrl: undefined,
    contactEmail: fields["Contact Email"],
    contactPhone: fields["Contact Phone"],
    createdAt: record._rawJson?.createdTime || new Date().toISOString(),
    updatedAt: record._rawJson?.createdTime || new Date().toISOString(),
  };
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function getProjects(filters?: SearchFilters): Promise<Project[]> {
  const records = await base(PROJECTS_TABLE).select({
    sort: [{ field: "Project name", direction: "asc" }],
  }).all();
  let projects = records.map(transformRecord);
  if (filters?.query) {
    const q = filters.query.toLowerCase();
    projects = projects.filter((p) => p.name.toLowerCase().includes(q) || p.developer.toLowerCase().includes(q) || p.address.toLowerCase().includes(q) || p.district.toLowerCase().includes(q));
  }
  if (filters?.status?.length) projects = projects.filter((p) => filters.status!.includes(p.status));
  if (filters?.propertyType?.length) projects = projects.filter((p) => filters.propertyType!.includes(p.propertyType));
  if (filters?.minArea) projects = projects.filter((p) => p.totalArea >= filters.minArea!);
  if (filters?.maxArea) projects = projects.filter((p) => p.totalArea <= filters.maxArea!);
  if (filters?.district) projects = projects.filter((p) => p.district?.toLowerCase() === filters.district!.toLowerCase());
  if (filters?.minRent) projects = projects.filter((p) => (p.rentPricePerSqm ?? 0) >= filters.minRent!);
  if (filters?.maxRent) projects = projects.filter((p) => (p.rentPricePerSqm ?? 0) > 0 && (p.rentPricePerSqm ?? 0) <= filters.maxRent!);
  if (filters?.minAvailableArea) projects = projects.filter((p) => p.availableArea >= filters.minAvailableArea!);
  if (filters?.maxAvailableArea) projects = projects.filter((p) => p.availableArea > 0 && p.availableArea <= filters.maxAvailableArea!);
  return projects;
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const records = await base(PROJECTS_TABLE).select({ filterByFormula: `{Slug} = "${slug}"`, maxRecords: 1 }).all();
  if (!records.length) return null;
  return transformRecord(records[0]);
}

export async function getFeaturedProjects(limit = 6): Promise<Project[]> {
  const records = await base(PROJECTS_TABLE).select({
    maxRecords: limit,
    sort: [{ field: "Project name", direction: "asc" }],
  }).all();
  return records.map(transformRecord);
}

export async function getProjectsByIds(ids: string[]): Promise<Project[]> {
  if (!ids.length) return [];
  const formula = `OR(${ids.map((id) => `RECORD_ID() = "${id}"`).join(", ")})`;
  const records = await base(PROJECTS_TABLE).select({ filterByFormula: formula }).all();
  return records.map(transformRecord);
}

export async function submitLead(lead: Lead): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (base(LEADS_TABLE) as any).create([{
    fields: {
      Name: lead.name, Email: lead.email, Phone: lead.phone || "",
      Company: lead.company || "", "Project Name": lead.projectName,
      Message: lead.message, "Submitted At": new Date().toISOString(), Status: "New",
    },
  }]);
}

export async function getCities(): Promise<string[]> {
  const records = await base(PROJECTS_TABLE).select({ fields: ["City Area"] }).all();
  const cities = records.map((r) => r.fields["City Area"] as string).filter(Boolean);
  return [...new Set(cities)].sort();
}
