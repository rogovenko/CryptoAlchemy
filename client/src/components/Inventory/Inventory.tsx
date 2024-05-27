import React, { useMemo, useState } from "react";
import Item from "./Item";
import { ItemProps } from "./Item";

export interface InventoryProps {
  items: ItemProps[];
}

const Inventory: React.FC<InventoryProps> = React.memo(({ items }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const handlePageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentPage(Number(event.target.value));
  };

  const memoizedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex).map((item, index) => (
      <Item key={index} imgPath={item.imgPath} amount={item.amount} />
    ));
  }, [items, currentPage]);

  return (
    <div className="border-2 border-amber-950 grow w-full bg-rose-950 bg-opacity-70 max-h-1/3 rounded-lg flex flex-col">
      <div className={`grid grid-cols-3 grid-rows-3 gap-4 p-4 flex-grow`}>
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

Inventory.displayName = "Inventory";

export default Inventory;
