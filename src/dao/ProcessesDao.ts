import {connectDB} from "../utils/utils";
import {v1 as uuid} from "uuid";
import {Process, Step} from "../types/Process";

export async function insertProcess(projectId: string, fileId: string, filename: string, steps: Step[]): Promise<Process> {
  const db = await connectDB();
  const {projects} = db.data
  const project = projects.find(p => p.id === projectId)!;
  project.processes = project.processes || [];
  const process = {id: uuid(), fileId, steps, filename, status: 0}
  project.processes.unshift(process);
  await db.write();
  return process;
}

export async function updateProcessStatus(projectId: string, processId: string, status: number) {
  const db = await connectDB();
  const {projects} = db.data
  const project = projects.find(p => p.id === projectId)!;
  const processes = project.processes || [];
  const process = processes.find(process => process.id === processId)
  if (!process) {
    throw new Error(`Process ${processId} not found in project ${projectId}`)
  }
  process.status = status
  await db.write();
}


export async function selectProcesses(projectId: string) {
  const db = await connectDB();
  const {projects} = db.data
  const project = projects.find(p => p.id === projectId)!;
  return project.processes ?? [];
}


