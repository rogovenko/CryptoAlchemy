import React, { memo, useState } from "react";
import UserData from "./UserData";
import SlidingMenu from "./SlidingMenu";
import { usePlayer } from "../../context/usePlayerContext";
import { useLocation } from "react-router-dom";
import { pathnamesMap } from "../../utils";

const Nav: React.FC = memo(() => {
  const { hp, clicks } = usePlayer();
  const { pathname } = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-800 p-2">
      <div className="container mx-auto flex items-center">
        <span className="text-white text-lg font-semibold mr-auto">
          {pathname in pathnamesMap ? pathnamesMap[pathname] : "CryptoAlchemy"}
        </span>
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

