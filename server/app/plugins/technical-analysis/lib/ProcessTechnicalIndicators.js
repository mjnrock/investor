import tulind from "tulind";
import { DataSet } from "../../../../modules/node/lib/data-set/DataSet.js";

import TAHelper from "./TAHelper.js";

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
		// Sort ascending by date, as the `startIndex` below assumes the data is sorted thus
		input.data.sort((a, b) => new Date(a.date) - new Date(b.date));

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

					const outputCols = TAHelper.INDICATOR_OUTPUT_COLUMNS[ indicatorName ];
					const resultData = input.data.slice(startIndex).map((item, index) => {
						let resultEntry = { date: item.date };
						outputCols.forEach((col, colIndex) => {
							resultEntry[ col ] = indicatorResults[ colIndex ][ index ];
						});
						return resultEntry;
					});

					let nextMeta = {
						...input.meta,
						symbol: input.meta.symbol
							?? input.meta.fromSymbol
							?? input.meta.digitalCurrencyCode,
					};

					results.push(DataSet.Create({
						meta: {
							...nextMeta,
							technicalAnalysis: {
								fn: indicatorName,
								cols: colSet,
								args: argSet
							},
						},
						// Sort the data descending by date, so that more recent data is first (query optimization)
						data: resultData.sort((a, b) => new Date(b.date) - new Date(a.date)),
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