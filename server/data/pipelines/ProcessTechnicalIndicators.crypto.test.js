import { CryptoProcessTechnicalIndicators } from "../pipelines/ProcessTechnicalIndicators.crypto.js";

const pipelineResult = await CryptoProcessTechnicalIndicators({
	symbols: [
		"BTC",
		"ETH",
	],
	indicators: [
		{
			fn: "sma",
			cols: [ [ "close" ], [ "close" ], [ "close" ], [ "close" ], [ "close" ] ],
			args: [ [ 5 ], [ 9 ], [ 14 ], [ 23 ], [ 37 ] ]  // Baseline: 14
		},
		{
			fn: "ema",
			cols: [ [ "close" ], [ "close" ], [ "close" ], [ "close" ], [ "close" ] ],
			args: [ [ 5 ], [ 9 ], [ 14 ], [ 23 ], [ 37 ] ]  // Baseline: 14
		},
		{
			fn: "rsi",
			cols: [ [ "close" ], [ "close" ], [ "close" ], [ "close" ], [ "close" ] ],
			args: [ [ 5 ], [ 9 ], [ 14 ], [ 23 ], [ 37 ] ]  // Baseline: 14
		},
		{
			fn: "macd",
			cols: [ [ "close" ], [ "close" ], [ "close" ], [ "close" ], [ "close" ] ],
			args: [ [ 7, 11, 5 ], [ 12, 19, 8 ], [ 12, 26, 9 ], [ 20, 33, 14 ], [ 33, 53, 22 ] ]  // Baseline: 12, 26, 9
		},
		// {
		// 	fn: "bollinger",
		// 	cols: [ [ "close" ], [ "close" ], [ "close" ], [ "close" ], [ "close" ] ],
		// 	args: [ [ 8, 2 ], [ 13, 2 ], [ 20, 2 ], [ 32, 2 ], [ 52, 2 ] ]  // Baseline: 20, 2
		// },
		// {
		// 	fn: "stoch",
		// 	cols: [ [ "high", "low", "close" ], [ "high", "low", "close" ], [ "high", "low", "close" ], [ "high", "low", "close" ], [ "high", "low", "close" ] ],
		// 	args: [ [ 5, 3, 3 ], [ 9, 3, 3 ], [ 14, 3, 3 ], [ 23, 3, 3 ], [ 37, 3, 3 ] ]  // Baseline: 14, 3, 3
		// },
		// {
		// 	fn: "willr",
		// 	cols: [ [ "high", "low", "close" ], [ "high", "low", "close" ], [ "high", "low", "close" ], [ "high", "low", "close" ], [ "high", "low", "close" ] ],
		// 	args: [ [ 5 ], [ 9 ], [ 14 ], [ 23 ], [ 37 ] ]  // Baseline: 14
		// },
		// {
		// 	fn: "adx",
		// 	cols: [ [ "high", "low", "close" ], [ "high", "low", "close" ], [ "high", "low", "close" ], [ "high", "low", "close" ], [ "high", "low", "close" ] ],
		// 	args: [ [ 5 ], [ 9 ], [ 14 ], [ 23 ], [ 37 ] ]  // Baseline: 14
		// },
		// {
		// 	fn: "atr",
		// 	cols: [ [ "high", "low", "close" ], [ "high", "low", "close" ], [ "high", "low", "close" ], [ "high", "low", "close" ], [ "high", "low", "close" ] ],
		// 	args: [ [ 5 ], [ 9 ], [ 14 ], [ 23 ], [ 37 ] ]  // Baseline: 14
		// },
		// {
		// 	fn: "cci",
		// 	cols: [ [ "high", "low", "close" ], [ "high", "low", "close" ], [ "high", "low", "close" ], [ "high", "low", "close" ], [ "high", "low", "close" ] ],
		// 	args: [ [ 8 ], [ 13 ], [ 20 ], [ 32 ], [ 52 ] ]  // Baseline: 20
		// }
	],
	delay: 0,
});