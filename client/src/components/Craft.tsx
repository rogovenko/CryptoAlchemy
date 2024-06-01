import { useState, useCallback, memo } from "react";
import { Inventory, Item } from "./Inventory"
import Modal from './Modal';
import LongPressButton from "./LongPressButton";
import { AccountInterface } from "starknet";
import { usePlayer } from "../context/usePlayerContext";
import { getItems, potionPathsMap } from "../utils";
import { isItemValue, itemsNamesMap, ItemValues } from "../global";

interface CraftProps {
  onCombine: (account: AccountInterface, item_one: number, item_two: number) => Promise<void>;
  account: AccountInterface | undefined;
}

export interface SelectedItems {
	0?: ItemValues;
	1?: ItemValues;
}

const Craft = memo(({ onCombine, account }: CraftProps) => {
  const [modalState, setModalState] = useState({ isOpen: false, message: "" });
	const [selected, setSelected] = useState<SelectedItems>({});
  const { lastDroppedItem, setLastDroppedItem, inventory } = usePlayer();

  const items = getItems(inventory);

	const handlePick = (e: React.MouseEvent<HTMLDivElement>): void => {
		if (!isItemValue(e.currentTarget.id)) {
			return ;
		}
		if (selected[0] && selected[1]) {
			return;
		}
		if (!selected[0]) {
			setSelected({...selected, 0: e.currentTarget.id })
		} else if (!selected[1]) {
			setSelected({...selected, 1: e.currentTarget.id })
		}
	}
	
	const handleRemove = (e: React.MouseEvent<HTMLDivElement>): void => {
		const match = e.currentTarget.id.match(/selected(\d+)/);
		if (match) {
			const index = parseInt(match[1], 10);
			setSelected({ ...selected, [index]: undefined });
		}
	}

  const handleLongPress = useCallback(() => {
		if (account) {
			if (selected[0] && selected[1]) {
				setLastDroppedItem(undefined);
				setModalState({ isOpen: true, message: "Crafted:" });
				const frst = itemsNamesMap[selected[0]].split("_")[0].slice(-1);
				const scnd = itemsNamesMap[selected[1]].split("_")[0].slice(-1);
				onCombine(
					account,
					frst < scnd ? +frst : +scnd,
					frst < scnd ? +scnd : +frst
				);
				setSelected({});
			} else {
				console.warn("You cant combine less than 2 elements. Add some more");
			}
    } else {
			console.error("You cant combine without account! account:", account);
		}
  }, [account, onCombine, setLastDroppedItem, selected]);

	return (
		<div className="container p-4 gap-4 flex flex-col h-full">
			<div className="border-2 border-amber-950 bg-rose-950 bg-opacity-70 w-full h-1/3 rounded-lg flex flex-col">
				<div className="grid gap-4 grid-cols-3 grid-rows-1 p-4 flex-grow">
					{selected[0] ? (
						<Item
						id={"selected0"}
						onClick={handleRemove}
						name={selected[0]}
						imgPath={potionPathsMap[selected[0]]}
						amount={0}
						/>
					) : (
						<Item name={""} imgPath={""} amount={0} />
					)}
					<div></div>
					{selected[1] ? (
						<Item
						id={"selected1"}
						onClick={handleRemove}
						name={selected[1]}
						imgPath={potionPathsMap[selected[1]]}
						amount={0}
						/>
					) : (
						<Item name={""} imgPath={""} amount={0} />
					)}
				</div>
			</div>
			<div className="h-1/2 flex-grow">
				<LongPressButton
					className="h-full w-2/3"
					onLongPress={handleLongPress}
					ms={3000}
					imgPath="/src/assets/pot-nobg.svg"
				/>
			</div>
			<Inventory
				handleItemPick={handlePick}
				selection={selected}
				items={items}
				cols={3}
				rows={2}
				showNulls={false}
			/>
			<Modal
				isOpen={modalState.isOpen}
				itemName={lastDroppedItem}
				onClose={() => setModalState({ ...modalState, isOpen: false })}
				message={modalState.message}
			/>
		</div>
	);
})

export default Craft;