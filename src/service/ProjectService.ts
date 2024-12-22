import {deleteProject, insertProject, selectProjects} from "../dao/ProjectsDao";
import {v1 as uuid} from "uuid";
import {Project} from "../types/Project";

export async function listProjects() {
  return selectProjects()
}

export async function addProject(name: string) {
  const project: Project = {id: uuid(), name};
  await insertProject(project)
  return project;
}

export async function removeProject(projectId: string) {
  return deleteProject(projectId)
}
