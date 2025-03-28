import { Movie } from '../types/movie';

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <div className="relative group rounded-xl overflow-hidden shadow-md cursor-pointer transition-transform duration-300 hover:scale-105">
      {}
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className="w-full h-auto object-cover"
      />

      {}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 flex flex-col justify-center items-center px-4 transition-opacity duration-300 text-center">
        <h3 className="text-lg font-bold mb-2">{movie.title}</h3>
        <p className="text-sm line-clamp-4">{movie.overview}</p>
      </div>
    </div>
  );
}
