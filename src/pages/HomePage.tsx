import { useState } from "react";
import useGetLpList from "../hooks/queries/useGetLpList";
import { formatDistanceToNow } from "date-fns";
import { PAGINATION_ORDER } from "../enums/common";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Assuming you have a custom hook for authentication

export const HomePage = () => {
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.desc);
  const navigate = useNavigate();
  const { accessToken } = useAuth() || {};

  const { data, isPending, isError } = useGetLpList({
    search,
    order,
  });

  if (isPending) return <div className="mt-20 text-white">Loading...</div>;
  if (isError) return <div className="mt-20 text-white">Error...</div>;

  return (
    <div className="p-8 bg-gray-800 min-h-screen">
      {/* 정렬 버튼 */}
      <div className="flex justify-end mb-4 space-x-2">
        <button
          className={`px-4 py-1 rounded ${
            order === "asc" ? "bg-white text-black" : "bg-gray-700 text-white"
          }`}
          onClick={() => setOrder(PAGINATION_ORDER.asc)}
        >
          오래된순
        </button>
        <button
          className={`px-4 py-1 rounded ${
            order === "desc" ? "bg-white text-black" : "bg-gray-700 text-white"
          }`}
          onClick={() => setOrder(PAGINATION_ORDER.desc)}
        >
          최신순
        </button>
      </div>

      {/* LP 카드 그리드 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {data?.map((lp) => (
          <div
            key={lp.id}
            className="relative group overflow-hidden rounded-md shadow-md hover:scale-105 transition-transform duration-300"
          >
            <img
              src={lp.thumbnail}
              alt={lp.title}
              className="w-full h-64 object-cover"
            />
            

            <div
              className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 text-white cursor-pointer"
              onClick={() => {
                if (accessToken) {
                  navigate(`/lp/${lp.id}`);
                } else {
                  if (window.confirm("로그인이 필요합니다. 로그인 화면으로 이동하시겠습니까?")) {
                    navigate("/login");
                  }
                }
              }}
            >
              <h3 className="text-md font-semibold">{lp.title}</h3>
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
