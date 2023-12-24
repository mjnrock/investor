import { useState, useEffect } from "react";
import { PlotlyChart } from "../components/PlotlyChart.jsx";

export function Default() {
	const [ schema, setSchema ] = useState(null);

	useEffect(() => {
		fetch("https://kiszka.com:3801/crypto/chart/BTC?chartType=candlestick")
			.then((res) => res.json())
			.then((data) => setSchema(data));
	}, []);

	if(!schema) {
		return "Loading...";
	}

	return (
		<div>
			<h1>API</h1>

			<PlotlyChart
				schema={ schema }
			/>
		</div>
	);
};

export default Default;