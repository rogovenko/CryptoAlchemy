import { Route, Routes, useLocation } from "react-router-dom";
import Farm from "./components/Farm";
import Craft from "./components/Craft";
import Market from "./components/Market";
import { usePlayer } from "./context/usePlayerContext";

const AnimatedRoutes: React.FC = () => {
	const location = useLocation();
	const state = usePlayer();

	return (
		<Routes location={location} key={location.key}>
			<Route path="/farm" element={<Farm onFarm={state.onFarm} account={state.account} />} />
			<Route path="/craft" element={<Craft onCombine={state.onCombine} account={state.account} />} />
			<Route path="/market" element={<Market onCombine={state.onCombine} account={state.account} />} />
		</Routes>
	)
}

export default AnimatedRoutes;