import { useState, useCallback, memo } from "react";
import { Inventory } from "./Inventory"
import Modal from './Modal';
import LongPressButton from "./LongPressButton";
import { AccountInterface } from "starknet";
import { usePlayer } from "../context/usePlayerContext";
import { getItems } from "../utils";

interface FarmProps {
  onFarm: (account: AccountInterface, count: number) => Promise<void>;
  account: AccountInterface | undefined;
}

const Farm = memo(({ onFarm, account }: FarmProps) => {
  const [modalState, setModalState] = useState({ isOpen: false, message: "" });
  const { lastDroppedItem, setLastDroppedItem, inventory } = usePlayer();

  const items = getItems(inventory);

  const handleLongPress = useCallback(() => {
    if (account) {
      setLastDroppedItem(undefined);
      setModalState({ isOpen: true, message: "Wow, you got:" });
      onFarm(account, 1).then((res) => console.log("ONFARM .then occured, res:", res));
    } else {
      console.error("You cant farm without account! account:", account);
    }
  }, [account, onFarm, setLastDroppedItem]);

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
})

export default Farm;
