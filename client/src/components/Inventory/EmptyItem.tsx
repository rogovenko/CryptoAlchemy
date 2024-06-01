import React, { memo } from "react";

export interface EmptyItemProps {
  id?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const EmptyItem: React.FC<EmptyItemProps> = memo(({ onClick }) => {
  return (
    <div
      className="p-1 rounded"
      onClick={onClick}
      >
      <div className="relative w-full h-full">
        <img
          src={"/src/assets/trees-nobg.svg"}
          alt={`no_item`}
          style={{ objectFit: 'cover', width: '100%', height: '100%', opacity: "0" }}
        />
      </div>
    </div>
  );
});

export default EmptyItem;
