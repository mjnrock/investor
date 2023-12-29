import ModNode from "../../../modules/node/package.js";
import LibAlphaVantage from "../lib/package.js";

export async function main({ symbols = [], delay = 1000, context = {} }) {
	const pipeline = ModNode.Pipelines.Factory([
		LibAlphaVantage.DataSource.CryptoAPI.Create({
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
				path: "./data/cryptos",
				file: `{{SYMBOL}}.raw`,
			},
		}),
		async input => ModNode.Lib.DataSet.DataSet.TransformToDataSet(
			input,
			LibAlphaVantage.DataSource.CryptoAPI.Modeler,
			LibAlphaVantage.DataSource.CryptoAPI.Analyzer,
		),
		ModNode.Lib.DataDestination.FileDataDestination.Create({
			state: {
				path: "./data/cryptos",
				file: `{{SYMBOL}}.ds`,
			},
		})
	]);

	const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

	for(const symbol of symbols) {
		await wait(delay);

		try {
			await pipeline.run({
				variables: { SYMBOL: symbol },
				...context,
			});
		} catch(e) {
			console.log(e);
		}
	}

	return pipeline;
};

export default main;