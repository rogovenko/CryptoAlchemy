import React, { memo, useMemo, useRef, useState } from "react";
import Item from "./Item";
import { ItemProps } from "./Item";

export interface InventoryProps {
  items: ItemProps[];
  cols: number;
  rows: number;
}

const Inventory: React.FC<InventoryProps> = memo(({ items, cols, rows }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const invRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = cols * rows;
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const handlePageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentPage(Number(event.target.value));
  };

  const memoizedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return (
      items
      .filter((item) => item.amount > 0)
      .slice(startIndex, endIndex)
      .map((item, index) => (
        <Item key={index} imgPath={item.imgPath} amount={item.amount} />
      ))
    );
  }, [items, currentPage, itemsPerPage]);

  return (
    <div className="border-2 border-amber-950 grow w-full bg-rose-950 bg-opacity-70 max-h-1/3 rounded-lg flex flex-col">
      <div
        ref={invRef}
        className="grid gap-4 p-4 flex-grow"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
        }}
        >
        {memoizedItems}
      </div>
      <div className="p-1 bg-gray-800 bg-opacity-50 rounded-b-lg flex justify-between items-center ring-2 ring-black">
        <button 
          className="default-button bg-opacity-50"
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {totalPages === 0 ? (
          <div className="default-button bg-opacity-50">1</div>
        ) : (
          <select 
            className="default-button bg-opacity-50" 
            value={currentPage}
            onChange={handlePageChange}
          >
            {Array.from({ length: totalPages }, (_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}
          </select>
        )}
        <button 
          className="default-button bg-opacity-50" 
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
});


export default Inventory;
