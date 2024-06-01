import { useState, useCallback, memo } from "react";
import { motion } from "framer-motion";
import { topIn } from "../context/AnimationProvider";
import { Inventory, Item } from "./Inventory";
import Modal from './Modal';
import { AccountInterface } from "starknet";
import { usePlayer } from "../context/usePlayerContext";
import { getItems, potionPathsMap } from "../utils";
import { isItemValue, ItemSelection, itemsNamesMap, ItemValues } from "../global";

interface CraftProps {
  onCombine: (account: AccountInterface, item_one: number, item_two: number) => Promise<void>;
  account: AccountInterface | undefined;
}

interface SelectedItems extends ItemSelection {
	0: ItemValues | undefined;
}

const Market = memo(({ onCombine, account }: CraftProps) => {
  const [modalState, setModalState] = useState({ isOpen: false, message: "" });
	const [selected, setSelected] = useState<SelectedItems>({ 0: undefined });
  const { lastDroppedItem, setLastDroppedItem, inventory } = usePlayer();
  const [selectedMenu, setSelectedMenu] = useState<"Buy" | "Sell">("Buy");

  const items = getItems(inventory);

	const handlePick = (e: React.MouseEvent<HTMLDivElement>): void => {
		if (!isItemValue(e.currentTarget.id)) {
			return ;
		}
		setSelected({ 0: e.currentTarget.id })
	}
	
	const handleRemove = (e: React.MouseEvent<HTMLDivElement>): void => {
		const match = e.currentTarget.id.match(/selected(\d+)/);
		if (match) {
			const index = parseInt(match[1], 10);
			setSelected({ ...selected, [index]: undefined });
		}
	}

	return (
		<div className="container p-4 gap-4 flex flex-col h-full">
			<motion.div
				variants={topIn}
        initial="initial"
        animate="animate"
        exit="revert"
				className={
					`max-h-96 h-full w-full bg-gray-500 bg-opacity-50 rounded-lg flex flex-col
					${selectedMenu === "Buy" ? "h-96" : "h-64"}`
				}
				>
				<div className="text-white rounded-t-lg flex justify-between">
						<button
							className={`w-1/2 bg-gray-700 rounded-t-lg ${selectedMenu === "Buy" ? "border-t-2 border-l-2 border-r-2 border-black" : ""}`}
							onClick={() => setSelectedMenu('Buy')}
						>
							Buy
						</button>
						<button
							className={`w-1/2 bg-gray-700 rounded-t-lg ${selectedMenu === "Sell" ? "border-t-2 border-l-2 border-r-2 border-black" : ""}`}
							onClick={() => setSelectedMenu('Sell')}
						>
							Sell
						</button>
				</div>
				<div className="flex flex-col overflow-y-auto border-l-2 border-r-2 border-b-2 border-black flex-grow">
					{selectedMenu === "Buy"
					? (Array.from({ length: 10 }).map((_, index) => (
						<div key={index} className="bg-white p-2 border border-black flex">
							<div className="w-1/6">
								<Item name={`Item ${index + 1}`} imgPath="/src/assets/trees-nobg.svg" amount={0} />
							</div>
							<div className="w-3/4 flex items-center justify-center">
								Order {index + 1}
							</div>
						</div>
					)))
					: (
					<div className="bg-white w-full h-full flex justify-around items-center">
						<div className="w-1/3">
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
						</div>
						<div className="w-2/3 flex flex-col items-center justify-center">
							<div className="w-full flex">
								<span className="w-full p-2 border border-black">
									{selected[0] ? selected[0] : "Choose item"}
								</span>
								<input
									type="number"
									placeholder="Price"
									className="w-full p-2 border border-black"
									disabled={selected[0] ? false : true}
								/>
							</div>
							<textarea
								placeholder="Comment"
								className="w-full p-2 border border-black mt-2"
								rows={4}
								disabled={selected[0] ? false : true}
							/>
						</div>
					</div>
					)}
				</div>
			</motion.div>
			<Inventory
				handleItemPick={handlePick}
				selection={selected}
				items={items}
				cols={3}
				rows={selectedMenu === "Buy" ? 2 : 3}
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

export default Market;
