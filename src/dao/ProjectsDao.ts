import {connectDB} from "../utils/utils";
import {Project} from "../types";


export async function selectProjects() {
  const db = await connectDB();
  const {projects} = db.data
  return projects;
}

export async function insertProject(project: Project) {
  const db = await connectDB();
  await db.update(({projects}) => projects.push(project))
}

