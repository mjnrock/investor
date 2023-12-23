import ModNode from "../../modules/node/package.js";
import APIHelper from "../../modules/node/data-source/APIHelper.js";

export async function main({
	symbols = [],
	delay = 1000,
	context = {},
}) {
	const apiCrypto = ModNode.Node.Create(ModNode.DataSource.APIDataSource.Create({
		state: {
			endpoint: "https://www.alphavantage.co/query",
			params: {
				function: "DIGITAL_CURRENCY_DAILY",
				symbol: "{{SYMBOL}}",
				market: "USD",
				apikey: process.env.ALPHA_VANTAGE_API_KEY,
			},
		},
		config: {
			rawResponse: true,
		},
	}));
	const saveRawCryptoFile = ModNode.Node.Create(ModNode.DataDestination.FileDataDestination.Create({
		state: {
			path: "./data/cryptos",
			file: `{{SYMBOL}}.raw.json`,
		},
	}));
	const cryptoDataSet = ModNode.Node.Create(async input => ModNode.DataSet.DataSet.TransformToDataSet(input, APIHelper.cryptoModeler, APIHelper.cryptoAnalyzer));
	const saveDataSetCryptoFile = ModNode.Node.Create(ModNode.DataDestination.FileDataDestination.Create({
		state: {
			path: "./data/cryptos",
			file: `{{SYMBOL}}.json`,
		},
	}));

	const pipeline = ModNode.Pipeline.Create(
		apiCrypto,
		saveRawCryptoFile,
		cryptoDataSet,
		saveDataSetCryptoFile
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