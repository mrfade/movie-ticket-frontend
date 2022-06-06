export interface City {
  id: number;
  name: string;
}

export interface Place {
  id: number;
  name: string;
  cityId: number;
}
