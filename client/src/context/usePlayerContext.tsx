import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from "react";
import { useDojo } from "../dojo/useDojo";
import { Entity } from "@dojoengine/recs";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { AccountInterface } from "starknet";
import { useComponentValue } from "@dojoengine/react";
import { InventoryType, Items, itemsMap } from "../global";
// import isEqual from 'lodash/isEqual';

interface Slot {
	player: bigint;
	item: number;
	count: number;
	price: number;
}
export interface Shop {
	player: bigint,
	slot1: Slot,
	slot2: Slot,
	slot3: Slot,
	slot4: Slot,
	slot5: Slot,
	slot6: Slot,
}

export interface PlayerState {
	inventory: InventoryType,
	shop: Shop,
	money: number,
	hp: number;
	clicks: number;
	playerId: bigint;
}

const defaultShopState = {
	player: BigInt(-1),
	slot1: {
		player: BigInt(-1),
		item: -1,
		count: -1,
		price: -1,
	},
	slot2: {
		player: BigInt(-1),
		item: -1,
		count: -1,
		price: -1,
	},
	slot3: {
		player: BigInt(-1),
		item: -1,
		count: -1,
		price: -1,
	},
	slot4: {
		player: BigInt(-1),
		item: -1,
		count: -1,
		price: -1,
	},
	slot5: {
		player: BigInt(-1),
		item: -1,
		count: -1,
		price: -1,
	},
	slot6: {
		player: BigInt(-1),
		item: -1,
		count: -1,
		price: -1,
	}
}

const defaultPlayerState: PlayerState = {
	inventory: {
		green: -1,
		blue: -1,
		red: -1,
		legendary: -1,
		trash: -1,
	},
	shop: defaultShopState,
	hp: -1,
	money: -1,
	clicks: -1,
	playerId: BigInt(-1),
}

interface PlayerContextType extends PlayerState {
	lastDroppedItem?: Items;
	setLastDroppedItem: React.Dispatch<React.SetStateAction<Items | undefined>>;
	didGetHit: number;
	setDidGetHit: React.Dispatch<React.SetStateAction<number>>;
	spawn: (acc: AccountInterface) => Promise<void>;
	createShop: (acc: AccountInterface) => Promise<void>;
	createOrder: (account: AccountInterface, item: number, price: number, count: number, shopper: AccountInterface) => Promise<void>;
	giveTrash: (acc: AccountInterface) => Promise<void>;
	setTimestamp: (acc: AccountInterface, timestamp: number) => Promise<void>;
	onFarm: (acc: AccountInterface, count: number) => Promise<void>;
	onCombine: (account: AccountInterface, item_one: number, item_two: number) => Promise<void>;
	account: AccountInterface | undefined,
}

const defaultPlayerContext: PlayerContextType = {
	...defaultPlayerState,
	setLastDroppedItem: () => {
		console.warn("setLastDroppedItem used before init");
	},
	lastDroppedItem: undefined,
	didGetHit: -1,
	setDidGetHit: () => {
		console.warn("setDidGetHit used before init");
	},
	spawn: async (acc: AccountInterface) => {
		console.warn("spawn used before init");
		console.warn("spawn used:", acc);
	},
	giveTrash: async (acc: AccountInterface) => {
		console.warn("giveTrash used before init");
		console.warn("giveTrash used:", acc);
	},
	createShop: async (acc: AccountInterface) => {
		console.warn("createShop used before init");
		console.warn("createShop used:", acc);
	},
	createOrder: async (account: AccountInterface, item: number, price: number, count: number, shopper: AccountInterface) => {
		console.warn("createOrder used before init");
		console.warn("createOrder used:", account, item, price, count, shopper);
	},
	setTimestamp: async (acc: AccountInterface, timestamp: number) => {
		console.warn("setTimestamp used before init");
		console.warn("setTimestamp used:", acc, timestamp);
	},
	onFarm: async (acc: AccountInterface, count: number) => {
		console.warn("onFarm used before init");
		console.warn("onFarm used:", acc, count);
	},
	onCombine: async (acc: AccountInterface, item_one: number, item_two: number) => {
		console.warn("onCombine used before init");
		console.warn("onCombine used:", acc, item_one, item_two);
	},
	account: undefined,
};

const PlayerContext = createContext<PlayerContextType>(defaultPlayerContext);

