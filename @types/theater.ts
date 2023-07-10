import type { Place } from './city'
import type { Model } from './model';
import type { MovieSession } from './session';

export interface Seat extends Model {
  TheaterId: number;
  Theater?: Theater;
  Row: string;
  Number: number;
  Name: string;
  Available?: boolean;
  Type?: number;
}

export interface TheaterPrice extends Model {
  TheaterId: number;
  Theater?: Theater;
  Price: number;
  Type: number;
}

export interface Theater extends Model {
  Name: string;
  Description: string;
  SeatPlan: string;
  Seats?: Seat[];
  PlaceId: number;
  Place?: Place;
  Prices?: TheaterPrice[];
  MovieSessions?: MovieSession[];
}

export interface SeatPlanRowItem {
  type: string;
  id: number;
  position?: string;
}

export interface SeatPlan {
  version: string;
  rows: SeatPlanRowItem[][];
}
