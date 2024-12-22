import {connectDB} from "../utils/utils";
import {Model} from "../types/Model";

export async function updateAllModels(projectId: string, models: Model[]) {
  const db = await connectDB();
  const {projects} = db.data
  const project = projects.find(p => p.id === projectId)!;
  project.models = models
  await db.write();
  return models;
}

export async function selectModels(projectId: string) {
  const db = await connectDB();
  const {projects} = db.data
  const project = projects.find(p => p.id === projectId)!;
  return project.models || [];
}
