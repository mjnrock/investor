import tulind from "tulind";

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

					const resultData = indicatorResults[ 0 ].map((value, index) => ({
						date: input.data[ startIndex + index ].date,
						value
					}));

					results.push({
						meta: {
							...input.meta,
							technicalAnalysis: {
								fn: indicatorName,
								cols: colSet,
								args: argSet
							},
						},
						data: resultData
					});
				} catch(error) {
					console.error(`Error processing ${ indicatorName }:`, error);
				}
			}
		}

		console.log(JSON.stringify(results.map(result => result.meta)));
		console.log(results.map(result => result.data.slice(0, 5)));

		return results;
	}
}

export default ProcessTechnicalIndicators;