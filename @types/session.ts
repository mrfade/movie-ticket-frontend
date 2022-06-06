export interface MovieSession {
  id: number;
  name: string;
  date: string;
}

export interface SessionTheather {
  id: number;
  name: string;
  cityId: number;
  sessions: MovieSession[];
}

export interface SessionPlace {
  id: number;
  name: string;
  cityId: number;
  theathers: SessionTheather[];
}
