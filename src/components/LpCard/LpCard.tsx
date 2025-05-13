import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LP } from "../../types/lp";
import { formatDistanceToNow } from "date-fns";

interface LpCardProps {
  lp: LP;
}

const LpCard = ({ lp }: LpCardProps) => {
  const { accessToken } = useAuth() || {};
  const navigate = useNavigate();

  return (
    <div
      className="relative rounded-lg overflow-hidden shadow-lg hover:shadow-2xl  transition-transform duration-300 cursor-pointer group"
    >
      <img
        src={lp.thumbnail}
        alt={lp.title}
        className="w-full h-48 object-cover"
      />
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 p-2">
        <h3 className="text-white text-sm font-semibold">{lp.title}</h3>
      </div>

      <div
        className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 text-white cursor-pointer"
        onClick={() => {
          if (accessToken) {
            navigate(`/lps/${lp.id}`);
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
  )
};

export default LpCard
