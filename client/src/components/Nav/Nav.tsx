import React, { memo } from "react";
import UserData from "./UserData";
import { usePlayer } from "../../context/usePlayerContext";

const Nav: React.FC = memo(() => {
  const { hp, clicks } = usePlayer();
  
  return (
    <nav className="bg-gray-800 p-2">
      <div className="container mx-auto flex items-center">
        <a href="/" className="text-white text-lg font-semibold mr-auto">CryptoAlchemy</a>
        <div className="flex-grow flex justify-around">
          <UserData health={hp} moves={clicks}/>
        </div>
        <a href="/menu" className="p-2 rounded bg-white text-black ml-auto">MENU</a>
      </div>
    </nav>
  );
});

export default Nav;

