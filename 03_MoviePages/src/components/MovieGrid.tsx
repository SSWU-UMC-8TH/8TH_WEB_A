// src/components/MovieGrid.tsx
import { useEffect, useState } from 'react'
import MovieCard from './MovieCard'

type Movie = {
  id: number
  title?: string
  name?: string
  poster_path?: string
}

const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'

const MovieGrid = () => {
  const [movies, setMovies] = useState<Movie[]>([])

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`)
      .then((res) => res.json())
      .then((data) => setMovies(data.results || []))
      .catch((err) => console.error('Failed to fetch movies', err))
  }, [])

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          title={movie.title || movie.name}
          imageUrl={
            movie.poster_path
              ? `${IMAGE_BASE_URL}${movie.poster_path}`
              : undefined
          }
        />
      ))}
    </div>
  )
}

export default MovieGrid
