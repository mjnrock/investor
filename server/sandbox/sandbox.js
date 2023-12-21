import { processSymbols } from "./SymbolProcessor.js";
import { saveStockData } from "./SaveStockData.js";
import { saveCryptoData } from "./SaveCryptoData.js";

import { LoadFile } from "./LoadFile.js";
import { SaveFile } from "./SaveFile.js";
import { DMA } from "./indicators/DMA.js";
import { DMA as CryptoDMA } from "./indicators/DMA.crypto.js";

const stocks = [
	"SPY",
	"VIG",
	"RKT",
];
const cryptos = [
	"BTC",
	"ETH",
	"XLM",
	"TRX",
];

export async function main(__dirname) {
	/* STOCKS */
	// 	await processSymbols(symbols, saveStockData, 1500, { __dirname });

	// const data = await LoadFile(symbols, { __dirname });
	// const dmaResults = DMA(data, [ 50, 100, 200, 500 ]);

	// SaveFile(dmaResults, `{{SYMBOL}}.DMA.json`, "stocks/indicators");

	/* CRYPTO */
	// await processSymbols(cryptos, saveCryptoData, 1500, { __dirname });

	const data = await LoadFile(cryptos, { base: "cryptos", __dirname });
	const dmaResults = CryptoDMA(data, [ 50, 100, 200, 500 ]);

	SaveFile(dmaResults, `{{SYMBOL}}.DMA.json`, "cryptos/indicators");
};

export default main;