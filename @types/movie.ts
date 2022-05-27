export interface Genre {
  id: number;
  tmdbId: number;
  name: string;
}

export interface Movie {
  id: number,
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
}
