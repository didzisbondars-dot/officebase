// Core project type matching your Airtable schema
export interface Project {
  id: string;
  slug: string;
  name: string;
  developer: string;
  developerLogo?: string;
  status: "Available" | "Under Construction" | "Sold Out" | "Coming Soon";
  propertyType: "Grade A Office" | "Co-working" | "Mixed Use" | "Grade B Office";
  address: string;
  city: string;
  district: string;
  latitude: number;
  longitude: number;
  totalArea: number; // sqm
  minUnitSize: number; // sqm
  maxUnitSize: number; // sqm
  salePricePerSqm?: number;
  rentPricePerSqm?: number;
  floors: number;
  completionDate?: string;
  description: string;
  amenities: string[];
  certifications: string[];
  featured: boolean;
  images: ProjectImage[];
  floorPlanUrl?: string;
  brochureUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectImage {
  id: string;
  url: string;
  filename: string;
  type: "hero" | "gallery" | "floorplan";
}

export interface Lead {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  projectId: string;
  projectName: string;
  message: string;
  unitSize?: number;
  budget?: number;
}

export interface SearchFilters {
  query?: string;
  city?: string;
  district?: string;
  status?: string[];
  propertyType?: string[];
  minArea?: number;
  maxArea?: number;
  minRent?: number;
  maxRent?: number;
  minPrice?: number;
  maxPrice?: number;
  amenities?: string[];
  certifications?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export const AMENITIES_OPTIONS = [
  "Parking",
  "Gym",
  "Concierge",
  "Restaurant",
  "Conference Rooms",
  "Rooftop",
  "24/7 Security",
  "EV Charging",
  "Bike Storage",
  "Retail Ground Floor",
  "High-Speed Fiber",
  "Generator Backup",
] as const;

export const CERTIFICATION_OPTIONS = [
  "LEED Gold",
  "LEED Platinum",
  "BREEAM Excellent",
  "BREEAM Outstanding",
  "Green Mark",
  "WELL Certified",
] as const;

export const STATUS_OPTIONS = [
  "Available",
  "Under Construction",
] as const;

export const PROPERTY_TYPE_OPTIONS = [
  "Grade A Office",
  "Grade B Office",
  "Co-working",
  "Mixed Use",
] as const;
