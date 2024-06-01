import React from "react";
import { NavLink } from "react-router-dom";

interface SlidingMenuProps {
  onClose: () => void;
}

const SlidingMenu: React.FC<SlidingMenuProps> = ({ onClose }) => {
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm slide-in"
			onClick={handleOutsideClick}
			>
      <div className="bg-white p-2 rounded shadow-lg w-4/5 max-w-lg">
        <nav className="flex flex-col space-y-4">
          <NavLink to="/craft" className="p-2 rounded bg-gray-800 text-white text-center" onClick={onClose}>Boiling pot</NavLink>
          <NavLink to="/farm" className="p-2 rounded bg-gray-800 text-white text-center" onClick={onClose}>Farming jungle</NavLink>
        </nav>
      </div>
    </div>
  );
};

export default SlidingMenu;