// import { processSymbols } from "./SymbolProcessor.js";
// import { saveStockData } from "./SaveStockData.js";

import { LoadFile } from "./LoadFile.js";
import { SaveFile } from "./SaveFile.js";
import { DMA } from "./indicators/DMA.js";

const symbols = [
	"SPY",
	"VIG",
	"RKT",
];


export async function main(__dirname) {
	// 	await processSymbols(symbols, saveStockData, 1500, { __dirname });

	const data = await LoadFile(symbols, { __dirname });
	const dmaResults = DMA(data, [ 50, 100, 200, 500 ]);

	SaveFile(dmaResults, `{{SYMBOL}}.DMA.json`, "indicators");
};

export default main;