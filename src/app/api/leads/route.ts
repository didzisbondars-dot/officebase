import { NextRequest, NextResponse } from "next/server";
import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, company, email, phone, sqm, message, projectName, projectId } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email required" }, { status: 400 });
    }

    // @ts-ignore
    await base(process.env.AIRTABLE_LEADS_TABLE || "Leads").create([{
      fields: {
        "Name": name,
        "Company": company || "",
        "Email": email,
        "Phone": phone || "",
        "Space Needed (sqm)": sqm ? Number(sqm) : undefined,
        "Message": message || "",
        "Project": projectName,
        "Project ID": projectId,
        "Status": "New",
        "Source": "Website",
      }
    }]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Lead submission error:", error);
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
  }
}
