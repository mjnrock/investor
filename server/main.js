import "./dotenv.js";
import express from "express";
import cors from "cors";
import fs from "fs/promises";
import https from "https";
import { dirname } from "path";
import { fileURLToPath } from "url";

import { router as cryptoRouter } from "./routes/crypto.js";

// import "./scraper.js";

import "./data/pipelines/ProcessTechnicalIndicators.crypto.test.js";
// import { main as ProcessTechnicalIndicatorsPipeline } from "./data/pipelines/ProcessTechnicalIndicators.crypto.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function setup() {
	const privateKey = await fs.readFile("./certs/kiszka.key", "utf8");
	const certificate = await fs.readFile("./certs/kiszka.crt", "utf8");

	const credentials = { key: privateKey, cert: certificate };

	const app = express();

	app.use(cors());

	app.use("/crypto", await cryptoRouter(__dirname));

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


}

main();