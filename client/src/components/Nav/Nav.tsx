import React, { memo, useState } from "react";
import UserData from "./UserData";
import { usePlayer } from "../../context/usePlayerContext";
import SlidingMenu from "./SlidingMenu";

const Nav: React.FC = memo(() => {
  const { hp, clicks } = usePlayer();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-800 p-2">
      <div className="container mx-auto flex items-center">
        <a href="/" className="text-white text-lg font-semibold mr-auto">CryptoAlchemy</a>
        <div className="flex-grow flex justify-around">
          <UserData health={hp} moves={clicks}/>
        </div>
        <button onClick={() => setIsMenuOpen(true)} className="p-2 rounded bg-white text-black ml-auto">MENU</button>
      </div>
      {isMenuOpen && <SlidingMenu onClose={() => setIsMenuOpen(false)} />}
    </nav>
  );
});

export default Nav;

