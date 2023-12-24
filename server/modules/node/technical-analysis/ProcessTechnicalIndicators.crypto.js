import tulind from "tulind";
import { DataSet } from "../data-set/DataSet.js";

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