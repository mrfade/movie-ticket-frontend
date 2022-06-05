export interface Seat {
  id: number;
  theaterId?: number;
  name: string;
  available?: boolean;
}

export interface Theather {
  id: number;
  name: string;
  seatPlan: string;
  seats?: Seat[];
}

export interface SeatPlanRowItem {
  type: string;
  id?: number;
  position?: string;
}

export interface SeatPlan {
  version: string;
  rows: SeatPlanRowItem[][];
}
