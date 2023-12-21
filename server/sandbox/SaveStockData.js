import axios from "axios";
import fs from "fs/promises";
import { join } from "path";

// Example of a symbol processor function
export async function saveStockData(symbol, { __dirname } = {}) {
	const URL = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ symbol }&apikey=${ process.env.ALPHA_VANTAGE_API_KEY }&outputsize=full`;
	const response = await axios.get(URL);
	const dirPath = join(__dirname, "data", "stocks");
	await fs.mkdir(dirPath, { recursive: true });

	const filePath = join(__dirname, "data", "stocks", `${ symbol }.json`);
	await fs.writeFile(filePath, JSON.stringify(response.data, null, 4));
	console.log(`Data saved for ${ symbol } in ${ symbol }.json`);
}

export default saveStockData;