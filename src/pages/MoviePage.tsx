import axios from "axios";
import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import { Movie, MovieResponse } from "../types/movie";

export default function MoviePage() {
  const [movies, setMovie] = useState < Movie[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      const { data } = await axios.get<MovieResponse>(
        `https://api.themoviedb.org/3/movie/popular?language=en-US&page=1`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`
          },
        }
      )
      setMovie(data.results);
    };

    fetchMovies();
  }, []);

  return (
    <div className="p-10 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:gird-cols-6">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  )
}