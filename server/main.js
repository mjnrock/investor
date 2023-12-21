import "./dotenv.js";
import express from "express";
import expressWs from "express-ws";
import cors from "cors";
import fs from "fs/promises";
import https from "https";

export async function main() {
	// Read the certificate files
	const privateKey = await fs.readFile("./certs/kiszka.key", "utf8");
	const certificate = await fs.readFile("./certs/kiszka.crt", "utf8");

	// Create a credentials object using the private key and certificate
	const credentials = { key: privateKey, cert: certificate };

	const app = express();
	const ws = expressWs(app);

	app.use(cors());

	app.get("/", (req, res) => {
		res.json({
			message: "Hello World!",
		})
	});

	const httpsServer = https.createServer(credentials, app);
	httpsServer.listen(process.env.PORT, () => {
		console.log(`[${ Date.now() }]: Server is running on port: ${ process.env.PORT }`);
	});
};

main();