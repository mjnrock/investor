import { main as CryptoFetchNormalizeSave } from "./FetchNormalizeSave.crypto.js";
import { main as StockFetchNormalizeSave } from "./FetchNormalizeSave.stock.js";

export default {
	Crypto: {
		FetchNormalizeSave: CryptoFetchNormalizeSave,
	},
	Stock: {
		FetchNormalizeSave: StockFetchNormalizeSave,
	},
};