import { ItemProps } from "../components/Inventory";
import { inventoryKeys, InventoryType } from "../global";

export enum Direction {
    Left = 1,
    Right = 2,
    Up = 3,
    Down = 4,
}

export function updatePositionWithDirection(
    direction: Direction,
    value: { vec: { x: number; y: number } }
) {
    switch (direction) {
        case Direction.Left:
            value.vec.x--;
            break;
        case Direction.Right:
            value.vec.x++;
            break;
        case Direction.Up:
            value.vec.y--;
            break;
        case Direction.Down:
            value.vec.y++;
            break;
        default:
            throw new Error("Invalid direction provided");
    }
    return value;
}

export const itemsPathsMap = {
    green: "/src/assets/green_potion_nobg.svg",
    blue: "/src/assets/blue_potion_nobg.svg",
    red: "/src/assets/red_potion_nobg.svg",
    legendary: "/src/assets/legendary_nobg.svg",
    trash: "/src/assets/trees-nobg.svg"
} as const;

export const pathnamesMap = {
    "/farm": "Farming jungle",
    "/craft": "Boiling pot",
    "/market": "Trading market",
} as const;

export const getItems = (inventory: InventoryType): ItemProps[] => {
    return inventoryKeys.map((itemName) => ({
        amount: inventory[itemName],
        imgPath: itemsPathsMap[itemName],
        name: itemName,
    }));
}
