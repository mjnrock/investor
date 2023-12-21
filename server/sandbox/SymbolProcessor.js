export function delay(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export async function processSymbols(symbols, symbolProcessor, delayMs, config = {}) {
	if(!Array.isArray(symbols) && typeof symbols === "object") {
		// assume it's a symbol-data map
		symbols = Object.keys(symbols);
	}

	for(const symbol of symbols) {
		try {
			await symbolProcessor(symbol, config);
			await delay(delayMs);
		} catch(error) {
			console.error(`Error while processing ${ symbol }:`, error);
		}
	}
}

export default processSymbols;