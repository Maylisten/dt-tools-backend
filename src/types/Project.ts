import {Process} from "./Process";
import {StoreFile} from "./StoreFile";
import {Model} from "./Model";
import {Simulations} from "./SimulationEntities";

export interface Project {
  id: string
  name: string
  files?: StoreFile[],
  processes?: Process[],
  diagrams?: unknown,
  models?: Model[],
  simulation?: Simulations
}
