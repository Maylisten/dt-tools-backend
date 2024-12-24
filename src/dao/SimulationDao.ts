import {connectDB} from "../utils/utils";
import {Area, Line, Log, Path, Point} from "../types/SimulationEntities";

export async function selectPoints(projectId: string) {
  const db = await connectDB();
  const {projects} = db.data
  const project = projects.find(p => p.id === projectId)!;
  return project.simulation?.points ?? [];
}

export async function updateAllPoints(projectId: string, points: Point[]) {
  const db = await connectDB();
  const {projects} = db.data
  const project = projects.find(p => p.id === projectId)!;
  project.simulation = project.simulation ?? {points: [], lines: [], areas: [], paths: []}
  project.simulation.points = points
  await db.write();
  return points;
}

// 获取线数据
export async function selectLines(projectId: string) {
  const db = await connectDB();
  const {projects} = db.data;
  const project = projects.find(p => p.id === projectId)!;
  return project.simulation?.lines ?? [];
}

// 更新线数据
export async function updateAllLines(projectId: string, lines: Line[]) {
  const db = await connectDB();
  const {projects} = db.data;
  const project = projects.find(p => p.id === projectId)!;
  project.simulation = project.simulation ?? {points: [], lines: [], areas: [], paths: []};
  project.simulation.lines = lines;
  await db.write();
  return lines;
}

export async function selectAreas(projectId: string) {
  const db = await connectDB();
  const {projects} = db.data;
  const project = projects.find(p => p.id === projectId)!;
  return project.simulation?.areas ?? [];
}

export async function updateAllAreas(projectId: string, areas: Area[]) {
  const db = await connectDB();
  const {projects} = db.data;
  const project = projects.find(p => p.id === projectId)!;
  project.simulation = project.simulation ?? {points: [], lines: [], areas: [], paths: []};
  project.simulation.areas = areas;
  await db.write();
  return areas;
}

export async function selectPaths(projectId: string) {
  const db = await connectDB();
  const {projects} = db.data;
  const project = projects.find(p => p.id === projectId)!;
  return project.simulation?.paths ?? [];
}

export async function updateAllPaths(projectId: string, paths: Path[]) {
  const db = await connectDB();
  const {projects} = db.data;
  const project = projects.find(p => p.id === projectId)!;
  project.simulation = project.simulation ?? {points: [], lines: [], areas: [], paths: []};
  project.simulation.paths = paths;
  await db.write();
  return paths;
}

export async function insertLog(projectId: string, log: Log) {
  const db = await connectDB();
  const {projects} = db.data;
  const project = projects.find(p => p.id === projectId)!;
  project.simulation = project.simulation ?? {points: [], lines: [], areas: [], paths: [], logs: []};
  project.simulation.logs = project.simulation.logs ?? []
  project.simulation.logs.push(log)
  await db.write();
  return project.simulation.logs;
}

export async function selectLogs(projectId: string) {
  const db = await connectDB();
  const {projects} = db.data;
  const project = projects.find(p => p.id === projectId)!;
  return project.simulation?.logs ?? [];
}
