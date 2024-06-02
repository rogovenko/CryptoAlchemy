import { memo } from "react";
import { motion } from "framer-motion";
import { topIn } from "../context/AnimationProvider";
import { usePlayer } from "../context/usePlayerContext";
import { getItems } from "../utils";
import Loader from "./Loader";

const Home = memo(() => {
	const { inventory, spawn, account } = usePlayer();
	const loading = getItems(inventory)
	.map((itemProp) => itemProp.amount)
	.reduce((acc, amount) => {
		if (amount !== -1) {
			return false;
		}
		return true;
	}, false);
	console.log(loading);

	const handleSpawn = () => {
		if (account) {
			spawn(account);
		}
	};

	return (
		<div className="container flex justify-center items-center h-full">
			<motion.div
				variants={topIn}
        initial="initial"
        animate="animate"
        exit="revert"
				className="border-2 border-amber-950 bg-gray-500 w-full rounded-lg flex justify-center items-center text-white p-2"
				>
					<div>
						{!loading
							? <Loader />
							: (
								<div className="flex flex-col justify-center items-center">
									Welcome to the game!
									<div>
										<button
											className="default-button"
											onClick={handleSpawn}>
											Start
										</button>
									</div>
								</div>
								)
						}
					</div>
			</motion.div>
		</div>
	);
})

export default Home;
