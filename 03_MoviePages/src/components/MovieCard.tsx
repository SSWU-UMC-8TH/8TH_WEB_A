// src/components/MovieCard.tsx
type Props = {
    title?: string
    imageUrl?: string
  }
  
  const MovieCard = ({ title, imageUrl }: Props) => {
    return (
      <div className="relative rounded-xl overflow-hidden shadow-md group hover:scale-105 transition-transform duration-300">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-[300px] bg-gray-300 flex items-center justify-center text-gray-700">
            No Image
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity">
          <h3 className="text-sm font-semibold">{title || 'No Title'}</h3>
        </div>
      </div>
    )
  }
  
  export default MovieCard
  