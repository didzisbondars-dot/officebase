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
    slug: fields["Slug"] || slugify(name || record.id),
    name,
    developer: fields["Owner"] || fields["Developer"] || "",
    developerLogo: undefined,
    status: fields["Status"] || "Available",
    propertyType: fields["Building class"] || fields["Property Type"] || "Grade B Office",
    address: fields["Adress"] || fields["Address"] || "",
    city: "Riga",
    district: fields["City Area"] || fields["District"] || "",
    latitude: parseFloat(fields["Latitude"]) || 0,
    longitude: parseFloat(fields["Longitude"]) || 0,
    totalArea: parseFloat(String(fields["GBA"] || 0).replace(/\s/g, "")) || 0,
    minUnitSize: parseFloat(String(fields["GLA"] || 0).replace(/\s/g, "")) || 0,
    maxUnitSize: parseFloat(String(fields["GLA"] || 0).replace(/\s/g, "")) || 0,
    salePricePerSqm: fields["Sale Price per sqm"] ? parseFloat(fields["Sale Price per sqm"]) : undefined,
    rentPricePerSqm: fields["Rent Price per sqm"] ? parseFloat(fields["Rent Price per sqm"]) : undefined,
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
  const filterFormulas: string[] = [];
  if (filters?.status?.length) filterFormulas.push(`OR(${filters.status.map((s) => `{Status} = "${s}"`).join(", ")})`);
  if (filters?.propertyType?.length) filterFormulas.push(`OR(${filters.propertyType.map((t) => `{Building class} = "${t}"`).join(", ")})`);
  if (filters?.city) filterFormulas.push(`{City Area} = "${filters.city}"`);
  if (filters?.minArea) filterFormulas.push(`{GBA} >= ${filters.minArea}`);
  if (filters?.maxArea) filterFormulas.push(`{GBA} <= ${filters.maxArea}`);
  const formula = filterFormulas.length > 1 ? `AND(${filterFormulas.join(", ")})` : filterFormulas.length === 1 ? filterFormulas[0] : "";
  const records = await base(PROJECTS_TABLE).select({
    filterByFormula: formula || undefined,
    sort: [{ field: "Project name", direction: "asc" }],
  }).all();
  let projects = records.map(transformRecord);
  if (filters?.query) {
    const q = filters.query.toLowerCase();
    projects = projects.filter((p) => p.name.toLowerCase().includes(q) || p.developer.toLowerCase().includes(q) || p.address.toLowerCase().includes(q) || p.district.toLowerCase().includes(q));
  }
  return projects;
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const records = await base(PROJECTS_TABLE).select({ filterByFormula: `{Slug} = "${slug}"`, maxRecords: 1 }).all();
  if (!records.length) return null;
  return transformRecord(records[0]);
}

export async function getFeaturedProjects(limit = 6): Promise<Project[]> {
  const records = await base(PROJECTS_TABLE).select({ maxRecords: limit, sort: [{ field: "Project name", direction: "asc" }] }).all();
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
