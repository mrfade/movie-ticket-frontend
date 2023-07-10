import type { Model } from './model';

export interface MovieSession {
  ID: number;
  Name: string;
  ShowTime: string;
}

export interface SessionTheater extends Model {
  Name: string;
  Sessions: MovieSession[];
}

export interface SessionPlace extends Model {
  Name: string;
  Theaters: SessionTheater[];
}
