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
				// {
				// 	fn: "stoch",
				// 	cols: [
				// 		[ "high", "low", "close" ],
				// 	],
				// 	args: [
				// 		[ 7, 3, 3 ],
				// 	],
				// },
			],
		},
	}));

	console.log()

	const pipeline = ModNode.Pipeline.Create(
		fsCryptoDataSet,
		taIndicators,
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