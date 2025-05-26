import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import cartItems, { CartItem } from '../constants/cartItems'

export interface CartState {
  items: CartItem[]
  totalQuantity: number
  totalAmount: number
  increase: (id: string) => void
  decrease: (id: string) => void
  clearCart: () => void
  calculateTotals: () => void
}

const useCartStore = create<CartState>()(
  devtools((set, get) => ({
    items: cartItems,
    totalQuantity: 0,
    totalAmount: 0,

    increase: (id: string) => {
      set(state => ({
        items: state.items.map(item =>
          item.id === id ? { ...item, amount: item.amount + 1 } : item
        )
      }))
    },

    decrease: (id: string) => {
      set(state => {
        const updated = state.items
          .map(item =>
            item.id === id ? { ...item, amount: item.amount - 1 } : item
          )
          .filter(item => item.amount > 0)
        return { items: updated }
      })
    },

    clearCart: () => {
      set({ items: [] })
    },

    calculateTotals: () => {
      const { items } = get()
      const totalQuantity = items.reduce((sum, item) => sum + item.amount, 0)
      const totalAmount = items.reduce(
        (sum, item) => sum + Number(item.price) * item.amount,
        0
      )
      set({ totalQuantity, totalAmount })
    },
  }))
)

export default useCartStore
