import { useState, useCallback, memo } from "react";
import { Inventory } from "./Inventory"
import Modal from './Modal';
import LongPressButton from "./LongPressButton";
import { AccountInterface } from "starknet";
import { usePlayer } from "../context/usePlayerContext";
import { potionPathsMap } from "../utils";
import { inventoryKeys } from "../global";

interface BuildProps {
  onFarm: (account: AccountInterface, count: number) => Promise<void>;
  account: AccountInterface | undefined;
}

const Build = memo(({ onFarm, account }: BuildProps) => {
  const [modalState, setModalState] = useState({ isOpen: false, message: "" });
  const { lastDroppedItem, setLastDroppedItem, inventory } = usePlayer();

  const items = inventoryKeys.map((itemName) => ({
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

	return (
		<div className="container p-4 gap-4 flex flex-col h-full">
			<div className="h-1/3">
				<LongPressButton
					className="h-full w-2/3"
					onLongPress={handleLongPress}
					ms={3000}
					imgPath="/src/assets/pot-nobg.svg"
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

export default Build;
