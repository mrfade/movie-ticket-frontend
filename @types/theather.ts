import { Place } from './city'

export interface Seat {
  id: number;
  theaterId?: number;
  name: string;
  available?: boolean;
  type?: number;
}

export interface TheatherPrice {
  id: number;
  type: number;
  price: number;
}

export interface Theather {
  id: number;
  name: string;
  seatPlan: string;
  seats?: Seat[];
  place: Place;
  prices: TheatherPrice[];
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
