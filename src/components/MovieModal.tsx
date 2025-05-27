import { Movie } from "../types/movie";
import { X } from "lucide-react";

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

export const MovieModal = ({ movie, onClose }: MovieModalProps) => {
  const imageBaseUrl = "https://image.tmdb.org/t/p/w500";
  const fallbackImage = "https://via.placeholder.com/640x480?";

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-center">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full relative p-6 overflow-y-auto max-h-[90vh]">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 hover:text-black">
          <X size={24} />
        </button>
        <div className="flex flex-col md:flex-row gap-4">
          <img
            src={movie.poster_path ? `${imageBaseUrl}${movie.poster_path}` : fallbackImage}
            alt={movie.title}
            className="w-full md:w-1/2 object-cover rounded-lg"
          />
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">{movie.title}</h2>
            <p className="text-sm text-gray-500 mb-1">
              출시일: {movie.release_date} | 언어: {movie.original_language.toUpperCase()}
            </p>
            <p className="text-yellow-600 font-semibold mb-2">평점: {movie.vote_average.toFixed(1)}</p>
            <p className="text-gray-700">{movie.overview}</p>
          </div>
        </div>
      </div>
    </div>
  );
};