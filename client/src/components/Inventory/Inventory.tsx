import React, { memo, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { botIn } from "../../context/AnimationProvider";
import Item from "./Item";
import { ItemProps } from "./Item";
import { ItemSelection } from "../../global";
import EmptyItem from "./EmptyItem";

export interface InventoryProps {
  items: ItemProps[];
  cols: number;
  rows: number;
  handleItemPick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  selection?: ItemSelection;
  showNulls?: boolean;
  className?: string;
}

const Inventory: React.FC<InventoryProps> = memo(({
  items,
  cols,
  rows,
  handleItemPick,
  selection,
  showNulls = true,
  className,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const invRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = cols * rows;
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const handlePageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentPage(Number(event.target.value));
  };

  const memoizedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    let total = 0;
    const filterd = items
    .slice(startIndex, endIndex)
    .filter((item) => item.amount !== -1)
    .map((item) => {
      if (selection) {
        console.log(selection);
        if (
          selection[0] && selection[1]
          && selection[0].item === selection[1].item && item.name === selection[0].item
        ) {
          total += item.amount - selection[0].amount - selection[1].amount;
          return { ...item, amount: item.amount - selection[1].amount - selection[1].amount };
        } 
        if (selection[0] && item.name === selection[0].item) {
          total += item.amount - selection[0].amount;
          return { ...item, amount: item.amount - selection[0].amount };
        }
        if (selection[1] && item.name === selection[1].item) {
          total += item.amount - selection[1].amount;
          return { ...item, amount: item.amount - selection[1].amount };
        }
      }
      total += item.amount;
      return item;
    });
    setTotalItems(total);
    return (
      filterd.map((item, index) => (
        <Item
          onClick={handleItemPick}
          key={index}
          name={item.name}
          imgPath={item.imgPath}
          amount={item.amount}
          showNulls={showNulls}
          />
      ))
    );
  }, [items, currentPage, itemsPerPage, handleItemPick, selection, showNulls]);

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="revert"
      variants={botIn}
      className={
      `border-2 border-amber-950 bg-rose-950 bg-opacity-70 rounded-lg
      grow w-full max-h-1/3 flex flex-col ${className}`}>
      <div
        ref={invRef}
        className="grid gap-4 p-4 flex-grow"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
        }}
        >
        {memoizedItems.length > 0 && totalItems > 0 ? memoizedItems : <EmptyItem />}
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
    </motion.div>
  );
});


export default Inventory;
