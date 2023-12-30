import { Factory } from "../../../../modules/node/pipelines/Factory.js";
import LibNode from "../../../../modules/node/lib/package.js";
import LibTechnicalAnalysis from "../lib/package.js";

export async function main({
	type = "crypto",
	symbols = [],
	indicators = [],
	context = {},
}) {
	const pipeline = Factory([
		LibNode.DataSource.FileDataSource.Create({
			state: {
				path: `./app/data/${ type }`,
				file: `{{SYMBOL}}.ds`,
			},
		}),
		LibTechnicalAnalysis.ProcessTechnicalIndicators.Create({
			state: {
				indicators,
			},
		}),
		async (input, context = {}) => {
			const consolidatedData = input.reduce((acc, dataSet) => {
				const { symbol } = dataSet.meta;
				const { fn: indicatorName } = dataSet.meta.technicalAnalysis;

				if(!acc[ symbol ]) {
					acc[ symbol ] = {};
				}

				if(!acc[ symbol ][ indicatorName ]) {
					acc[ symbol ][ indicatorName ] = [];
				}

				acc[ symbol ][ indicatorName ].push(dataSet);

				return acc;
			}, {});

			let results = [];
			// Actually save the data
			for(const symbol in consolidatedData) {
				const indicatorData = consolidatedData[ symbol ];

				for(const indicatorName in indicatorData) {
					const node = LibNode.DataDestination.FileDataDestination.Create({
						state: {
							path: `./app/data/${ type }/indicator`,
							file: `${ symbol }.${ indicatorName }.dsp`,
						},
					});

					results.push(await node.run(indicatorData[ indicatorName ], context));
				}
			}

			return results;
		}
	]);


	const pipelineResults = {};
	for(const symbol of symbols) {
		pipeline.cache = [];

		await pipeline.run({
			variables: {
				SYMBOL: symbol,
			},
			...context,
		});

		pipelineResults[ symbol ] = pipeline.cache;
	}

	return pipelineResults;
};

export default main;
