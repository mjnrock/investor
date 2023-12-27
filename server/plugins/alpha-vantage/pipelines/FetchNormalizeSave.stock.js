import { pipelineFactory } from "./pipelineFactory.js";

import ModNode from "../../../modules/node/lib/package.js";
import ModAlphaVantage from "../lib/package.js";

export async function main({ symbols = [], delay = 1000, context = {} }) {
	const pipeline = pipelineFactory([
		ModAlphaVantage.DataSource.StockAPI.Create({
			state: {
				params: {
					symbol: "{{SYMBOL}}",
				},
			},
			config: {
				rawResponse: true,
			},
		}),
		ModNode.DataDestination.FileDataDestination.Create({
			state: {
				path: "./data/stocks",
				file: `{{SYMBOL}}.raw.json`,
			},
		}),
		async input => ModNode.DataSet.DataSet.TransformToDataSet(
			input,
			ModAlphaVantage.DataSource.StockAPI.Modeler,
			ModAlphaVantage.DataSource.StockAPI.Analyzer,
		),
		ModNode.DataDestination.FileDataDestination.Create({
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