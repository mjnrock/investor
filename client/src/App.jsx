import { Routes, Route } from "react-router-dom";

import { CryptoChart } from "./pages/CryptoChart";
import { Default } from "./pages/Default";

export function App() {
	return (
		<Routes>
			<Route path="/crypto/chart/:symbol/:chartType" element={ <CryptoChart /> } />
			<Route path="/" element={ <Default /> } />
		</Routes>
	);
};

export default App;