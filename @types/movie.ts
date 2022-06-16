import { Theather, Seat } from './theather'

export interface MovieSimple {
  id: number;
  title: string;
  posterPath: string;
  slug: string;
  backdropPath?: string;
}

export interface Session {
  id: number;
  movieId?: number;
  movie: MovieSimple;
  theather: Theather;
  name: string;
  date: string;
  seats: Seat[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface Actor {
  id: number;
  tmdbId: number;
  name: string;
  gender: number;
  profilePath: string;
  biography?: string;
  birthday?: string;
  placeOfBirth?: string;
  imdbId?: string;
  slug?: string;
}

export interface Cast {
  id: number;
  actorId: number;
  actor: Actor;
  character: string;
}

export interface Movie {
  id: number,
  slug: string,
  title: string,
  originalTitle: string,
  description: string,
  duration: number,
  posterPath: string,
  backdropPath: string,
  releaseDate: string,
  originalLanguage: string,
  imdbId?: string | null,
  status: string,
  nowPlaying: boolean,
  trailerUrl: string,
  rating: number,
  director: string,
  genres?: Genre[],
  cast?: Cast[],
}
