import { useParams } from 'react-router-dom';
import { useCustomFetch } from '../../hooks/useCustomFetch';
import type { MovieDetail, Credits } from '../../types/movie';

export default function MovieDetail() {
  const { movieId } = useParams();

  const detailUrl = `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`;
  const creditUrl = `https://api.themoviedb.org/3/movie/${movieId}/credits`;

  const { data: movie, statusUI: status1 } = useCustomFetch<MovieDetail>(detailUrl);
  const { data: credits, statusUI: status2 } = useCustomFetch<Credits>(creditUrl);

  return (
    <div className="bg-black text-white min-h-screen">
      {status1}
      {status2}

      {movie && credits && (
        <>
          <div
            className="w-full h-72 bg-cover bg-center relative"
            style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black" />
            <div className="absolute bottom-6 left-6">
              <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
              <p className="text-lg text-gray-300">
                평균 {movie.vote_average} · {movie.release_date?.split('-')[0]} · {movie.runtime}분
              </p>
              <p className="italic text-yellow-300 mt-2">{movie.tagline}</p>
            </div>
          </div>

          <div className="max-w-5xl mx-auto px-4 py-8">
            <p className="text-gray-300 leading-relaxed text-sm md:text-base mb-10">{movie.overview}</p>

            <h2 className="text-xl md:text-2xl font-bold mb-4">감독/출연</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {[...credits.crew.filter(c => c.job === 'Director'), ...credits.cast.slice(0, 15)].map((person) => (
                <div key={person.id} className="flex flex-col items-center">
                  <img
                    src={
                      person.profile_path
                        ? `https://image.tmdb.org/t/p/w200${person.profile_path}`
                        : 'https://via.placeholder.com/200x300?text=No+Image'
                    }
                    alt={person.name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-md"
                  />
                  <p className="text-sm mt-2 font-semibold text-center leading-tight">{person.name}</p>
                  <p className="text-xs text-gray-400 text-center">
                    {'character' in person ? person.character : person.job}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

