import React, { useEffect } from "react";
import UserData from "./UserData";
import { useComponentValue } from "@dojoengine/react";
import { useDojo } from "../../dojo/useDojo";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { Entity } from "@dojoengine/recs";

const Nav: React.FC = () => {
  const {
    setup: {
        systemCalls: { spawn, move, add_item_rnd, combo_items },
        clientComponents: { Position, Moves, State, Inventory },
    },
    account,
  } = useDojo();
  const entityId = getEntityIdFromKeys([
    BigInt(account?.account.address),
  ]) as Entity;
  const state = useComponentValue(State, entityId);
  
  return (
    <nav className="bg-gray-800 p-2">
      <div className="container mx-auto flex items-center">
        <a href="/" className="text-white text-lg font-semibold mr-auto">CryptoAlchemy</a>
        <div className="flex-grow flex justify-around">
          <UserData health={state?.health} moves={state?.points}/>
        </div>
        <a href="/menu" className="p-2 rounded bg-white text-black ml-auto">MENU</a>
      </div>
    </nav>
  );
};

export default Nav;

