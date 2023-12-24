import queryString from "query-string";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { PlotlyChart } from "../components/PlotlyChart.jsx";

export function CryptoChart() {
	const [ schema, setSchema ] = useState(null);
	const { symbol, chartType } = useParams();
	const [ searchParams ] = useSearchParams();

	useEffect(() => {
		// Construct query string from searchParams, adding chartType
		const qpString = queryString.stringify({ ...Object.fromEntries(searchParams), chartType });

		const url = `https://kiszka.com:3801/crypto/chart/${ symbol }` + (qpString ? `?${ qpString }` : "");
		fetch(url)
			.then(res => res.json())
			.then(data => setSchema(data));
	}, [ symbol, chartType, searchParams ]); // Depend on URL parameters and search params

	if(!schema) {
		return "Loading...";
	}

	return (
		<div>
			<h1>{ symbol.toUpperCase() } Chart</h1>
			<PlotlyChart schema={ schema } />
		</div>
	);
}

export default CryptoChart;
