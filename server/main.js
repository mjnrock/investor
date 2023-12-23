import "./dotenv.js";
import express from "express";
import expressWs from "express-ws";
import cors from "cors";
import fs from "fs/promises";
import https from "https";
import path, { dirname, join } from "path";
import { fileURLToPath } from "url";

import { main as CryptoFetchNormalizeSave } from "./data/pipelines/FetchNormalizeSave.crypto.js";
import { main as StockFetchNormalizeSave } from "./data/pipelines/FetchNormalizeSave.stock.js";
import { main as CryptoProcessTechnicalIndicators } from "./data/pipelines/ProcessTechnicalIndicators.crypto.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function setup() {
	// Read the certificate files
	const privateKey = await fs.readFile("./certs/kiszka.key", "utf8");
	const certificate = await fs.readFile("./certs/kiszka.crt", "utf8");

	// Create a credentials object using the private key and certificate
	const credentials = { key: privateKey, cert: certificate };

	const app = express();
	const ws = expressWs(app);

	app.use(cors());

	//STUB: Replicate AlphaVantage API for testing
	app.get("/crypto", (req, res) => {
		const filePath = path.join(__dirname, "./data/cryptos/BTC.raw.json");

		fs.readFile(filePath, "utf8")
			.then(file => {
				res.json(JSON.parse(file));
			});
	});
	app.get("/cryptos", (req, res) => {
		const filePath = path.join(__dirname, "./data/cryptos/BTC.json");

		fs.readFile(filePath, "utf8")
			.then(file => {
				res.json(JSON.parse(file));
			});
	});
	app.get("/stock", (req, res) => {
		const filePath = path.join(__dirname, "./data/stocks/RKT.raw.json");

		fs.readFile(filePath, "utf8")
			.then(file => {
				res.json(JSON.parse(file));
			});
	});
	app.get("/stocks", (req, res) => {
		const filePath = path.join(__dirname, "./data/stocks/RKT.json");

		fs.readFile(filePath, "utf8")
			.then(file => {
				res.json(JSON.parse(file));
			});
	});
	//STUB: END

	// const httpsServer = https.createServer(credentials, app);
	// httpsServer.listen(process.env.PORT, () => {
	// 	console.log(`[${ Date.now() }]: Server is running on port: ${ process.env.PORT }`);
	// });

	const server = app.listen(process.env.PORT, () => {
		console.log(`[${ Date.now() }]: Server is running on port: ${ process.env.PORT }`);
	});
};

export async function main() {
	await setup();

	const pipeline = await CryptoProcessTechnicalIndicators({
		symbols: [
			"BTC",
			"ETH",
		],
		indicators: [
			{
				fn: "sma",
				cols: [
					[ "close" ],
					[ "close" ],
					[ "close" ],
					[ "close" ],
					[ "close" ],
					[ "close" ],
				],
				args: [
					[ 7 ],
					[ 14 ],
					[ 28 ],
					[ 56 ],
					[ 112 ],
					[ 224 ],
				],
			},
			{
				fn: "ema",
				cols: [
					[ "close" ],
					[ "close" ],
					[ "close" ],
					[ "close" ],
					[ "close" ],
					[ "close" ],
				],
				args: [
					[ 7 ],
					[ 14 ],
					[ 28 ],
					[ 56 ],
					[ 112 ],
					[ 224 ],
				],
			},
		],
		delay: 0,
	});


	// const pipeline = await CryptoFetchNormalizeSave({
	// 	symbols: [
	// 		"BTC",
	// 	],
	// 	delay: 1000,
	// });
	// const pipeline = await StockFetchNormalizeSave({
	// 	symbols: [
	// 		"UNG",
	// 	],
	// 	delay: 1000,
	// });

	/**
	 * IDEA: NEXT STEPS
	 * Everything below can be done with the Node/Circuit paradigm.
	 * Since a Circuit is a Node, it should handle input/output, also.
	 * 
	 * Below is a POC ETL process for the data
	 * 1.	Query the API for the data
	 * 2.	Save the raw data into file(s)
	 * 3.	Process the raw data into a normalized DataSet format
	 * 4.	Save the normalized data into file(s)
	 * 6.	Iterate TechnicalIndicators over each DataSet (stocks/cryptos)
	 * 7.	Save the TechnicalIndicator results into respective file(s) for the symbol
	 * 9.	Create Plotly objects for each symbol and TechnicalIndicator
	 * 
	 * 10a.	Convert the file system format into MongoDB format
	 * 10b.	Store the MongoDB format into the database
	 * 
	 * 11.	Create a WebSocket server
	 * 12.	Connect the WebSocket server to the client
	 * 13.	When the client requests a symbol, send the Data/Plotly object
	 * 14.	When the client requests a TechnicalIndicator, send the Data/Plotly object
	 */
}

main();