import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from "react";
import { useDojo } from "../dojo/useDojo";
import { Entity } from "@dojoengine/recs";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { AccountInterface } from "starknet";
import { useComponentValue } from "@dojoengine/react";

interface PlayerState {
	inventory: {
		green: number;
		blue: number;
		red: number;
		legendary: number,
	},
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

export type Items = "item0_count" | "item1_count" | "item2_count" | "item3_count";

type ItemsMap = {
	[key in Items]: string;
}

export const itemsMap: ItemsMap = {
	item0_count: "green",
	item1_count: "blue",
	item2_count: "red",
	item3_count: "legendary",
};


interface PlayerContextType extends PlayerState {
	lastItem?: Items;
}

const defaultPlayerContext: PlayerContextType = {
	...defaultPlayerState,
	lastItem: undefined,
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
				setLocal(accInt);
			} catch {
				localStorage.setItem("localAccount", JSON.stringify(account.account));
				setLocal(localAccount);
			}
		} else {
			localStorage.setItem("localAccount", JSON.stringify(account.account));
			setLocal(localAccount);
		}
	}, [account.account, localAccount]);

	useEffect(() => {
		if (localAccount && !didSpawn) {
			spawn(localAccount);
			setDidSpawn(true);
		}
	}, [localAccount, didSpawn, spawn]);

	const entityId = getEntityIdFromKeys([
		BigInt(account?.account.address),
	]) as Entity;

	const inventory = useComponentValue(Inventory, entityId);
	const state = useComponentValue(setup.clientComponents.State, entityId);
	const moves = useComponentValue(setup.clientComponents.Moves, entityId);
	const position = useComponentValue(setup.clientComponents.Position, entityId);

	const [lastItem, setLastItem] = useState<Items| undefined>();
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
				if (playerState.inventory[itemsMap[typed]] === -1
					|| playerState.inventory[itemsMap[typed]] < inventory[typed]
				) {
					setPlayerState((prevState) => ({
						...prevState,
						inventory: {
								...prevState.inventory,
								[itemsMap[typed]]: inventory[typed],
						}
					}));
					setLastItem(typed);
				}
			}
		}
	}, [inventory, playerState]);

	useEffect(() => {
		if (
			state
			&& state.health
			&& (playerState.hp === -1 || state.health < playerState.hp)
		) {
			setPlayerState((prevState) => ({
				...prevState,
				hp: state.health,
			}));
		}
		if (
			state
			&& state.points
			&& (playerState.clicks === -1 || state.points < playerState.clicks)
		) {
			setPlayerState((prevState) => ({
				...prevState,
				clicks: state.points,
			}));
		}
	}, [playerState.hp, playerState.clicks, state]);

  return (
    <PlayerContext.Provider value={{ ...playerState, lastItem }}>
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
