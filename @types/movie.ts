import type { Model } from './model';
import { SessionTheater } from './session'
import { Theater, Seat } from './theater'

export interface MovieSimple extends Model {
  Title: string;
  PosterPath: string;
  Slug: string;
  BackdropPath?: string;
  Theaters?: SessionTheater[]
}

export interface Session extends Model {
  MovieId: number;
  Movie?: MovieSimple;
  TheaterId: number;
  Theater?: Theater;
  ShowTime: string;
  Name: string;
  Seats: Seat[];
}

export interface Genre extends Model {
  TmdbId: number;
  Name: string;
}

export interface Person extends Model {
  TmdbId: number;
  ImdbId: string;
  Name: string;
  Slug: string;
  Biography: string;
  Birthday: string;
  PlaceOfBirth: string;
  Gender: number;
  KnownForDepartment: string;
  ProfilePath: string;
}

export interface Cast extends Model {
  PersonId: number;
  Person: Person;
  MovieId: number;
  Role: string;
}

export interface Crew extends Model {
  PersonId: number;
  Person: Person;
  MovieId: number;
  Department: string;
  Job: string;
}

export interface Movie extends Model {
  Title: string,
  Slug: string,
  OriginalTitle: string,
  Description: string,
  Duration: number,
  PosterPath: string,
  BackdropPath: string,
  ReleaseDate: string,
  OriginalLanguage: string,
  ImdbId?: string | null,
  TmdbId?: string | null,
  Status: string,
  NowPlaying: boolean,
  TrailerUrl: string,
  Rating: number,
  DirectorId: number,
  Director?: Person,
  Genres?: Genre[],
  Cast?: Cast[],
  Crews?: Crew[],
}
