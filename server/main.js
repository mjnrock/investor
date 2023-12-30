import "./dotenv.js";
import express from "express";
import cors from "cors";
import fs from "fs/promises";
import https from "https";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

import { router as cryptoRouter } from "./routes/crypto.js";
import { router as fileRouter } from "./routes/file.js";

import ModNode from "./modules/node/lib/package.js";
import ModAlphaVantage from "./plugins/alpha-vantage/package.js";
import ModTechnicalAnalysis from "./plugins/technical-analysis/package.js";
import ModPlotly from "./plugins/plotly/package.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function setup() {
	const privateKey = await fs.readFile("./certs/kiszka.key", "utf8");
	const certificate = await fs.readFile("./certs/kiszka.crt", "utf8");

	const credentials = { key: privateKey, cert: certificate };

	const app = express();

	app.use((req, res, next) => {
		console.log(`[${ Date.now() }]: ${ req.method } ${ req.url }`);
		next();
	});

	app.use(cors());

	app.use("/crypto", await cryptoRouter(__dirname));
	app.use("/file", await fileRouter(__dirname));

	const httpsServer = https.createServer(credentials, app);
	httpsServer.listen(process.env.PORT, () => {
		console.log(`[${ Date.now() }]: Server is running on port: ${ process.env.PORT }`);
	});

	//? HTTP server, if needed
	// const server = app.listen(process.env.PORT, () => {
	// 	console.log(`[${ Date.now() }]: Server is running on port: ${ process.env.PORT }`);
	// });
};

export async function main() {
	await setup();

	// await ModAlphaVantage.Pipelines.Crypto.FetchNormalizeSave({
	// 	symbols: [
	// 		"BTC",
	// 		// "ETH",
	// 	],
	// 	delay: 1000,
	// });

	// await ModAlphaVantage.Pipelines.Stock.FetchNormalizeSave({
	// 	symbols: [
	// 		"AAPL",
	// 		"RKT",
	// 	],
	// 	delay: 1000,
	// });

	// await ModAlphaVantage.Pipelines.News.FetchSave({
	// 	symbols: [
	// 		"AAPL",
	// 	],
	// 	delay: 1000,
	// });

	// await LoadNewsSaveArticle({
	// 	symbols: [
	// 		"AAPL",
	// 	],
	// });
	// await LoadArticleUpdateNews({
	// 	symbols: [
	// 		"AAPL",
	// 	],
	// });

	// await ModTechnicalAnalysis.Pipelines.ProcessTechnicalIndicators({
	// 	type: "cryptos",
	// 	symbols: [
	// 		"BTC",
	// 		// "ETH",
	// 	],
	// 	indicators: [
	// 		{
	// 			fn: "sma",
	// 			cols: [ [ "close" ] ],
	// 			args: [ [ 20 ] ],
	// 		},
	// 	],
	// });
	// await ModTechnicalAnalysis.Pipelines.ProcessTechnicalIndicators({
	// 	type: "stocks",
	// 	symbols: [
	// 		"AAPL",
	// 		"RKT",
	// 	],
	// 	indicators: [
	// 		{
	// 			fn: "sma",
	// 			cols: [ [ "close" ] ],
	// 			args: [ [ 20 ] ],
	// 		},
	// 	],
	// });
	// await ModTechnicalAnalysis.Pipelines.ProcessGoldenRatioCoreIndicators({
	// 	type: "cryptos",
	// 	symbols: [
	// 		"BTC",
	// 		// "ETH",
	// 	],
	// });
	// await ModTechnicalAnalysis.Pipelines.ProcessGoldenRatioCoreIndicators({
	// 	type: "stocks",
	// 	symbols: [
	// 		"AAPL",
	// 		"RKT",
	// 	],
	// });

	// console.log(await ModPlotly.Pipelines.PlotlyChart({
	// 	type: "cryptos",
	// 	fileName: "BTC.ds",
	// 	chartType: "candlestick",
	// 	traceArrays: [
	// 		[
	// 			"date",											// x-axis
	// 			"close",										// y-axis
	// 		],
	// 	],
	// }));

	// process.exit(0);
}

main();