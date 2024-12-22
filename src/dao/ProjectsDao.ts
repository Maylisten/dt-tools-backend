import {connectDB} from "../utils/utils";
import {Project} from "../types/Project";


export async function selectProjects() {
  const db = await connectDB();
  const {projects} = db.data
  return projects;
}

export async function insertProject(project: Project) {
  const db = await connectDB();
  await db.update(({projects}) => projects.push(project))
}

export async function deleteProject(projectId: string) {
  const db = await connectDB();
  const originProjectLength = db.data.projects.length;
  db.data.projects = db.data.projects.filter(project => project.id !== projectId)
  await db.write()
  return db.data.projects.length - originProjectLength;
}

