import ModNode from "../../../modules/node/package.js";
import LibAlphaVantage from "../lib/package.js";

export async function main({ symbols = [], delay = 1000, context = {} }) {
	const pipeline = ModNode.Pipelines.Factory([
		LibAlphaVantage.DataSource.StockAPI.Create({
			state: {
				params: {
					symbol: "{{SYMBOL}}",
				},
			},
			config: {
				rawResponse: true,
			},
		}),
		ModNode.Lib.DataDestination.FileDataDestination.Create({
			state: {
				path: "./data/stocks",
				file: `{{SYMBOL}}.raw.json`,
			},
		}),
		async input => ModNode.Lib.DataSet.DataSet.TransformToDataSet(
			input,
			LibAlphaVantage.DataSource.StockAPI.Modeler,
			LibAlphaVantage.DataSource.StockAPI.Analyzer,
		),
		ModNode.Lib.DataDestination.FileDataDestination.Create({
			state: {
				path: "./data/stocks",
				file: `{{SYMBOL}}.json`,
			},
		})
	]);

	const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

	for(const symbol of symbols) {
		await wait(delay);
		await pipeline.run({
			variables: { SYMBOL: symbol },
			...context,
		});
	}

	return pipeline;
};

export default main;