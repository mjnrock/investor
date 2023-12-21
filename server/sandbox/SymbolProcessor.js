export function delay(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export async function processSymbols(symbols, symbolProcessor, delayMs, config = {}) {
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