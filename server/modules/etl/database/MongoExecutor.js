import { MongoClient } from "mongodb";
import fs from "fs/promises";

const mongoConfig = {
	url: "mongodb://localhost:27017", // MongoDB connection string
	dbName: "investor"                // Database name
};

export class MongoExecutor {
	constructor (config = mongoConfig) {
		this.config = config;
		this.client = new MongoClient(config.url);
	}

	async connect() {
		if(!this.db) {
			await this.client.connect();
			this.db = this.client.db(this.config.dbName);
		}
	}

	async disconnect() {
		await this.client.close();
	}

	async find(collectionName, query = {}, options = {}) {
		await this.connect();
		const collection = this.db.collection(collectionName);
		return await collection.find(query, options).toArray();
	}

	async insert(collectionName, documents) {
		await this.connect();
		const collection = this.db.collection(collectionName);
		return await collection.insertMany(documents);
	}

	async update(collectionName, query, update, options = {}) {
		await this.connect();
		const collection = this.db.collection(collectionName);
		return await collection.updateMany(query, update, options);
	}

	async delete(collectionName, query) {
		await this.connect();
		const collection = this.db.collection(collectionName);
		return await collection.deleteMany(query);
	}

	async queryFromFile(filePath, collectionName) {
		try {
			const fileContents = await fs.readFile(filePath, "utf8");
			const query = JSON.parse(fileContents);
			return this.find(collectionName, query);
		} catch(err) {
			console.error("Error reading or executing the MongoDB query file:", err);
			throw err;
		}
	}
}

export default MongoExecutor;