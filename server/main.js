import "./dotenv.js";
import express from "express";
import expressWs from "express-ws";
import cors from "cors";
import fs from "fs/promises";
import https from "https";
import path, { dirname, join } from "path";
import { fileURLToPath } from "url";

import Sandbox from "./sandbox/sandbox.js";

import NodeModules from "./modules/etl/node/package.js";

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

	const httpsServer = https.createServer(credentials, app);
	httpsServer.listen(process.env.PORT, () => {
		console.log(`[${ Date.now() }]: Server is running on port: ${ process.env.PORT }`);
	});
};
export async function main() {
	await setup();

	console.log(NodeModules)
}

main();