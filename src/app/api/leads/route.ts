import { NextRequest, NextResponse } from "next/server";
import { submitLead } from "@/lib/airtable";
import { z } from "zod";

const leadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  projectId: z.string().min(1, "Project ID is required"),
  projectName: z.string().min(1, "Project name is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  unitSize: z.number().optional(),
  budget: z.number().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = leadSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    await submitLead(validation.data);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Error submitting lead:", error);
    return NextResponse.json(
      { error: "Failed to submit inquiry" },
      { status: 500 }
    );
  }
}
