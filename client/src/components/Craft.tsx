import { useState, useCallback, memo } from "react";
import { motion } from "framer-motion";
import { topIn } from "../context/AnimationProvider";
import { Inventory, Item } from "./Inventory";
import Modal from './Modal';
import LongPressButton from "./LongPressButton";
import { AccountInterface } from "starknet";
import { usePlayer } from "../context/usePlayerContext";
import { getItems, itemsPathsMap } from "../utils";
import { isItemValue, ItemSelection, itemsNamesMap, ItemValues } from "../global";

interface CraftProps {
  onCombine: (account: AccountInterface, item_one: number, item_two: number) => Promise<void>;
  account: AccountInterface | undefined;
}

interface SelectedItems extends ItemSelection {
	0: { item : ItemValues, amount: number } | undefined;
	1: { item: ItemValues, amount: number } | undefined;
}

const Craft = memo(({ onCombine, account }: CraftProps) => {
  const [modalState, setModalState] = useState({ isOpen: false, message: "" });
	const [selected, setSelected] = useState<SelectedItems>({ 0: undefined, 1: undefined});
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
			setSelected({...selected, 0: { item: e.currentTarget.id, amount : 1 } });
		} else if (!selected[1]) {
			setSelected({...selected, 1: { item: e.currentTarget.id, amount : 1 } });
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
				const frst = itemsNamesMap[selected[0].item].split("_")[0].slice(-1);
				const scnd = itemsNamesMap[selected[1].item].split("_")[0].slice(-1);
				onCombine(
					account,
					frst < scnd ? +frst : +scnd,
					frst < scnd ? +scnd : +frst
				);
				setSelected({ 0: undefined, 1: undefined });
			} else {
				console.warn("You cant combine less than 2 elements. Add some more");
			}
    } else {
			console.error("You cant combine without account! account:", account);
		}
  }, [account, onCombine, setLastDroppedItem, selected]);

	return (
		<div className="container p-4 gap-4 flex flex-col h-full">
			<motion.div
				variants={topIn}
        initial="initial"
        animate="animate"
        exit="revert"
				className="border-2 border-amber-950 bg-rose-950 bg-opacity-70 w-full h-1/3 rounded-lg flex flex-col"
				>
				<div className="grid gap-4 grid-cols-3 grid-rows-1 p-4 flex-grow">
					{selected[0] ? (
						<Item
						id={"selected0"}
						onClick={handleRemove}
						name={selected[0].item}
						imgPath={itemsPathsMap[selected[0].item]}
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
						name={selected[1].item}
						imgPath={itemsPathsMap[selected[1].item]}
						amount={0}
						/>
					) : (
						<Item name={""} imgPath={""} amount={0} />
					)}
				</div>
			</motion.div>
			<motion.div
				variants={topIn}
        initial="initial"
        animate="animate"
        exit="revert"
				className="h-1/2 flex-grow"
				>
				<LongPressButton
					className="h-full w-2/3"
					onLongPress={handleLongPress}
					ms={3000}
					imgPath="/src/assets/pot-nobg.svg"
				/>
			</motion.div>
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
