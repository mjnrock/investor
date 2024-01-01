import queryString from "query-string";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { PlotlyChart } from "../components/PlotlyChart";

export function CryptoChart({ initialChartType }) {
	const [ chartType, setChartType ] = useState(initialChartType);
	const [ domain, setDomain ] = useState("crypto");
	const [ symbol, setSymbol ] = useState("BTC");
	const [ dataOption, setDataOption ] = useState("data"); // "data" or "indicator"
	const [ indicatorType, setIndicatorType ] = useState("");
	const [ index, setIndex ] = useState(0); // New state for managing index
	const [ symbols, setSymbols ] = useState([]);
	const [ indicatorTypes, setIndicatorTypes ] = useState([]);
	const [ schema, setSchema ] = useState(null);
	const [ searchParams, setSearchParams ] = useSearchParams();

	const fsUrl = `https://kiszka.com:3801/file/ls/${ domain }`;

	useEffect(() => {
		fetch(fsUrl)
			.then(res => res.json())
			.then(data => {
				const uniqueSymbols = Array.from(new Set(data.data.map(item => item.name.split(".")[ 0 ])))
					.filter(sym => sym === sym.toUpperCase());
				setSymbols(uniqueSymbols);
			});
	}, [ domain ]);

	useEffect(() => {
		if(dataOption === "indicator") {
			fetch(fsUrl)
				.then(res => res.json())
				.then(data => {
					const indicators = data.data
						.filter(item => item.type === "file" && item.pid && item.name.includes(`${ symbol }.`))
						.map(item => item.name.split(".")[ 1 ]);
					const uniqueIndicators = Array.from(new Set(indicators));
					setIndicatorTypes(uniqueIndicators);
					if(uniqueIndicators.length > 0) {
						setIndicatorType(uniqueIndicators[ 0 ]);
					}
				});
		}
	}, [ symbol, dataOption, fsUrl ]);

	const url = useMemo(() => {
		let adjustedDomain = dataOption === "indicator" ? `${ domain }:indicator` : domain;
		const baseUrl = `https://kiszka.com:3801/file/chart/${ adjustedDomain }`;
		let endpoint = `${ baseUrl }/${ symbol }.${ dataOption === "indicator" ? indicatorType + ".dsp" : "ds" }`;
		if(dataOption === "indicator") {
			endpoint += `?index=${ index }`;
		}
		return endpoint;
	}, [ symbol, dataOption, indicatorType, domain, index ]);

	useEffect(() => {
		fetch(url)
			.then(res => res.json())
			.then(data => setSchema(data));
	}, [ url ]);

	if(!schema) {
		return "Loading...";
	}

	const chartKey = `${ symbol }-${ chartType }-${ queryString.stringify(Object.fromEntries(searchParams)) }`;

	return (
		<div>
			<h1>{ symbol } Chart</h1>
			<div className="flex flex-row mb-4 space-x-2">
				<select
					className="p-2 bg-white border border-solid rounded shadow cursor-pointer border-neutral-200 text-neutral-700 hover:bg-neutral-100"
					value={ domain }
					onChange={ e => setDomain(e.target.value) }
				>
					<option value="crypto">Crypto</option>
					<option value="stock">Stock</option>
				</select>
				<select
					className="p-2 bg-white border border-solid rounded shadow cursor-pointer border-neutral-200 text-neutral-700 hover:bg-neutral-100"
					value={ symbol }
					onChange={ e => setSymbol(e.target.value) }
				>
					{ symbols.map(sym => (
						<option key={ sym } value={ sym }>
							{ sym }
						</option>
					)) }
				</select>
				<select
					className="p-2 bg-white border border-solid rounded shadow cursor-pointer border-neutral-200 text-neutral-700 hover:bg-neutral-100"
					value={ dataOption }
					onChange={ e => setDataOption(e.target.value) }
				>
					<option value="data">Data</option>
					<option value="indicator">Indicator</option>
				</select>
				{ dataOption === "indicator" && (
					<>
						<select
							className="p-2 bg-white border border-solid rounded shadow cursor-pointer border-neutral-200 text-neutral-700 hover:bg-neutral-100"
							value={ indicatorType }
							onChange={ e => setIndicatorType(e.target.value) }
						>
							{ indicatorTypes.map(type => (
								<option key={ type } value={ type }>
									{ type }
								</option>
							)) }
						</select>
						<input
							className="p-2 bg-white border border-solid rounded shadow border-neutral-200 text-neutral-700"
							type="number"
							min="0"
							step="1"
							value={ index }
							onChange={ e => setIndex(parseInt(e.target.value, 10)) }
							style={ { marginLeft: '10px' } }
						/>
					</>
				) }
			</div>
			<PlotlyChart key={ chartKey } schema={ schema } />
		</div>
	);
}

export default CryptoChart;