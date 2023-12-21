import axios from "axios";
import fs from "fs/promises";
import { join } from "path";

// Function to save cryptocurrency data with USD as the default market
export async function saveCryptoData(cryptoSymbol, { __dirname } = {}) {
	const market = "USD";
	const URL = `https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=${ cryptoSymbol }&market=${ market }&apikey=${ process.env.ALPHA_VANTAGE_API_KEY }`;
	const response = await axios.get(URL);
	const dirPath = join(__dirname, "data", "cryptos");
	await fs.mkdir(dirPath, { recursive: true });

	const filePath = join(__dirname, "data", "cryptos", `${ cryptoSymbol }.json`);
	await fs.writeFile(filePath, JSON.stringify(response.data, null, 4));
	console.log(`Data saved for ${ cryptoSymbol } in ${ cryptoSymbol }.json`);
}

export default saveCryptoData;