import tulind from "tulind";
import { DataSet } from "../data-set/DataSet.js";

/**
 * Basic mapping of indicator names to output columns
 */
export const INDICATOR_OUTPUT_COLUMNS = {
	abs: [ "value" ],
	acos: [ "value" ],
	ad: [ "value" ],
	add: [ "value" ],
	adosc: [ "value" ],
	adx: [ "value" ],
	adxr: [ "value" ],
	ao: [ "value" ],
	apo: [ "value" ],
	aroon: [ "up", "down" ],
	aroonosc: [ "value" ],
	asin: [ "value" ],
	atan: [ "value" ],
	atr: [ "value" ],
	avgprice: [ "value" ],
	bbands: [ "lower", "middle", "upper" ],
	bop: [ "value" ],
	cci: [ "value" ],
	ceil: [ "value" ],
	cmo: [ "value" ],
	cos: [ "value" ],
	cosh: [ "value" ],
	crossany: [ "value" ],
	crossover: [ "value" ],
	cvi: [ "value" ],
	decay: [ "value" ],
	dema: [ "value" ],
	di: [ "plus", "minus" ],
	div: [ "value" ],
	dm: [ "plus", "minus" ],
	dpo: [ "value" ],
	dx: [ "value" ],
	edecay: [ "value" ],
	ema: [ "value" ],
	emv: [ "value" ],
	exp: [ "value" ],
	fisher: [ "fisher", "signal" ],
	floor: [ "value" ],
	fosc: [ "value" ],
	hma: [ "value" ],
	kama: [ "value" ],
	kvo: [ "value" ],
	lag: [ "value" ],
	linreg: [ "value" ],
	linregintercept: [ "value" ],
	linregslope: [ "value" ],
	ln: [ "value" ],
	log10: [ "value" ],
	macd: [ "macd", "signal", "histogram" ],
	marketfi: [ "value" ],
	mass: [ "value" ],
	max: [ "value" ],
	md: [ "value" ],
	medprice: [ "value" ],
	mfi: [ "value" ],
	min: [ "value" ],
	mom: [ "value" ],
	msw: [ "sine", "leadSine" ],
	mul: [ "value" ],
	natr: [ "value" ],
	nvi: [ "value" ],
	obv: [ "value" ],
	ppo: [ "value" ],
	psar: [ "value" ],
	pvi: [ "value" ],
	qstick: [ "value" ],
	roc: [ "value" ],
	rocr: [ "value" ],
	round: [ "value" ],
	rsi: [ "value" ],
	sin: [ "value" ],
	sinh: [ "value" ],
	sma: [ "value" ],
	sqrt: [ "value" ],
	stddev: [ "value" ],
	stderr: [ "value" ],
	stoch: [ "stochK", "stochD" ],
	stochrsi: [ "value" ],
	sub: [ "value" ],
	sum: [ "value" ],
	tan: [ "value" ],
	tanh: [ "value" ],
	tema: [ "value" ],
	todeg: [ "value" ],
	torad: [ "value" ],
	tr: [ "value" ],
	trima: [ "value" ],
	trix: [ "value" ],
	trunc: [ "value" ],
	tsf: [ "value" ],
	typprice: [ "value" ],
	ultosc: [ "value" ],
	var: [ "value" ],
	vhf: [ "value" ],
	vidya: [ "value" ],
	volatility: [ "value" ],
	vosc: [ "value" ],
	vwma: [ "value" ],
	wad: [ "value" ],
	wcprice: [ "value" ],
	wilders: [ "value" ],
	willr: [ "value" ],
	wma: [ "value" ],
	zlema: [ "value" ]
};


export class ProcessTechnicalIndicators {
	constructor ({ state = {} } = {}) {
		this.state = {
			indicators: [],
			...state,
		};
	}

	static Create({ state = {}, ...rest } = {}) {
		return new ProcessTechnicalIndicators({ state, ...rest });
	}

	async run(input, { } = {}) {
		const indicators = this.state.indicators;

		const processIndicator = async (indicatorName, inputs, args) => {
			return new Promise((resolve, reject) => {
				if(!tulind.indicators[ indicatorName ]) {
					return reject(new Error(`Indicator ${ indicatorName } not found in tulind`));
				}

				tulind.indicators[ indicatorName ].indicator(inputs, args, (err, result) => {
					if(err) {
						return reject(err);
					}
					resolve(result);
				});
			});
		};

		let results = [];
		for(let indicatorConfig of indicators) {
			const { fn: indicatorName, cols, args } = indicatorConfig;

			for(let i = 0; i < cols.length; i++) {
				const colSet = cols[ i ];
				const argSet = args[ i ];

				// Construct input arrays based on cols
				const inputs = colSet.map(col => input.data.map(item => parseFloat(item[ col ])));

				try {
					const indicatorResults = await processIndicator(indicatorName, inputs, argSet);

					// Calculate the starting index for the data to align with the indicator results
					const startIndex = inputs[ 0 ].length - indicatorResults[ 0 ].length;

					const outputCols = INDICATOR_OUTPUT_COLUMNS[ indicatorName ];
					const resultData = input.data.slice(startIndex).map((item, index) => {
						let resultEntry = { date: item.date };
						outputCols.forEach((col, colIndex) => {
							resultEntry[ col ] = indicatorResults[ colIndex ][ index ];
						});
						return resultEntry;
					});

					//STUB: Partial stub, crypto specific -- abstract this kind of thing
					let nextMeta = {
						...input.meta,
						symbol: input.meta.digitalCurrencyCode,
					};
					delete nextMeta.information;
					delete nextMeta.digitalCurrencyName;
					delete nextMeta.marketName;
					delete nextMeta.lastRefreshed;

					results.push(DataSet.Create({
						meta: {
							...nextMeta,
							technicalAnalysis: {
								fn: indicatorName,
								cols: colSet,
								args: argSet
							},
						},
						data: resultData
					}));
				} catch(error) {
					console.error(`Error processing ${ indicatorName }:`, error);
				}
			}
		}

		return results;
	}
}

export default ProcessTechnicalIndicators;