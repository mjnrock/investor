import "./dotenv.js";
import express from "express";
import cors from "cors";
import fs from "fs/promises";
import https from "https";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

import { router as cryptoRouter } from "./routes/crypto.js";

import { CryptoAPI } from "./plugins/alpha-vantage/lib/data-source/CryptoAPI.js";
import { FileDataDestination } from "./modules/node/data-destination/FileDataDestination.js";

import { main as FetchNormalizeSavePipeline } from "./plugins/alpha-vantage/data/pipelines/FetchNormalizeSave.crypto.js";

// import "./scraper.js";

// import "./data/pipelines/ProcessTechnicalIndicators.crypto.test.js";
// import { main as ProcessTechnicalIndicatorsPipeline } from "./data/pipelines/ProcessTechnicalIndicators.crypto.js";

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

	// const api = new CryptoAPI({
	// 	state: {
	// 		endpoint: "https://kiszka.com:3801/mock",
	// 	},
	// });

	// // const data = await api.setSymbol("BTC").run();	// alternative to below (parameter chaining)
	// const data = await api.run({
	// 	symbol: "BTC",
	// });

	const pipeline = await FetchNormalizeSavePipeline({
		symbols: [ "BTC", "ETH", "GRT", "XLM", "TRX" ],
		delay: 1000,
	});

	console.log(pipeline)

	// const destination = new FileDataDestination({
	// 	state: {
	// 		file: "TESSST.json",
	// 	},
	// });

	// await destination.run(data);
}

main();