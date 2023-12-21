import fs from "fs/promises";
import path from "path";

import MongoDBExecutor from "../lib/MongoDBExecutor.js";

async function storeStockDataInMongoDB(filePath, collectionName) {
	try {
		// Read the JSON file
		const fileData = await fs.readFile(filePath, "utf8");
		const stockData = JSON.parse(fileData);

		// Create an instance of MongoDBExecutor
		const dbExecutor = new MongoDBExecutor();

		// Connect to MongoDB and insert the data
		await dbExecutor.connect();
		const result = await dbExecutor.insert(collectionName, [ stockData ]);
		console.log("Data inserted:", result);

		// Disconnect from MongoDB
		await dbExecutor.disconnect();
	} catch(error) {
		console.error("Error:", error);
	}
};

export async function UploadData(__dirname) {
	const filePath = path.join(__dirname, "data", "stocks", "AAPL.json");

	await storeStockDataInMongoDB(filePath, "sandbox");

	console.log("Done!");
};

export default UploadData;