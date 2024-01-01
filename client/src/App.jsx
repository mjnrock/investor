import { Routes, Route } from "react-router-dom";

import { Default } from "./pages/Default";

export function App() {
	return (
		<Routes>
			<Route path="/" element={ <Default /> } />
		</Routes>
	);
};

export default App;