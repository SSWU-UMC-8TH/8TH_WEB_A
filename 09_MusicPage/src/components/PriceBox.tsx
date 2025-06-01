import { useDispatch, useSelector } from "../hooks/useCustomRedux";
import { openModal } from "../slices/modalSlice";
import ConfirmModal from "./modals/ConfirmModal";

const PriceBox = () => {
  const { total } = useSelector((state) => state.cart);
  const isModalOpen = useSelector((state) => state.modal.isOpen);
  const dispatch = useDispatch();

  const handleInitializeCart = () => {
    dispatch(openModal());
  };

  return (
    <div className="p-12">
      <button onClick={handleInitializeCart} className="border p-4 rounded-md cursor-pointer">전체 삭제</button>
      <div>총 금액: {total}원</div>
      {isModalOpen && <ConfirmModal />}
    </div>
  )
}

export default PriceBox;