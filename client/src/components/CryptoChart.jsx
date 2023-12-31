import queryString from "query-string";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { PlotlyChart } from "../components/PlotlyChart";

export function CryptoChart({ symbol, initialChartType }) {
	const [ chartType, setChartType ] = useState(initialChartType);
	const [ domain, setDomain ] = useState("crypto"); // Default to 'crypto'
	const [ schema, setSchema ] = useState(null);
	const [ searchParams ] = useSearchParams();

	const url = useMemo(() => {
		const baseUrl = `https://kiszka.com:3801/file/chart/${ domain }:indicator`;
		return `${ baseUrl }/${ symbol }.dsp?index=5&chartType=${ chartType }`;
	}, [ symbol, chartType, domain ]);

	useEffect(() => {
		fetch(url)
			.then(res => res.json())
			.then(data => setSchema(data));
	}, [ url, searchParams ]);

	if(!schema) {
		return "Loading...";
	}

	const chartKey = `${ symbol }-${ chartType }-${ queryString.stringify(Object.fromEntries(searchParams)) }`;

	return (
		<div>
			<h1>{ symbol.toUpperCase() } Chart</h1>
			<select value={ domain } onChange={ (e) => setDomain(e.target.value) }>
				<option value="crypto">Crypto</option>
				<option value="stock">Stock</option>
			</select>
			<select value={ chartType } onChange={ (e) => setChartType(e.target.value) }>
				<option value="bar">Bar</option>
				<option value="line">Line</option>
				<option value="candlestick">Candlestick</option>
			</select>
			<PlotlyChart key={ chartKey } schema={ schema } />
		</div>
	);
}

export default CryptoChart;