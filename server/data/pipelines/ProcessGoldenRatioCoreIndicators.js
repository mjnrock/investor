import { main as ProcessTechnicalIndicators } from "./ProcessTechnicalIndicators.js";

export async function main({
	type,
	symbols,
	indicators = [],
	context,
}) {
	const GR = 1.618; // Golden Ratio

	// Function to generate scaled arguments
	const scaleArgs = (baseline, count) => {
		let args = [ baseline ];
		for(let i = 1; i < count; i++) {
			if(i < 4) {
				args.unshift(Math.round(baseline / Math.pow(GR, i)));
			} else {
				args.push(Math.round(baseline * Math.pow(GR, i - 1)));
			}
		}
		return args;
	};

	const pipelineResult = await ProcessTechnicalIndicators({
		type,
		context,
		symbols,
		indicators: [
			{
				fn: "sma",
				cols: new Array(9).fill([ "close" ]),
				args: scaleArgs(14, 9).map(period => [ period ])
			},
			{
				fn: "ema",
				cols: new Array(9).fill([ "close" ]),
				args: scaleArgs(14, 9).map(period => [ period ])
			},
			{
				fn: "rsi",
				cols: new Array(9).fill([ "close" ]),
				args: scaleArgs(14, 9).map(period => [ period ])
			},
			{
				fn: "macd",
				cols: new Array(9).fill([ "close" ]),
				args: scaleArgs(12, 9).map(fastPeriod => [ fastPeriod, 26, 9 ]) // Keeping other values constant
			},
			{
				fn: "stoch",
				cols: new Array(9).fill([ "high", "low", "close" ]),
				args: scaleArgs(14, 9).map(period => [ period, 3, 3 ]) // Keeping other values constant
			},
			{
				fn: "stochrsi",
				cols: new Array(9).fill([ "close" ]),
				args: scaleArgs(14, 9).map(period => [ period ])
			},
			{
				fn: "stddev",
				cols: new Array(9).fill([ "close" ]),
				args: scaleArgs(14, 9).map(period => [ period ]) // Keeping deviation constant
			},
			{
				fn: "roc",
				cols: new Array(9).fill([ "close" ]),
				args: scaleArgs(14, 9).map(period => [ period ])
			},
			{
				fn: "rocr",
				cols: new Array(9).fill([ "close" ]),
				args: scaleArgs(14, 9).map(period => [ period ])
			},
			...indicators,
		],
	});

	return pipelineResult;
};

export default main;