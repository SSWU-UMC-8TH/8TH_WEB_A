import CartItem from "./CartItem";
import { CartState } from "../slices/cartSlice";

import { RootState } from "@reduxjs/toolkit/query";
import { useSelector } from "../hooks/useCustomRedux";

const CartList = () => {
  const { cartItems } = useSelector((state): CartState => state.cart);

  return (
    <div className="flex flex-col items-center justify-center">
      <ul>
        {cartItems.map((item) => (
          <CartItem key={item.id} lp={item} />
        ))}
      </ul>
    </div>
  )
}

export default CartList;
