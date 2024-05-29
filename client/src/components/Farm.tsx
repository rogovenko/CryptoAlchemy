import { useState, useCallback } from "react";
import useWindowSize from '../hooks/useWindowSize';
import { Inventory } from "./Inventory"
import Modal from './Modal';
import LongPressButton from "./LongPressButton";
import { AccountInterface } from "starknet";
import { usePlayer } from "../context/usePlayerContext";
import { potionPathsMap } from "../utils";

interface FarmProps {
  onFarm: (account: AccountInterface, count: number) => Promise<void>;
  account?: AccountInterface;
}

export default function Farm({ onFarm, account }: FarmProps) {
  const { width } = useWindowSize();
  const [modalState, setModalState] = useState({ isOpen: false, message: "" });
  const { lastDroppedItem, setLastDroppedItem, inventory } = usePlayer();

  const items = Object.keys(inventory).map((itemName) => ({
    amount: inventory[itemName],
    imgPath: potionPathsMap[itemName],
  }))

  const handleLongPress = useCallback(() => {
    setLastDroppedItem(undefined);
    setModalState({ isOpen: true, message: "VIPALO:" });
    if (account) {
      onFarm(account, 1).then((res) => console.log("ONFARM .then occured, res:", res));
    }
  }, [account, onFarm, setLastDroppedItem]);

  if (width >= 993) {
    return (
      <div className="big-window-msg">
        <div>
          Game is not ready yet for this window size. Use phone instead.
        </div>
        <div>
          We apologize for any inconvenience.
        </div>
      </div>
    );
  }

  if (width > 0) {
    return (
      <div className="container p-4 gap-4 flex flex-col h-full">
        <div className="h-1/3">
          <LongPressButton
            className="h-full w-2/3"
            onLongPress={handleLongPress}
            ms={3000}
            imgPath="/src/assets/trees-nobg.svg"
          />
        </div>
        <Inventory items={items} cols={3} rows={3} />
        <Modal
          isOpen={modalState.isOpen}
          itemName={lastDroppedItem}
          onClose={() => setModalState({ ...modalState, isOpen: false })}
          message={modalState.message}
        />
      </div>
    );
  }
}
