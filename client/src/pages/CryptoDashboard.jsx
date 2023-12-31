import React from "react";
import { CryptoChart } from "../components/CryptoChart";

export function Dashboard() {
	const chartConfigs = [
		{ symbol: "BTC.ema", chartType: "bar" },
		{ symbol: "BTC.sma", chartType: "bar" },
		{ symbol: "ETH.ema", chartType: "bar" },
		{ symbol: "ETH.sma", chartType: "bar" },
	];

	return (
		<div style={ { display: "grid", gridTemplateColumns: "1fr 1fr", gridGap: "20px" } }>
			{ chartConfigs.map((config, index) => (
				<CryptoChart key={ index } symbol={ config.symbol } initialChartType={ config.chartType } />
			)) }
		</div>
	);
}

export default Dashboard;
