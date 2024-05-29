import { PlayerState } from "./context/usePlayerContext";

// REMOVE ON PROD
declare global {
  interface Window {
    inventory: InventoryType;
    state: PlayerState;
  }
}
// REMOVE ON PROD

export const itemsMap = {
	item0_count: "green",
	item1_count: "blue",
	item2_count: "red",
	item3_count: "legendary",
} as const;

export type Items = keyof typeof itemsMap;
export type ItemValues = typeof itemsMap[keyof typeof itemsMap];
export const inventoryKeys: ItemValues[] = Object.values(itemsMap);

export type InventoryType = Record<typeof inventoryKeys[number], number>;