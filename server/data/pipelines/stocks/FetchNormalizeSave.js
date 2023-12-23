import ModNode from "../../../modules/node/package.js";
import APIHelper from "../../../modules/node/data-source/APIHelper.js";

export async function main({
	symbols = [],
	delay = 1000,
	context = {},
}) {
	const apiStock = ModNode.Node.Create(ModNode.DataSource.APIDataSource.Create({
		state: {
			endpoint: "https://www.alphavantage.co/query",
			params: {
				function: "TIME_SERIES_DAILY",
				symbol: "RKT",
				apikey: process.env.ALPHA_VANTAGE_API_KEY,
				outputsize: "full",
			},
		},
		config: {
			rawResponse: true,
		},
	}));
	const saveRawStockFile = ModNode.Node.Create(ModNode.DataDestination.FileDataDestination.Create({
		state: {
			path: "./data/stocks",
			file: `{{SYMBOL}}.raw.json`,
		},
	}));
	const stockDataSet = ModNode.Node.Create(async input => ModNode.DataSet.DataSet.TransformToDataSet(input, APIHelper.stocksModeler, APIHelper.stocksAnalyzer));
	const saveDataSetStockFile = ModNode.Node.Create(ModNode.DataDestination.FileDataDestination.Create({
		state: {
			path: "./data/stocks",
			file: `{{SYMBOL}}.json`,
		},
	}));

	const pipeline = ModNode.Pipeline.Create(
		apiStock,
		saveRawStockFile,
		stockDataSet,
		saveDataSetStockFile
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