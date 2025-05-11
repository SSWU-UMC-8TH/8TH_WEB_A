//LPCardSkeletonList.tsx
import { LpCardSkeleton } from "./LpCardSkeleton";

interface LpCardSkeletonListProps {
    count: number;
}

export const LpCardSkeletonList = ({count}: LpCardSkeletonListProps) => {
    return (
        <div className="relative rounded-lg overflow-hidden shadow-lg animate-pulse bg-gray-800">
          <div className="bg-gray-700 w-full h-48" />
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 p-2">
            <div className="bgx-gray-600 h-4 w-3/4 rounded-sm mb-1" />
            <div className="bg-gray-600 h-3 w-1/2 rounded-sm" />
          </div>
        </div>
      );
    };