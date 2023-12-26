import ModNode from "../../../../modules/node/package.js";
import ModAlphaVantage from "../../lib/package.js";

export async function main({
	symbols = [],
	delay = 1000,
	context = {},
}) {
	const apiStock = ModNode.Node.Create(ModAlphaVantage.DataSource.StockAPI.StockAPI.Create({
		state: {
			params: {
				symbol: "{{SYMBOL}}",
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
	const stockDataSet = ModNode.Node.Create(async input => ModNode.DataSet.DataSet.TransformToDataSet(
		input,
		ModAlphaVantage.DataSource.StockAPI.StockAPI.Modeler,
		ModAlphaVantage.DataSource.StockAPI.StockAPI.Analyzer,
	));
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