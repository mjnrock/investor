import "../dotenv.js";
import express from "express";
import cors from "cors";
import fs from "fs/promises";
import https from "https";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

import { router as cryptoRouter } from "./routes/crypto.js";
import { router as fileRouter } from "./routes/file.js";

import Plugins from "./plugins/package.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const loadJsonFile = async (filePath) => {
	try {
		const absoultePath = path.resolve(__dirname, filePath);
		const data = await fs.readFile(absoultePath, "utf8");
		return JSON.parse(data);
	} catch(err) {
		console.error('Error reading the JSON file:', err);
		return null;
	}
};

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

	app.get("/run/:userName", async (req, res) => {
		const { userName } = req.params;

		try {
			const profile = await loadJsonFile(`./config/profiles/${ userName }.profile`);

			const { pipelines } = profile.config;
			let lastResult;
			for(const pipeline of pipelines) {
				const [ plugin, method, ...args ] = pipeline;

				const fn = Plugins[ plugin ].Pipelines[ method ];
				const result = await fn(...args);

				lastResult = result;
			}

			res.status(200).json({ lastResult });
		} catch(err) {
			console.error(err);
			res.status(500).json({ error: err });
		}
	});

	const httpsServer = https.createServer(credentials, app);
	httpsServer.listen(process.env.PORT, () => {
		console.log(`[${ Date.now() }]: Server is running on port: ${ process.env.PORT }`);
	});
};

export async function main() {
	await setup();
};

main();