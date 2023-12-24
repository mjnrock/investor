import ModNode from "../../modules/node/package.js";

export async function main({
	symbols = [],
	indicators = [],
	context = {},
}) {
	const fsCryptoDataSet = ModNode.Node.Create(ModNode.DataSource.FileDataSource.Create({
		state: {
			path: "./data/cryptos",
			file: `{{SYMBOL}}.json`,
		},
	}));
	const taIndicators = ModNode.Node.Create(ModNode.TechnicalAnalysis.ProcessTechnicalIndicators.Create({
		state: {
			indicators,
		},
	}));
	const saveTaIndicators = ModNode.Node.Create(async (input, context = {}) => {
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
				const node = ModNode.DataDestination.FileDataDestination.Create({
					state: {
						path: "./data/cryptos",
						file: `${ symbol }.${ indicatorName }.json`,
					},
				});

				results.push(await node.run(indicatorData[ indicatorName ], context));
			}
		}

		return results;
	});

	const pipeline = ModNode.Pipeline.Create(
		fsCryptoDataSet,
		taIndicators,
		saveTaIndicators,
	);

	console.log(pipeline.id)
	console.log(fsCryptoDataSet.id)
	console.log(taIndicators.id)
	console.log(saveTaIndicators.id)

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

		for(let i = 0; i < pipeline.cache.length; i++) {
			const result = pipeline.cache[ i ];
			const { node, output } = result;

			if(i === 0) {
				console.log(node, output.meta);
			} else if(i === 1) {
				console.log(node, output.map(item => item.meta.technicalAnalysis))
			} else if(i === 2) {
				console.log(node, output.map(item => item.map(item => [ item.meta.technicalAnalysis.fn, ...item.meta.technicalAnalysis.args ])))
			}
		}
	}

	console.log(pipelineResults);

	return pipelineResults;
};

export default main;