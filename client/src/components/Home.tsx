import { memo } from "react";
import { motion } from "framer-motion";
import { topIn } from "../context/AnimationProvider";
import { usePlayer } from "../context/usePlayerContext";
import { getItems } from "../utils";

const Home = memo(() => {
	const { inventory } = usePlayer();
	const amounts = getItems(inventory).map((itemProp) => itemProp.amount).reduce((acc, amount) => {
		
	});
	return (
		<div className="container flex justify-center items-center h-full">
			<motion.div
				variants={topIn}
        initial="initial"
        animate="animate"
        exit="revert"
				className="border-2 border-amber-950 bg-rose-950 bg-opacity-80 w-full h-1/3 rounded-lg flex justify-center text-white pt-2"
				>
					<div>
						hello
					</div>
			</motion.div>
		</div>
	);
})

export default Home;
