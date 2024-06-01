import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from "react";
import { useDojo } from "../dojo/useDojo";
import { Entity } from "@dojoengine/recs";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { AccountInterface } from "starknet";
import { useComponentValue } from "@dojoengine/react";
import { InventoryType, Items, itemsMap } from "../global";
// import isEqual from 'lodash/isEqual';

export interface PlayerState {
	inventory: InventoryType,
	hp: number;
	clicks: number;
	playerId: bigint;
}

const defaultPlayerState: PlayerState = {
	inventory: {
		green: -1,
		blue: -1,
		red: -1,
		legendary: -1,
	},
	hp: -1,
	clicks: -1,
	playerId: BigInt(-1),
}

interface PlayerContextType extends PlayerState {
	lastDroppedItem?: Items;
	setLastDroppedItem: React.Dispatch<React.SetStateAction<Items | undefined>>;
	didGetHit: number;
	setDidGetHit: React.Dispatch<React.SetStateAction<number>>;
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
	const spawn = useCallback((acc: AccountInterface) => setup.systemCalls.spawn(acc), [setup]);
	const Inventory = useMemo(() => setup.clientComponents.Inventory, [setup]);

	// TODO replace w/ auth
  const [localAccount, setLocal] = useState<AccountInterface | undefined>();
	const [didSpawn, setDidSpawn] = useState(false);

	useEffect(() => {
		const acc = localStorage.getItem("localAccount");
		if (acc) {
			try {
				const accInt = JSON.parse(acc);
				console.log("GOT ACC FROM CACHE");
				setLocal(accInt);
			} catch {
				localStorage.setItem("localAccount", JSON.stringify(account.account));
				setLocal(localAccount);
			}
		} else {
			localStorage.setItem("localAccount", JSON.stringify(account.account));
			setLocal(localAccount);
		}
	}, [account.account]);

	useEffect(() => {
		if (localAccount && !didSpawn) {
			console.log("SPAWN");
			spawn(localAccount);
			setDidSpawn(true);
		}
	}, [localAccount, didSpawn, spawn]);

	const entityId = getEntityIdFromKeys([
		BigInt(account?.account.address),
	]) as Entity;

	const inventory = useComponentValue(Inventory, entityId);
	const state = useComponentValue(setup.clientComponents.State, entityId);
	const _moves = useComponentValue(setup.clientComponents.Moves, entityId);
	const _position = useComponentValue(setup.clientComponents.Position, entityId);

	const [lastDroppedItem, setLastDroppedItem] = useState<Items| undefined>();
	const [didGetHit, setDidGetHit] = useState<number>(-1);
	const [playerState, setPlayerState] = useState<PlayerState>(defaultPlayerState);

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
				if (inventory[typed] > playerState.inventory[itemsMap[typed]]) {
					setLastDroppedItem(typed);
				}
				if (!isNaN(inventory[typed])) {
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
	}, [playerState.hp, playerState.clicks, state]);

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
