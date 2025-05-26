// src/features/cart/cartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import initialCart from '../../constants/cartItems'

export interface CartItem {
  id: string
  title: string
  singer: string
  price: number
  img: string
  amount: number
}

interface CartState {
  items: CartItem[]
  totalQuantity: number
  totalAmount: number
}

const initialState: CartState = {
  // price를 number로 변환
  items: initialCart.map(i => ({ ...i, price: Number(i.price) })),
  totalQuantity: 0,
  totalAmount: 0,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    increase(state, action: PayloadAction<string>) {
      const item = state.items.find(i => i.id === action.payload)
      if (item) item.amount++
    },
    decrease(state, action: PayloadAction<string>) {
      const item = state.items.find(i => i.id === action.payload)
      if (item) {
        item.amount--
        if (item.amount < 1) {
          state.items = state.items.filter(i => i.id !== action.payload)
        }
      }
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter(i => i.id !== action.payload)
    },
    clearCart(state) {
      state.items = []
    },
    calculateTotals(state) {
      let quantity = 0
      let amount = 0
      state.items.forEach(i => {
        quantity += i.amount
        amount += i.price * i.amount
      })
      state.totalQuantity = quantity
      state.totalAmount = amount
    },
  },
})

export const {
  increase,
  decrease,
  removeItem,
  clearCart,
  calculateTotals,
} = cartSlice.actions
export default cartSlice.reducer
