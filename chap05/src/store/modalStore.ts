// src/store/modalStore.ts
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export interface ModalState {
  isOpen: boolean
  openModal: () => void
  closeModal: () => void
}

export const useModalStore = create<ModalState>()(
  devtools((set) => ({
    isOpen: false,
    openModal: () => set({ isOpen: true }),
    closeModal: () => set({ isOpen: false }),
  }))
)
