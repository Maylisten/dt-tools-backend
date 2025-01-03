export interface SimulationEntity {
  id: string
  label: string
}

export interface Point extends SimulationEntity {
  position: [number, number, number],
  availability: [Date, Date],
  color: string
}

export interface Line extends SimulationEntity {
  positions: [number, number, number][],
  availability: [Date, Date],
  color: string
}

export interface Area extends SimulationEntity {
  positions: [number, number, number][],
  availability: [Date, Date],
  color: string
}

export interface PathPoint {
  position: [number, number, number],
  time: Date
}

export interface Path extends SimulationEntity {
  points: PathPoint[],
  availability: [Date, Date],
}

export interface Log {
  begin: number,
  end: number,
  message: string
}

export interface Simulations {
  points?: Point[],
  lines?: Line[],
  areas?: Area[],
  paths?: Path[],
  logs?: Log[]
}