export const PlayerProvider = ({ children }: { children: React.ReactNode }) => {
	const { setup, account } = useDojo();
	const spawn = useCallback((acc: AccountInterface) => setup.systemCalls.spawn(acc), [setup.systemCalls]);
	const Inventory = useMemo(() => setup.clientComponents.Inventory, [setup.clientComponents.Inventory]);
	const State = useMemo(() => setup.clientComponents.State, [setup.clientComponents.State]);
	const Shop = useMemo(() => setup.clientComponents.Shop, [setup.clientComponents.Shop]);
	const Moves = useMemo(() => setup.clientComponents.Moves, [setup.clientComponents.Moves]);
	const Position = useMemo(() => setup.clientComponents.Position, [setup.clientComponents.Position]);

	// TODO replace w/ auth
  const [localAccount, setLocal] = useState<AccountInterface | undefined>(undefined);
	const [didSpawn, setDidSpawn] = useState(false);

	useEffect(() => {
		setLocal(account.account);
		// const acc = localStorage.getItem("localAccount");
		// if (acc) {
		// 	try {
		// 		const accInt = JSON.parse(acc);
		// 		console.log("GOT ACC FROM CACHE");
		// 		if (localAccount !== accInt) {
		// 			setLocal(accInt);
		// 		}
		// 	} catch {
		// 		localStorage.setItem("localAccount", JSON.stringify(account.account));
		// 		setLocal(account.account);
		// 	}
		// } else {
		// 	localStorage.setItem("localAccount", JSON.stringify(account.account));
		// 	setLocal(account.account);
		// }
	}, [account.account]);

	useEffect(() => {
		if (localAccount && !didSpawn) {
			console.log("SPAWN");
			setup.systemCalls.item_trash(account.account);
			setup.systemCalls.setTimestamp(localAccount, Date.now());
			// spawn(account.account);
			spawn(localAccount);
			setDidSpawn(true);
		}
	}, [localAccount, didSpawn, spawn]);

	// const [entityId, setEntity] = useState<Entity>(getEntityIdFromKeys([
	// 	BigInt(account.account.address),
	// ]));
	// useEffect(() => {
	// 	if (account.account) {
	// 		setEntity(getEntityIdFromKeys([
	// 			BigInt(account.account.address),
	// 		]))
	// 	}
	// }, [account.account]);
	const entityId = getEntityIdFromKeys([
        BigInt(account?.account.address),
    ]) as Entity;

	const inventory = useComponentValue(Inventory, entityId);
	const state = useComponentValue(State, entityId);
	const shopComponent = useComponentValue(Shop, entityId);
	// 0x5932c3345b337e33c92a2ead19527941c072ae252c5c961734b75cbddc32be2
	// const shopId = getEntityIdFromKeys([
	// 	BigInt(`0x5932c3345b337e33c92a2ead19527941c072ae252c5c961734b75cbddc32be2`),
	// ]) as Entity;
	// const shopComponent = useComponentValue(setup.clientComponents.Shop, shopId);
	console.log(state, inventory, entityId);
	console.log("ACCOUNT addres", account.account.address);
	const _moves = useComponentValue(Moves, entityId);
	const _position = useComponentValue(Position, entityId);

	const [clipboardStatus, setClipboardStatus] = useState({
        message: "",
        isError: false,
    });

	const _handleRestoreBurners = async () => {
		try {
					await account?.applyFromClipboard();
					setClipboardStatus({
							message: "Burners restored successfully!",
							isError: false,
					});
			} catch (error) {
					setClipboardStatus({
							message: `Failed to restore burners from clipboard`,
							isError: true,
					});
			}
	};

	useEffect(() => {
			if (clipboardStatus.message) {
					const timer = setTimeout(() => {
							setClipboardStatus({ message: "", isError: false });
					}, 3000);

					return () => clearTimeout(timer);
			}
	}, [clipboardStatus.message]);

	const [lastDroppedItem, setLastDroppedItem] = useState<Items| undefined>();
	const [didGetHit, setDidGetHit] = useState<number>(-1);
	const [playerState, setPlayerState] = useState<PlayerState>(defaultPlayerState);
	const [shop, setShop] = useState<Shop>(defaultShopState);

	useEffect(() => {
		for (const item in inventory) {
			if (item === "player") {
				if (playerState.playerId === BigInt(-1) && inventory[item]) {
					setPlayerState((prevState) => ({
						...prevState,
						playerId: inventory[item],
				}));
				}
			} else if (item in itemsMap) {
				const typed = item as Items;
				console.log(typed, inventory);
				if (!isNaN(inventory[typed])) {
					if (
						inventory[typed] !== 0 &&
						inventory[typed] - 1 === playerState.inventory[itemsMap[typed]] &&
						inventory[typed] > playerState.inventory[itemsMap[typed]]
					) {
						console.log("JUST DROPPED", typed);
						setLastDroppedItem(typed);
					}
					setPlayerState((prevState) => ({
						...prevState,
						inventory: {
								...prevState.inventory,
								[itemsMap[typed]]: inventory[typed],
						}
					}));
				}
			}
		}
	}, [inventory]);

	useEffect(() => {
		console.log(state?.timestamp);
		if (
			state
			&& state.health !== undefined
			&& !isNaN(state.health)
		) {
			if (state.health < playerState.hp) {
				setDidGetHit(playerState.hp - state.health);
			}
			setPlayerState((prevState) => ({
				...prevState,
				hp: state.health,
			}));
		}
		if (
			state
			&& state.points !== undefined
			&& !isNaN(state.points)
		) {
			setPlayerState((prevState) => ({
				...prevState,
				clicks: state.points,
			}));
		}
	}, [inventory, playerState.hp, playerState.clicks, state]);

	useEffect(() => {
		console.log("NEW SHOP COMPONENT", shopComponent, shop);
		for (const item in shopComponent) {
			console.log("SETTING...", item);
			if (item === "player") {
				if (playerState.shop.player === BigInt(-1) && shopComponent[item]) {
					setShop((prevState) => ({
						...prevState,
						player: shopComponent[item],
					}));
				}
			} else {
				console.log("setting", item, shopComponent[item]);
				setShop((prevState) => ({
					...prevState,
					[item]: shopComponent[item],
				}));
			}
		}
	}, [shopComponent]);

	// useEffect(() => {
	// 	console.log("PLAYER STATE UF")
	// 	if (isEqual(playerState, defaultPlayerState)) {
	// 		console.log("PLAYER STATE UF -- same");
	// 		account.create();
	// 		setDidSpawn(false);
	// 	}
	// }, [playerState]);

  return (
    <PlayerContext.Provider
			value={{
				...playerState,
				lastDroppedItem,
				setLastDroppedItem,
				didGetHit,
				setDidGetHit,
				spawn: spawn,
				giveTrash: setup.systemCalls.item_trash,
				setTimestamp: setup.systemCalls.setTimestamp,
				shop: shop,
				createShop: setup.systemCalls.create_shop,
				createOrder: setup.systemCalls.create_bid,
				onFarm: setup.systemCalls.add_item_rnd,
				onCombine: setup.systemCalls.combine_items,
				account: account.account,
			}}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (context === null) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
