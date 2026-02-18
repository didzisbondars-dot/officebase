# OfficeBase — Real Estate Office Project Aggregator

A premium Next.js 14 office project aggregator platform powered by Airtable as the data source. Features include project listings with search & filters, interactive map view, project comparison, and lead capture forms.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui design system
- **Data Source**: Airtable (direct API)
- **Map**: Mapbox GL JS via react-map-gl
- **Forms**: React Hook Form + Zod validation
- **Fonts**: DM Serif Display + DM Sans (Google Fonts)

## Features

- 🏢 Project listings with grid/list/split-map view
- 🗺️ Interactive Mapbox map with project markers
- 🔍 Real-time search + multi-filter (status, type, area, city)
- 📊 Side-by-side project comparison (up to 3)
- 📋 Project detail pages with gallery, amenities, downloads
- 📧 Lead inquiry forms → saved directly to Airtable
- ⚡ ISR (Incremental Static Regeneration) for performance
- 📱 Fully responsive

---

## Setup

### 1. Install dependencies

```bash
npm install
# or
yarn install
```

### 2. Configure environment variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

```env
AIRTABLE_API_KEY=your_personal_access_token
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
AIRTABLE_PROJECTS_TABLE=Projects
AIRTABLE_LEADS_TABLE=Leads
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1IjoiXX...
```

**Getting your Airtable credentials:**
1. Go to https://airtable.com/create/tokens
2. Create a Personal Access Token with `data.records:read` and `data.records:write` scopes
3. Select your base
4. Copy your Base ID from the URL: `airtable.com/appXXXXXXXXX/...`

**Getting Mapbox token:**
1. Sign up at https://mapbox.com
2. Copy your default public token from the dashboard

### 3. Set up Airtable Base

Create a base with these two tables:

#### `Projects` table

| Field Name | Field Type | Notes |
|---|---|---|
| Project Name | Single line text | Required |
| Slug | Single line text | URL-safe slug e.g. `tower-one-cbd` |
| Developer | Single line text | |
| Developer Logo | Attachment | |
| Status | Single select | Available, Under Construction, Sold Out, Coming Soon |
| Property Type | Single select | Grade A Office, Grade B Office, Co-working, Mixed Use |
| Address | Single line text | |
| City | Single line text | |
| District | Single line text | |
| Latitude | Number | Decimal, e.g. 1.2901 |
| Longitude | Number | Decimal, e.g. 103.8517 |
| Total Area (sqm) | Number | |
| Min Unit Size (sqm) | Number | |
| Max Unit Size (sqm) | Number | |
| Sale Price per sqm | Currency | |
| Rent Price per sqm | Currency | |
| Floors | Number | Integer |
| Completion Date | Date | |
| Description | Long text | |
| Amenities | Multiple select | Parking, Gym, Concierge, etc. |
| Certifications | Multiple select | LEED Gold, BREEAM Excellent, etc. |
| Images | Attachment | Multiple images supported |
| Floor Plan | Attachment | PDF or image |
| Brochure | Attachment | PDF |
| Contact Email | Email | |
| Contact Phone | Phone number | |
| Featured | Checkbox | Show on homepage |
| Published | Checkbox | Show on site |

#### `Leads` table

| Field Name | Field Type |
|---|---|
| Name | Single line text |
| Email | Email |
| Phone | Phone number |
| Company | Single line text |
| Project Name | Single line text |
| Message | Long text |
| Unit Size (sqm) | Number |
| Budget (USD) | Currency |
| Submitted At | Date |
| Status | Single select: New, Contacted, Closed |

### 4. Run development server

```bash
npm run dev
```

Open http://localhost:3000

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Homepage
│   ├── layout.tsx            # Root layout
│   ├── projects/
│   │   ├── page.tsx          # Projects listing with filters
│   │   └── [slug]/
│   │       └── page.tsx      # Project detail page
│   ├── map/
│   │   └── page.tsx          # Full-screen map view
│   ├── compare/
│   │   └── page.tsx          # Side-by-side comparison
│   └── api/
│       ├── projects/route.ts # GET /api/projects
│       └── leads/route.ts    # POST /api/leads
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── projects/
│   │   ├── ProjectCard.tsx   # Card with compare toggle
│   │   ├── SearchFilters.tsx # Search + filter panel
│   │   └── ContactForm.tsx   # Lead inquiry form
│   ├── map/
│   │   └── MapView.tsx       # Mapbox map component
│   ├── compare/
│   │   ├── CompareContext.tsx # Compare state management
│   │   └── CompareBar.tsx    # Fixed bottom compare bar
│   └── ui/
│       └── toaster.tsx
├── lib/
│   ├── airtable.ts           # Airtable service layer
│   └── utils.ts              # Formatting helpers
└── types/
    └── index.ts              # TypeScript types
```

---

## Deployment (Vercel)

1. Push to GitHub
2. Import project on https://vercel.com
3. Add environment variables in Vercel dashboard
4. Deploy!

The app uses ISR with 5-minute revalidation. Pages are statically generated and revalidated automatically.

---

## Customization

### Branding
Edit CSS variables in `src/app/globals.css`:
```css
:root {
  --brand-navy: #0f1f3d;   /* Primary color */
  --brand-gold: #c8882a;   /* Accent color */
  --brand-warm: #f5f0e8;   /* Background tint */
}
```

### Airtable field names
If your Airtable field names differ, update the field mapping in `src/lib/airtable.ts` inside the `transformRecord` function.

### Currency
Change `"USD"` to your local currency in `src/lib/utils.ts` `formatCurrency()`.

---

## Adding More Features

- **Authentication**: Add Clerk or NextAuth for broker dashboards
- **Notifications**: Use Resend or SendGrid to email leads to developers
- **Caching**: Add Redis for faster Airtable responses at scale
- **Analytics**: Add PostHog or Plausible for tracking
- **Search**: Replace client-side filter with Algolia for large datasets
