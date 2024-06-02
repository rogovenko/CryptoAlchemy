import { PlayerState } from "./context/usePlayerContext";

// REMOVE ON PROD
declare global {
  interface Window {
    inventory: InventoryType;
    state: PlayerState;
  }
}
// REMOVE ON PROD

export const itemsNamesMap = {
	green: "item0_count",
	blue: "item1_count",
	red: "item2_count",
	legendary: "item3_count",
	trash: "trash",
} as const;

export const itemsMap = {
	item0_count: "green",
	item1_count: "blue",
	item2_count: "red",
	item3_count: "legendary",
	trash: "trash",
} as const;

export type Items = keyof typeof itemsMap;
export type ItemValues = typeof itemsMap[keyof typeof itemsMap];
export const isItemValue = (value: string): value is ItemValues => {
  return Object.keys(itemsNamesMap).includes(value);
};
export const inventoryKeys: ItemValues[] = Object.values(itemsMap);

export type InventoryType = Record<typeof inventoryKeys[number], number>;

export type ItemSelection = Record<number, { item: ItemValues, amount: number } | undefined>;
