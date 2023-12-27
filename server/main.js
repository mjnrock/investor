import "./dotenv.js";
import express from "express";
import cors from "cors";
import fs from "fs/promises";
import https from "https";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

import { router as cryptoRouter } from "./routes/crypto.js";

import ModNode from "./modules/node/lib/package.js";
import ModAlphaVantage from "./plugins/alpha-vantage/package.js";

// import "./scraper.js";

import { main as PlotlyChartPipeline } from "./plugins/plotly/pipelines/PlotlyChart.js";
import { main as ProcessGoldenRatioCoreIndicatorsPipeline } from "./plugins/technical-analysis/pipelines/ProcessGoldenRatioCoreIndicators.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function setup() {
	const privateKey = await fs.readFile("./certs/kiszka.key", "utf8");
	const certificate = await fs.readFile("./certs/kiszka.crt", "utf8");

	const credentials = { key: privateKey, cert: certificate };

	const app = express();

	app.use(cors());

	app.use("/crypto", await cryptoRouter(__dirname));

	app.get("/mock", (req, res) => {
		const filePath = path.join(__dirname, "./data/cryptos/BTC.raw.json");

		fs.readFile(filePath, "utf8")
			.then(file => {
				res.json(JSON.parse(file));
			});
	});

	const httpsServer = https.createServer(credentials, app);
	httpsServer.listen(process.env.PORT, () => {
		console.log(`[${ Date.now() }]: Server is running on port: ${ process.env.PORT }`);
	});

	// const server = app.listen(process.env.PORT, () => {
	// 	console.log(`[${ Date.now() }]: Server is running on port: ${ process.env.PORT }`);
	// });
};

export async function main() {
	await setup();

	await ProcessGoldenRatioCoreIndicatorsPipeline({
		type: "cryptos",
		symbols: [
			"BTC",
			"ETH",
			"GRT",
			"XLM",
			"TRX",
		],
	});
	await ProcessGoldenRatioCoreIndicatorsPipeline({
		type: "stocks",
		symbols: [
			"AAPL",
			"RKT",
			"VIG",
			"SPY",
			"UNG",
		],
	});

	console.log(await PlotlyChartPipeline({
		type: "cryptos",
		fileName: "BTC.json",
		chartType: "candlestick",
		traceArrays: [
			[
				"date",											// x-axis
				"close",										// y-axis
			],
		],
	}));

	// const api = new CryptoAPI({
	// 	state: {
	// 		endpoint: "https://kiszka.com:3801/mock",
	// 	},
	// });

	// // const data = await api.setSymbol("BTC").run();	// alternative to below (parameter chaining)
	// const data = await api.run({
	// 	symbol: "BTC",
	// });

	// const cryptoPipeline = await ModAlphaVantage.Pipelines.Crypto.FetchNormalizeSave({
	// 	// symbols: [ "BTC" ],
	// 	symbols: [ "ETH", "GRT", "XLM", "TRX", ],
	// 	delay: 1000,
	// });
	// const stockPipeline = await ModAlphaVantage.Pipelines.Stock.FetchNormalizeSave({
	// 	symbols: [ "AAPL", "RKT", "VIG", "SPY", "UNG", ],
	// 	delay: 1000,
	// });

	// console.log(pipeline.status);

	// const destination = new FileDataDestination({
	// 	state: {
	// 		file: "TESSST.json",
	// 	},
	// });

	// await destination.run(data);
}

main();