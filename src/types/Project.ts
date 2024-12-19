import {Process} from "./Process";
import {StoreFile} from "./StoreFile";
import {Diagram} from "./Diagram";

export interface Project {
  id: string
  name: string
  files?: StoreFile[],
  processes?: Process[],
  diagrams?: Diagram[],
}
