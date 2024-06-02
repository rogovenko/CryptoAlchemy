import { useState, useCallback, memo, useEffect } from "react";
import { motion } from "framer-motion";
import { topIn } from "../context/AnimationProvider";
import { Inventory, Item } from "./Inventory";
import Modal from './Modal';
import { AccountInterface } from "starknet";
import { Shop, usePlayer } from "../context/usePlayerContext";
import { getItems, itemsPathsMap } from "../utils";
import { isItemValue, ItemSelection, itemsMap, itemsNamesMap, ItemValues } from "../global";

interface CraftProps {
	shop: Shop;
  createShop: (acc: AccountInterface) => Promise<void>;
	createOrder: (account: AccountInterface, item: number, price: number, count: number, shopper: AccountInterface) => Promise<void>;
  account: AccountInterface | undefined;
}

interface SelectedItems extends ItemSelection {
	0: { item: ItemValues, amount: number} | undefined;
}

const Market = memo(({ createOrder, createShop, account, shop }: CraftProps) => {
  const [modalState, setModalState] = useState({ isOpen: false, message: "" });
	const [selected, setSelected] = useState<SelectedItems>({ 0: undefined });
  const { lastDroppedItem, inventory } = usePlayer();
  const [selectedMenu, setSelectedMenu] = useState<"Buy" | "Sell">("Buy");
	const [price, setPrice] = useState<number>(0);
  const [amount, setAmount] = useState<number>(0);

  const items = getItems(inventory);

	const handlePick = (e: React.MouseEvent<HTMLDivElement>): void => {
		if (!isItemValue(e.currentTarget.id)) {
			return ;
		}
		setSelected({0: { item: e.currentTarget.id, amount: 1 }});
		setAmount(1);
	}
	
	const handleRemove = (e: React.MouseEvent<HTMLDivElement>): void => {
		const match = e.currentTarget.id.match(/selected(\d+)/);
		if (match) {
			const index = parseInt(match[1], 10);
			setSelected({ ...selected, [index]: undefined });
			setAmount(0);
		}
	}
	console.log("STATE SHOP", shop);

	const handleCreate = () => {
		if (selected[0]) {
			const itemName = itemsNamesMap[selected[0].item];
			const match = itemName.match(/item(\d+)_count/);
			if (match) {
				const n = match[1];
				if (account) {
					createOrder(account, +n, price, amount, account);
					setSelected({ 0: undefined });
					setAmount(0);
					setPrice(0);
				}
			}
		}
	}

	useEffect(() => {
		if (account) {
			createShop(account);
		}
	}, [account]);

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
					? (Object.keys(shop)
					.filter((key) => key !== "player")
					.filter((slot) => shop[slot].count !== 0 && shop[slot].count !== -1)
					.map((value, index) => (
						<div key={index} className="bg-white p-2 border border-black flex">
							<div className="w-1/6">
								<Item
									name={`Item_${shop[value].item}`}
									imgPath={itemsPathsMap[itemsMap[`item${shop[value].item}_count`]]}
									amount={shop[value].count}
									/>
							</div>
							<div className="w-3/4 flex items-center justify-center">
								{itemsMap[`item${shop[value].item}_count`]}, price {shop[value].price}
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
								name={selected[0].item}
								imgPath={itemsPathsMap[selected[0].item]}
								amount={selected[0].amount}
								/>
							) : (
								<Item name={""} imgPath={""} amount={0} />
							)}
						</div>
						<div className="w-1/2 flex flex-col items-center justify-center">
							<div className="w-1/2 flex flex-col">
								<span className="w-full p-2 border border-black">
									{selected[0] ? selected[0].item : "Choose item"}
								</span>
								<input
									type="number"
									placeholder="Price"
									className="w-full p-2 border border-black"
									value={price !== 0 ? price : ""}
									onChange={(e) => setPrice(Number(e.target.value))}
									disabled={selected[0] ? false : true}
									/>
								<select
									className="w-full p-2 border border-black"
									value={amount}
									onChange={(e) => {
										const newAmount = Number(e.target.value);
										setAmount(newAmount);
										setSelected({0: { item: selected[0]?.item, amount: newAmount }});
									}}
									disabled={selected[0] ? false : true}
								>
									{selected[0] && items.find((item) => item.name === selected[0].item)?.amount
										? Array.from({ length: items.find((item) => item.name === selected[0].item).amount }, (_, i) => (
											<option key={i + 1} value={i + 1}>{i + 1}</option>
										))
										: null
									}
								</select>
							</div>
							<button
								className="default-button mt-2"
								onClick={handleCreate}
								disabled={selected[0] && amount && price ? false : true}
								>
									Create order
							</button>
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
