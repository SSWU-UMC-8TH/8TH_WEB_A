import { useDispatch } from "../../hooks/useCustomRedux";
import { clearCart } from "../../slices/cartSlice";
import { closeModal } from "../../slices/modalSlice";


const ConfirmModal = () => {
  const dispatch = useDispatch();

  const handleConfirm = () => {
    dispatch(clearCart());
    dispatch(closeModal());
  };

  const handleCancel = () => {
    dispatch(closeModal());
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <p className="mb-4 text-lg font-semibold">정말 삭제하시겠습니까?</p>
        <div className="flex justify-around">
          <button onClick={handleConfirm} className="px-4 py-2 bg-red-500 text-white rounded">예</button>
          <button onClick={handleCancel} className="px-4 py-2 bg-gray-300 rounded">아니요</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;