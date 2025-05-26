import React from 'react'
import { useModalStore } from '../store/modalStore'
import useCartStore from '../store/cartStore'

const ConfirmModal: React.FC = () => {
  const { isOpen, closeModal } = useModalStore()
  const { clearCart } = useCartStore()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 text-center space-y-4">
        <p className="text-lg font-medium">정말 삭제하시겠습니까?</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={closeModal}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            아니요
          </button>
          <button
            onClick={() => {
              clearCart()
              closeModal()
            }}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            네
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
