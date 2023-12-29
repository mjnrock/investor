import { main as CryptoFetchNormalizeSave } from "./FetchNormalizeSave.crypto.js";
import { main as StockFetchNormalizeSave } from "./FetchNormalizeSave.stock.js";
import { main as NewsFetchSave } from "./FetchSave.news.js";
import { main as NewsLoadNewsSaveArticle } from "./LoadNewsSaveArticle.js";
import { main as NewsLoadArticleUpdateNews } from "./LoadArticleUpdateNews.js";

export default {
	Crypto: {
		FetchNormalizeSave: CryptoFetchNormalizeSave,
	},
	Stock: {
		FetchNormalizeSave: StockFetchNormalizeSave,
	},
	News: {
		FetchSave: NewsFetchSave,
		LoadNewsSaveArticle: NewsLoadNewsSaveArticle,
		LoadArticleUpdateNews: NewsLoadArticleUpdateNews,
	},
};