import React, { memo } from "react";
import { potionPathsMap } from "../utils";
import { Items, itemsMap } from "../global";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  itemName?: Items;
  didGetHit?: number;
}

const Modal: React.FC<ModalProps> = memo(({ isOpen, onClose, message, itemName, didGetHit = -1 }) => {
  if (!isOpen) return null;

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="z-50 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={handleOutsideClick}>
      <div className="bg-white p-4 rounded shadow-lg w-4/5 max-w-lg flex flex-col items-center">
        <span className="text-center">
          {!itemName && didGetHit === -1
            ? "Finding out..."
            : itemName ? message : `You got into a trap and recieved ${didGetHit} damage`}
        </span>
        {!itemName && didGetHit === -1 ? (
          <div className="flex items-center justify-center w-full h-full">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
          </div>
        ) : (
          <div className="relative w-full h-full">
            <img
              src={itemName ? potionPathsMap[itemsMap[itemName]] : 'src/assets/gotHit.webp'}
              alt={itemName ? `item ${itemName}` : `damage image`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        )}
        <button onClick={onClose} className="mt-4 default-button">
          Close
        </button>
      </div>
    </div>
  );
});

export default Modal;
