import { FaShoppingCart } from "react-icons/fa";
import { useDispatch, useSelector } from "../hooks/useCustomRedux";
import { useEffect } from "react";
import { useCartActions, useCartInfo } from "../hooks/useCartStore";

const Navbar = () => {
  const { amount, cartItems } = useCartInfo();
  const { calculateTotals } = useCartActions();

  useEffect(() => {
    calculateTotals();
  },[calculateTotals, cartItems])

  return (
    <div className="flex justify-between item-center p-4 bg-gray-800 text-white">
      <h1
        onClick={() => {window.location.href = '/'}}
        className="text-2xl font-semibold cursor-pointer"
      >Music Cart</h1>
      <div className="flex items-center space-x-2">
        <FaShoppingCart className="text-2xl" />
        <span className="text-xl font-medium">{amount}</span>
      </div>
    </div>
  )
}

export default Navbar;
