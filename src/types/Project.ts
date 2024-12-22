import {Process} from "./Process";
import {StoreFile} from "./StoreFile";
import {Model} from "./Model";
import {Area, Line, Path, Point} from "./SimulationEntities";

export interface Project {
  id: string
  name: string
  files?: StoreFile[],
  processes?: Process[],
  diagrams?: unknown,
  models?: Model[],
  simulation?: {
    points?: Point[],
    lines?: Line[],
    areas?: Area[],
    paths?: Path[],
  }
}
