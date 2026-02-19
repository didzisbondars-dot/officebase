import { notFound } from "next/navigation";
import { getProjects } from "@/lib/airtable";
import ProjectDetailClient from "./ProjectDetailClient";

export const dynamic = "force-dynamic";

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const projects = await getProjects();
  const project = projects.find(p => p.slug === params.slug);
  if (!project) notFound();
  return <ProjectDetailClient project={project} />;
}
