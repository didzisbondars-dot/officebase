import Airtable from "airtable";
import type { Project, Lead, SearchFilters } from "@/types";

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID!);

const PROJECTS_TABLE = process.env.AIRTABLE_PROJECTS_TABLE || "Projects";
const LEADS_TABLE = process.env.AIRTABLE_LEADS_TABLE || "Leads";

// Transform raw Airtable record to Project type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformRecord(record: any): Project {
  const fields = record.fields;

  const images = [];
  if (fields["Images"] && Array.isArray(fields["Images"])) {
    for (const att of fields["Images"]) {
      images.push({
        id: att.id,
        url: att.url,
        filename: att.filename,
        type: "gallery" as const,
      });
    }
  }

  return {
    id: record.id,
    slug: fields["Slug"] || slugify(fields["Project Name"] || record.id),
    name: fields["Project Name"] || "",
    developer: fields["Developer"] || "",
    developerLogo: fields["Developer Logo"]?.[0]?.url,
    status: fields["Status"] || "Available",
    propertyType: fields["Property Type"] || "Grade A Office",
    address: fields["Address"] || "",
    city: fields["City"] || "",
    district: fields["District"] || "",
    latitude: parseFloat(fields["Latitude"]) || 0,
    longitude: parseFloat(fields["Longitude"]) || 0,
    totalArea: parseFloat(fields["Total Area (sqm)"]) || 0,
    minUnitSize: parseFloat(fields["Min Unit Size (sqm)"]) || 0,
    maxUnitSize: parseFloat(fields["Max Unit Size (sqm)"]) || 0,
    salePricePerSqm: fields["Sale Price per sqm"]
      ? parseFloat(fields["Sale Price per sqm"])
      : undefined,
    rentPricePerSqm: fields["Rent Price per sqm"]
      ? parseFloat(fields["Rent Price per sqm"])
      : undefined,
    floors: parseInt(fields["Floors"]) || 0,
    completionDate: fields["Completion Date"],
    description: fields["Description"] || "",
    amenities: fields["Amenities"] || [],
    certifications: fields["Certifications"] || [],
    featured: fields["Featured"] || false,
    images,
    floorPlanUrl: fields["Floor Plan"]?.[0]?.url,
    brochureUrl: fields["Brochure"]?.[0]?.url,
    contactEmail: fields["Contact Email"],
    contactPhone: fields["Contact Phone"],
    createdAt: record._rawJson?.createdTime || new Date().toISOString(),
    updatedAt: record._rawJson?.createdTime || new Date().toISOString(),
  };
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Get all published projects with optional filters
export async function getProjects(
  filters?: SearchFilters
): Promise<Project[]> {
  const filterFormulas: string[] = ["{Published} = 1"];

  if (filters?.status?.length) {
    const statusOr = filters.status
      .map((s) => `{Status} = "${s}"`)
      .join(", ");
    filterFormulas.push(`OR(${statusOr})`);
  }

  if (filters?.propertyType?.length) {
    const typeOr = filters.propertyType
      .map((t) => `{Property Type} = "${t}"`)
      .join(", ");
    filterFormulas.push(`OR(${typeOr})`);
  }

  if (filters?.city) {
    filterFormulas.push(`{City} = "${filters.city}"`);
  }

  if (filters?.minArea) {
    filterFormulas.push(`{Total Area (sqm)} >= ${filters.minArea}`);
  }

  if (filters?.maxArea) {
    filterFormulas.push(`{Total Area (sqm)} <= ${filters.maxArea}`);
  }

  const formula =
    filterFormulas.length > 1
      ? `AND(${filterFormulas.join(", ")})`
      : filterFormulas[0];

  const records = await base(PROJECTS_TABLE)
    .select({
      filterByFormula: formula,
      sort: [
        { field: "Featured", direction: "desc" },
        { field: "Project Name", direction: "asc" },
      ],
    })
    .all();

  let projects = records.map(transformRecord);

  // Client-side text search (Airtable doesn't support LIKE)
  if (filters?.query) {
    const q = filters.query.toLowerCase();
    projects = projects.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.developer.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q) ||
        p.district.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  return projects;
}

// Get a single project by slug
export async function getProjectBySlug(
  slug: string
): Promise<Project | null> {
  const records = await base(PROJECTS_TABLE)
    .select({
      filterByFormula: `AND({Published} = 1, {Slug} = "${slug}")`,
      maxRecords: 1,
    })
    .all();

  if (!records.length) return null;
  return transformRecord(records[0]);
}

// Get featured projects for homepage
export async function getFeaturedProjects(limit = 6): Promise<Project[]> {
  const records = await base(PROJECTS_TABLE)
    .select({
      filterByFormula: `AND({Published} = 1, {Featured} = 1)`,
      maxRecords: limit,
      sort: [{ field: "Project Name", direction: "asc" }],
    })
    .all();

  return records.map(transformRecord);
}

// Get projects by IDs (for comparison)
export async function getProjectsByIds(ids: string[]): Promise<Project[]> {
  if (!ids.length) return [];

  const formula = `OR(${ids.map((id) => `RECORD_ID() = "${id}"`).join(", ")})`;
  const records = await base(PROJECTS_TABLE)
    .select({ filterByFormula: formula })
    .all();

  return records.map(transformRecord);
}

// Submit a lead inquiry
export async function submitLead(lead: Lead): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (base(LEADS_TABLE) as any).create([
    {
      fields: {
        Name: lead.name,
        Email: lead.email,
        Phone: lead.phone || "",
        Company: lead.company || "",
        "Project Name": lead.projectName,
        Message: lead.message,
        "Unit Size (sqm)": lead.unitSize || null,
        "Budget (USD)": lead.budget || null,
        "Submitted At": new Date().toISOString(),
        Status: "New",
      },
    },
  ]);
}

// Get unique cities for filter dropdown
export async function getCities(): Promise<string[]> {
  const records = await base(PROJECTS_TABLE)
    .select({
      filterByFormula: "{Published} = 1",
      fields: ["City"],
    })
    .all();

  const cities = records
    .map((r) => r.fields["City"] as string)
    .filter(Boolean);

  return [...new Set(cities)].sort();
}
