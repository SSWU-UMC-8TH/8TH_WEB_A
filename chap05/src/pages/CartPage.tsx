// src/pages/CartPage.tsx
import React, { useEffect } from 'react'
import { ShoppingCart } from 'lucide-react'
import useCartStore from '../store/cartStore'
import { useModalStore } from '../store/modalStore'

export default function CartPage() {
  const items           = useCartStore((state: { items: any }) => state.items)
  const totalQuantity   = useCartStore((state: { totalQuantity: any }) => state.totalQuantity)
  const totalAmount     = useCartStore((state: { totalAmount: any }) => state.totalAmount)
  const increase        = useCartStore((state: { increase: any }) => state.increase)
  const decrease        = useCartStore((state: { decrease: any }) => state.decrease)
  const clearCart       = useCartStore((state: { clearCart: any }) => state.clearCart)
  const calculateTotals = useCartStore((state: { calculateTotals: any }) => state.calculateTotals)

  const isOpen    = useModalStore((state) => state.isOpen)
  const openModal = useModalStore((state) => state.openModal)
  const closeModal= useModalStore((state) => state.closeModal)

  // items가 바뀔 때마다 합계 재계산
  useEffect(() => {
    calculateTotals()
  }, [items, calculateTotals])

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 헤더 */}
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">장바구니 🛒</h1>
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-6 h-6" />
          <span className="text-lg font-semibold">{totalQuantity}</span>
        </div>
      </header>

      {/* 리스트 */}
      <main className="max-w-3xl mx-auto bg-white shadow rounded mt-6 divide-y">
        {items.map((item: { id: React.Key | null | undefined; img: string | undefined; title: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; singer: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; price: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; amount: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined }) => (
          <div
            key={item.id}
            className="flex items-center justify-between py-4 px-6"
          >
            {/* 좌측: 이미지 + 정보 (왼쪽 정렬) */}
            <div className="flex items-center gap-4 text-left">
              <img
                src={item.img}
                alt={String(item.title || '')}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex flex-col">
                <h2 className="font-semibold text-gray-800">{item.title}</h2>
                <p className="text-sm text-gray-500">{item.singer}</p>
                <p className="mt-1 font-bold text-gray-900">${item.price}</p>
              </div>
            </div>

            {/* 우측: 수량 조절 (– [수량] +) */}
            <div className="flex items-center">
              <button
                onClick={() => decrease(item.id)}
                className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded flex items-center justify-center text-lg"
              >
                –
              </button>
              <span className="mx-3 min-w-[24px] text-center font-medium bg-gray-100 text-gray-800">
                {item.amount}
              </span>
              <button
                onClick={() => increase(item.id)}
                className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded flex items-center justify-center text-lg"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </main>

      {/* 요약 & 전체 삭제 */}
      <section className="max-w-3xl mx-auto bg-white shadow rounded mt-6 p-6 flex justify-between items-center">
        <button
          onClick={openModal}
          className="px-4 py-2 border border-gray-300 rounded hover:bg-red-50 text-red-500"
        >
          전체 삭제
        </button>
        <div className="text-right space-y-1">
          <p className="text-gray-600">
            전체 수량: <span className="font-semibold">{totalQuantity}</span>
          </p>
          <p className="text-lg font-bold">
            총 금액: <span className="text-pink-600">${totalAmount}</span>
          </p>
        </div>
      </section>

      {/* ❗️ 삭제 확인 모달 */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
            <p className="mb-6 text-lg text-black">정말 삭제하시겠습니까?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-gray-800"
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
      )}
    </div>
  )
}
