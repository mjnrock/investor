import ModNode from "../../../../modules/node/package.js";
import LibAlphaVantage from "../lib/package.js";

export async function main({ symbols = [], delay = 1000, context = {} }) {
	const pipeline = ModNode.Pipelines.Factory([
		LibAlphaVantage.DataSource.NewsAPI.Create({
			state: {
				params: {
					tickers: "{{TICKERS}}",
				},
			},
		}),
		ModNode.Lib.DataDestination.FileDataDestination.Create({
			state: {
				path: "./app/data/news",
				file: `{{TICKERS}}.json`,
			},
		}),
	]);

	const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

	for(const ticker of symbols) {
		await wait(delay);
		await pipeline.run({
			variables: { TICKERS: ticker },
			...context,
		});
	}

	return pipeline;
};

export default main;