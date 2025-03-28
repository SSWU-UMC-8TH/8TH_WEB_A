import { useEffect, useState } from 'react';
import axios from 'axios';
import { Movie, MovieResponse } from '../types/movie';
import MovieCard from '../components/MovieCard';

interface MoviePageProps {
  category: string;
}

export default function MoviePage({ category }: MoviePageProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMovies = async (): Promise<void> => {
      try {
        setLoading(true);
        const { data } = await axios.get<MovieResponse>(
          `https://api.themoviedb.org/3/movie/${category}?language=ko-KR&page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
            },
          }
        );
        setMovies(data.results);
        setLoading(false);
      } catch (err) {
        setError('죄송합니다. 영화 데이터를 불러오는 데 실패했습니다.');
        setLoading(false);
      }
    };

    fetchMovies();
  }, [category, page]); 

  if (loading) {
    return (
      <div className="flex justify-center items-center h-60">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 bg-red-100 border border-red-300 p-4 rounded-md max-w-md mx-auto mt-10 shadow-md">
        <p className="text-lg font-semibold">에러가 발생했습니다!</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 mb-10">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {}
      <div className="flex justify-center gap-4 items-center mb-10">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          className={`px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition ${
            page === 1 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          이전
        </button>
        <span className="font-bold text-lg">페이지 {page}</span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition"
        >
          다음
        </button>
      </div>
    </div>
  );
}
