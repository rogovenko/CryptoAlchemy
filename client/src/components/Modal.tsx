import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  itemPath?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, message, itemPath }) => {
  if (!isOpen) return null;

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="z-50 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={handleOutsideClick}>
      <div className="bg-white p-4 rounded shadow-lg w-4/5 max-w-lg flex flex-col items-center">
        <p className="text-center">{message}</p>
        {itemPath && (
          <div className="relative w-full h-full">
            <img
              src={itemPath}
              alt="Item"
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
};

export default Modal;
