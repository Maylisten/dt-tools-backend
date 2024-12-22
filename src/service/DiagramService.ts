
import { insertGraph,getGraph } from "../dao/DiagramDao";

export async function addGraph(Id:string,graphData:object){
    await insertGraph(Id,graphData);
}

export async function getCurrentGraph(Id:string){
    return getGraph(Id);
}