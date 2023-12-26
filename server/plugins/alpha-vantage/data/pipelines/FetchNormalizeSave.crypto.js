import ModNode from "../../../../modules/node/package.js";
import ModAlphaVantage from "../../lib/package.js";

export async function main({
	symbols = [],
	delay = 1000,
	context = {},
}) {
	const apiCrypto = ModNode.Node.Create(ModAlphaVantage.DataSource.CryptoAPI.CryptoAPI.Create({
		state: {
			params: {
				symbol: "{{SYMBOL}}",
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
	const cryptoDataSet = ModNode.Node.Create(async input => ModNode.DataSet.DataSet.TransformToDataSet(
		input,
		ModAlphaVantage.DataSource.CryptoAPI.CryptoAPI.Modeler,
		ModAlphaVantage.DataSource.CryptoAPI.CryptoAPI.Analyzer,
	));
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