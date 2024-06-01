import React, { memo } from "react";

export interface ItemProps {
  imgPath: string;
  amount: number;
  name: string;
  id?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  showNulls?: boolean;
}

const Item: React.FC<ItemProps> = memo(({ imgPath, amount, onClick, name, id, showNulls = true }) => {
  if (!showNulls && !amount) {
    return;
  }
  return (
    <div
      className="bg-amber-950 bg-opacity-50 p-1 rounded border-2 border-black"
      onClick={onClick}
      id={id || name}
      >
      <div className="relative w-full h-full">
        <div
          className="absolute top-0 left-0 -translate-y-1/4 text-white"
          style={{ textShadow: '0 0 5px black, 0 0 7px black' }}
        >
          {amount ? amount : ""}
        </div>
        <img
          src={imgPath || "/src/assets/pot-nobg.svg"}
          alt={`${name}_item`}
          style={{ objectFit: 'cover', width: '100%', height: '100%', opacity: imgPath ? "100" : "0" }}
        />
      </div>
    </div>
  );
});

export default Item;
