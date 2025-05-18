import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import useGetLpList from "../hooks/queries/useGetLpList";
import { PAGINATION_ORDER } from "../types/common";
import { useNavigate } from "react-router-dom";

const SkeletonCard = () => (
  <div className="animate-pulse bg-gray-800 rounded-md shadow-md h-64 w-full" />
);

export const HomePage = () => {
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.desc);
  const navigate = useNavigate();

  const { data, isPending, isError } = useGetLpList({ search, order });

  if (isPending) return <div className="mt-20 text-white">Loading...</div>;
  if (isError) return <div className="mt-20 text-white">Error...</div>;

  return (
    <div className="p-8 bg-black min-h-screen">
      <div className="flex justify-end mb-4 space-x-2">
        <button
          className={`px-4 py-1 rounded ${
            order === "asc" ? "bg-white text-black" : "bg-gray-600 text-white"
          }`}
          onClick={() => setOrder(PAGINATION_ORDER.asc)}
        >
          오래된순
        </button>
        <button
          className={`px-4 py-1 rounded ${
            order === "desc" ? "bg-white text-black" : "bg-gray-800 text-white"
          }`}
          onClick={() => setOrder(PAGINATION_ORDER.desc)}
        >
          최신순
        </button>
      </div>

      <div className="grid grid-cols-4 lg:grid-cols-5 gap-4">
    {data?.map((lp) => (
      <div
        key={lp.id}
        onClick={() => navigate(`/lp/${lp.id}`)}
        className="relative group overflow-hidden rounded-md shadow-md hover:scale-105 transition-transform duration-300 bg-black cursor-pointer"
      >
        <img
          src={lp.thumbnail}
          alt={lp.title}
          className="w-full h-64 object-cover bg-black"
        />

        <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-70 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
          <h3 className="text-lg font-semibold">{lp.title}</h3>
          <p className="text-sm">
            {formatDistanceToNow(new Date(lp.createdAt), { addSuffix: true })}
          </p>
          <p className="text-sm">❤️ {lp.likes.length}</p>
        </div>
      </div>
    ))}
  </div>
    </div>
  );
};
