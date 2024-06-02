import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import Farm from "./components/Farm";
import Craft from "./components/Craft";
import Market from "./components/Market";
import { usePlayer } from "./context/usePlayerContext";
import Home from "./components/Home";
import RedirectWrapper from "./components/RedirectWrapper";

const AnimatedRoutes: React.FC = () => {
	const location = useLocation();
	const state = usePlayer();

	return (
		<Routes location={location} key={location.key}>
			<Route path="/farm" element={<Farm onFarm={state.onFarm} account={state.account} />} />
			<Route path="/craft" element={<Craft onCombine={state.onCombine} account={state.account} />} />
			<Route path="/market" element={<Market shop={state.shop} createOrder={state.createOrder} createShop={state.createShop} account={state.account} />} />
			<Route path="/" element={<RedirectWrapper><Home /></RedirectWrapper>} />
			<Route path="*" element={<Navigate to="/farm" />} />
		</Routes>
	)
}

export default AnimatedRoutes;