import { useParams } from "react-router-dom"
import axios from "axios";
import { useEffect, useState } from "react";
import { MovieDetail } from "../types/movie";
import { LoadingSpinner } from "../components/LoadingSpinner";

export const MovieDetailPage = () => {

  const { movieId } = useParams<{ movieId: string }>();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [credits, setCredits] = useState<{ cast: any[]; crew: any[] } | null>(null);
  // 1. 로딩 상태
  const [isPending, setIsPending] = useState(false);
  // 2. 에러 상태
  const [isError, setIsError] = useState(false);

    console.log(movie);
  useEffect(() => {
    const fetchMovieDetail = async () => {
      setIsPending(true);

      try {
        const { data } = await axios.get<MovieDetail>(
          `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`
            },
          }
        )
        setMovie(data);
      } catch {
        setIsError(true);
      } finally { 
        setIsPending(false);
      }
    };

    const fetchMovieCredits = async () => {
      try {
        const { data } = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=VITE_TMDB_KEY&language=ko-KR`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`
            },
          }
        )
        setCredits(data);
      } catch (error) {
        setIsError(true);
      } finally {
        setIsPending(false);
      }
    };
    fetchMovieCredits();
    fetchMovieDetail();
  }, [movieId]);

  if (isError) {
    return (
      <div>
        <span className="text-red-500">
          영화 정보를 불러오는 데 실패했습니다.
        </span>
      </div>
    )
  }

  const director = credits?.crew.find(person => person.job === "Director");
  const topCast = credits?.cast.slice(0, 5);

  return (
    
    <div className="bg-black text-white min-h-screen p-6 flex justify-center items-center">
      {isPending && (
              <div className="flex justify-center items-center h-dvh">
                <LoadingSpinner />
              </div>
            )}

      <div className="max-w-4xl w-full flex flex-col md:flex-row items-start space-x-6">
        {movie?.poster_path && (
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="w-64 rounded-lg shadow-lg"
          />
        )}
        <div className="flex-1 flex flex-col space-y-4">
          <h1 className="text-3xl font-bold">{movie?.title}</h1>
          <p className="italic text-gray-400">{movie?.tagline}</p>
          <p>{movie?.overview}</p>
          <p>{movie?.release_date}</p>
          <p><strong>평점:</strong> {movie?.vote_average}</p>
          <p>{movie?.runtime}분</p>

          {director && (
            <div className="mt-6 flex items-center space-x-4">
              {director.profile_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w200${director.profile_path}`}
                  alt={director.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              )}
              <h2 className="text-xl font-semibold">감독</h2>
              <p className="text-lg">{director.name}</p>
            </div>
          )}

          <div className="mt-6">
            <h2 className="text-xl font-semibold">출연진</h2>
            <div className="flex space-x-4 overflow-x-auto mt-2">
              {topCast?.map(actor => (
                <div key={actor.id} className="flex flex-col items-center">
                  {actor.profile_path && (
                    <img
                      src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                      alt={actor.name}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  )}
                  <p className="text-sm mt-2">{actor.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

  

  

  
