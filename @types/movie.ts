export interface Genre {
  id: number;
  tmdbId: number;
  name: string;
}

export interface MovieGenre {
  id: number;
  movieId: number;
  genreId: number;
  genre: Genre;
}

export interface Actor {
  id: number;
  tmdbId: number;
  name: string;
  gender: number;
  profilePath: string;
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
  genres?: MovieGenre[],
  cast?: Cast[],
}
