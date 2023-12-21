import axios from "axios";
import fs from "fs/promises";
import { join } from "path";


export async function DMA200(__dirname) {
	const STOCK_SYMBOL = "AAPL"; // Example stock symbol
	const URL = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ STOCK_SYMBOL }&apikey=${ process.env.ALPHA_VANTAGE_API_KEY }&outputsize=full`;

	axios.get(URL)
		.then(response => {
			const dirPath = join(__dirname, "data", "stocks");
			return fs.mkdir(dirPath, { recursive: true }).then(() => response.data);
		})
		.then(responseData => {
			const data = responseData[ "Time Series (Daily)" ];
			const closingPrices = Object.values(data).slice(0, 200).map(day => parseFloat(day[ "4. close" ]));
			const movingAverage = closingPrices.reduce((a, b) => a + b, 0) / 200;

			const threshold = 150; // Example threshold
			const isAboveThreshold = movingAverage > threshold;

			const stockData = {
				symbol: STOCK_SYMBOL,
				movingAverage: movingAverage.toFixed(2),
				isAboveThreshold
			};

			const filePath = join(__dirname, "data", "stocks", `${ STOCK_SYMBOL }.json`);
			const filePath2 = join(__dirname, "data", "stocks", `raw.json`);
			fs.writeFile(filePath2, JSON.stringify(responseData, null, 4));

			return fs.writeFile(filePath, JSON.stringify(stockData, null, 4));
		})
		.then(() => {
			console.log(`Data saved to ${ STOCK_SYMBOL }.json`);
		})
		.catch(error => {
			console.error("Error:", error);
		});
};

export default DMA200;