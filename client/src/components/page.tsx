import { useState, useCallback } from "react";
import useWindowSize from '../hooks/useWindowSize';
import { Inventory } from "./Inventory"
import { ItemProps } from "./Inventory/Item";
import { getRandomValue } from '../utils/getRandomValue';
import Modal from './Modal';
import LongPressButton from "./LongPressButton";
import { AccountInterface } from "starknet";

interface HomeProps {
  onFarm: (account: AccountInterface, count: number) => Promise<void>;
  account: AccountInterface;
}

export default function Home({ onFarm, account }: HomeProps) {
  const { width } = useWindowSize();
  const [items, setItems] = useState<ItemProps[]>([]);
  const [lastItem, setLastItem] = useState<ItemProps>();
  const [modalState, setModalState] = useState({ isOpen: false, message: "" });

  const handleLongPress = useCallback(() => {
    const potions = [
      "/src/assets/red_potion_nobg.svg",
      "/src/assets/blue_potion_nobg.svg",
      "/src/assets/green_potion_nobg.svg"
    ];
    const randomPotion = potions[getRandomValue(potions.length)];
    const existingItemIndex = items.findIndex(item => item.imgPath === randomPotion);
    if (existingItemIndex !== -1) {
      const updatedItems = [...items];
      updatedItems[existingItemIndex].amount += 1;
      setItems(updatedItems);
    } else {
      setItems([...items, { imgPath: randomPotion, amount: 1 }]);
    }
    setLastItem({ imgPath: randomPotion, amount: 1 });
    setModalState({ isOpen: true, message: "You found a new item!" });
    onFarm(account, 1).then((res) => console.log(res));
  }, [items, account, onFarm]);

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
        <Inventory items={items} />
        <Modal
          isOpen={modalState.isOpen}
          itemPath={lastItem?.imgPath}
          onClose={() => setModalState({ ...modalState, isOpen: false })}
          message={modalState.message}
        />
      </div>
    );
  }
}
