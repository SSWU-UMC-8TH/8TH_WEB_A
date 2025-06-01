// src/components/Navbar.tsx
import { useSelector, useDispatch } from "../hooks/useCustomRedux";
import { useEffect } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { calculateTotals } from "../slices/cartSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const amount = useSelector((state) => state.cart.amount);

  // mount 시 1회 실행
  useEffect(() => {
    dispatch(calculateTotals());
  }, [dispatch]);

  return (
    <div className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <h1
        onClick={() => { window.location.href = '/' }}
        className="text-2xl font-semibold cursor-pointer"
      >
        MusicPage
      </h1>
      <div className="flex items-center space-x-2">
        <FaShoppingCart className="text-2xl" />
        <span className="text-xl font-medium">{amount}</span>
      </div>
    </div>
  );
};

export default Navbar;
