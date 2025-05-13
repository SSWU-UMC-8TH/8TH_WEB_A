const LpCardSkeleton = () => {
  return (
    <div className="relative rounded-lg overflow-hidden shadow-lg animated-pulse">
      <div className={"w-full h-48 bg-gray-300"} />
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 p-2">
        <div className="h-4 bg-gray-400 w-3/4 rounded-sm" />
      </div>
    </div>
  )
}

export default LpCardSkeleton;
