import ModNode from "../../modules/node/package.js";

export async function main({
	symbols = [],
	delay = 1000,
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
			indicators: [
				{
					fn: "sma",
					cols: [
						[ "open" ],
						[ "close" ],
					],
					args: [
						[ 7 ],
						[ 10 ],
					],
				},
				{
					fn: "stoch",
					cols: [
						[ "high", "low", "close" ],
					],
					args: [
						[ 7, 3, 3 ],
					],
				},
			],
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

	const wait = async (ms) => new Promise(resolve => setTimeout(resolve, ms));

	for(const symbol of symbols) {
		await wait(delay);
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