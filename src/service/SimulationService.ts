import {Area, Line, Path, Point} from "../types/SimulationEntities";
import {
  selectAreas,
  selectLines,
  selectPaths,
  selectPoints,
  updateAllAreas,
  updateAllLines,
  updateAllPaths,
  updateAllPoints
} from "../dao/SimulationDao";

export async function listPoints(projectId: string) {
  return selectPoints(projectId)
}

export async function setPoints(projectId: string, points: Point[]) {
  return updateAllPoints(projectId, points);
}

export async function listLines(projectId: string) {
  return selectLines(projectId);
}

export async function setLines(projectId: string, lines: Line[]) {
  return updateAllLines(projectId, lines);
}

export async function listAreas(projectId: string) {
  return selectAreas(projectId);
}

export async function setAreas(projectId: string, areas: Area[]) {
  return updateAllAreas(projectId, areas);
}

export async function listPaths(projectId: string) {
  return selectPaths(projectId);
}

export async function setPaths(projectId: string, paths: Path[]) {
  return updateAllPaths(projectId, paths);
}
