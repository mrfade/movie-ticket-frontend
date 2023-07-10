import type { Model } from './model';
import type { Theater } from './theater';

export interface City {
  ID: number;
  Name: string;
}

export interface Place extends Model {
  Name: string;
  Description: string;
  CityId: number;
  City?: City;
  Address: string;
  Latitude: number;
  Longitude: number;
  Theaters?: Theater[];
}
