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

				await node.run(indicatorData[ indicatorName ], context);
			}
		}
	});

	const pipeline = ModNode.Pipeline.Create(
		fsCryptoDataSet,
		taIndicators,
		saveTaIndicators,
	);

	for(const symbol of symbols) {
		await pipeline.run({
			variables: {
				SYMBOL: symbol,
			},
			...context,
		});
	}

	return pipeline;
};

export default main;