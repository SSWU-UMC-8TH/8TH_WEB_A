import { FaShoppingCart } from "react-icons/fa";
import { useEffect } from "react";
import { calculateTotals } from "../slices/cartSlice"; 
import { useDispatch, useSelector } from "../hooks/useCustomRedux";

const Navbar = () => {
  const dispatch = useDispatch();
  const { amount, cartItems } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(calculateTotals()); 
  }, [cartItems, dispatch]);

  return (
    <div className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <h1
        onClick={() => { window.location.href = '/' }}
        className="text-2xl font-semibold cursor-pointer"
      >MusicPage</h1>
      <div className="flex items-center space-x-2">
        <FaShoppingCart className="text-2xl" />
        <span className="text-xl font-medium">{amount}</span>
      </div>
    </div>
  );
};
