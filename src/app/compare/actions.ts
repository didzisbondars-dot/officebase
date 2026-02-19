'use server';

import { getProjectsByIds } from "@/lib/airtable";

export async function getCompareProjects(ids: string[]) {
  try {
    // This safely runs on the server where the API key exists
    const data = await getProjectsByIds(ids);
    return data;
  } catch (error) {
    console.error("Failed to fetch projects securely:", error);
    return [];
  }
}
