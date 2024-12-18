import {insertProject, selectProjects} from "../dao/ProjectsDao";
import {Project} from "../types";

export async function listProjects() {
  return selectProjects()
}

export async function addProject(project: Project) {
  return insertProject(project)
}
