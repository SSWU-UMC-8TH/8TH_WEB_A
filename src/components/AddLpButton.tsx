import { AddLpModal } from "./Modals/AddLpModal";
import { useState } from "react";

export const LpAddButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <button
        className="w-14 h-14 rounded-full bg-blue-500 text-white text-3xl shadow-lg hover:bg-blue-600 transition-colors"
        onClick={() => setIsOpen(true)}
      >
        +
      </button>
      {isOpen && <AddLpModal onClose={() => setIsOpen(false)} />}
    </div>
  );
};
