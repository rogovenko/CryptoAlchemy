import React from 'react';

export interface ItemProps {
  imgPath: string;
  amount: number;
}

const Item: React.FC<ItemProps> = ({ imgPath, amount }) => {
  return (
    <div className="bg-amber-950 bg-opacity-50 p-1 rounded border-2 border-black">
      <div className="relative w-full h-full">
        <div
          className="absolute top-0 left-0 -translate-y-1/4 text-white"
          style={{ textShadow: '0 0 5px black, 0 0 7px black' }}
        >
          {amount}
        </div>
        <img
          src={imgPath}
          alt="Item"
          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
        />
      </div>
    </div>
  );
};

export default Item;
