import {connectDB} from "../utils/utils";

export async function insertGraph(Id: string, graph_data: unknown) {
  const db = await connectDB();
  const {projects} = db.data;
  const project = projects.find(p => p.id === Id)!;
  project.diagrams = graph_data;
  await db.write()
}


export async function getGraph(Id: string) {
  const db = await connectDB();
  const {projects} = db.data;
  const project = projects.find(p => p.id === Id)!;
  return project.diagrams ?? null;
}



