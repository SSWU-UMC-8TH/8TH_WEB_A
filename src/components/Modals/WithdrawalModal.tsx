type WithdrawalModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function WithdrawalModal({ isOpen, onClose, onConfirm }: WithdrawalModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-80 text-center shadow-xl">
        <p className="text-lg font-semibold mb-4">정말 탈퇴하시겠습니까?</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600"
          >
            예
          </button>
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-300"
          >
            아니요
          </button>
        </div>
      </div>
    </div>
  );
}
