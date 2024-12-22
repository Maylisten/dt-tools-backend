import {Model} from "../types/Model";
import {selectModels, updateAllModels} from "../dao/ModelsDao";

export async function listModels(projectId: string) {
  return selectModels(projectId)
}

export async function setAllModels(projectId: string, models: Model[]) {
  return updateAllModels(projectId, models);
}
