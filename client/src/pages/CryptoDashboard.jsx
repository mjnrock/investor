import React, { useState } from "react";
import { CryptoChart } from "../components/CryptoChart";

export function Dashboard() {
	const [ rows, setRows ] = useState(2);
	const [ columns, setColumns ] = useState(2);
	const [ chartConfigs, setChartConfigs ] = useState([
		{ symbol: "BTC.ema", chartType: "bar" },
		{ symbol: "BTC.sma", chartType: "bar" },
		{ symbol: "ETH.ema", chartType: "bar" },
		{ symbol: "ETH.sma", chartType: "bar" },
	]);

	const addChartPane = () => {
		setChartConfigs([ ...chartConfigs, { symbol: "New Symbol", chartType: "bar" } ]);
	};

	const removeChartPane = (index) => {
		const newConfigs = chartConfigs.filter((_, cfgIndex) => cfgIndex !== index);
		setChartConfigs(newConfigs);
	};

	return (
		<div>
			<div className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-white shadow-md">
				<div>
					<button className="p-2 mr-2 text-white bg-blue-500 rounded" onClick={ addChartPane }>Add Chart</button>
					<span className="text-neutral-700">Grid Size: { rows } rows x { columns } columns</span>
				</div>
				<div>
					<button className="p-2 mr-2 text-white bg-green-500 rounded" onClick={ () => setRows(rows + 1) }>Add Row</button>
					<button className="p-2 mr-2 text-white bg-green-500 rounded" onClick={ () => setColumns(columns + 1) }>Add Column</button>
					<button className="p-2 mr-2 text-white bg-red-500 rounded" onClick={ () => setRows(rows > 1 ? rows - 1 : 1) }>Remove Row</button>
					<button className="p-2 text-white bg-red-500 rounded" onClick={ () => setColumns(columns > 1 ? columns - 1 : 1) }>Remove Column</button>
				</div>
			</div>
			<div className="p-4 mt-20">
				<div style={ { display: 'grid', gridTemplateColumns: `repeat(${ columns }, 1fr)`, gridGap: '20px' } }>
					{ chartConfigs.map((config, index) => (
						<div key={ index } className="p-2 bg-white border border-solid rounded shadow border-neutral-200 text-neutral-700">
							<CryptoChart symbol={ config.symbol } initialChartType={ config.chartType } />
							<button className="p-2 mt-2 text-white bg-red-500 rounded" onClick={ () => removeChartPane(index) }>Remove</button>
						</div>
					)) }
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
