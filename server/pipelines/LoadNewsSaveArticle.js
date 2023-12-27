import ModNode from "../modules/node/package.js";
import LibScraper from "../plugins/scraper/lib/package.js"

export async function LoadNewsSaveArticle({ symbols = [], context = {} } = {}) {
	// const pipeline = ModNode.Pipelines.Factory([
	// 	ModNode.Lib.DataSource.FileDataSource.Create({
	// 		state: {
	// 			path: "./data/news",
	// 			file: `{{SYMBOL}}.json`,
	// 		},
	// 	}),
	// 	LibScraper.UrlScraperNode.Create({
	// 		state: {
	// 			url: "https://www.marketwatch.com/story/the-best-performing-stock-of-the-year-rose-nearly-10-fold-while-the-second-best-averted-disaster-to-surge-1-000-in-a-wild-2023-ce26b559",
	// 			file: "./data/news/{{SYMBOL}}.html",
	// 		},
	// 	}),
	// ]);

	// const pipelineResults = {};

	// for(const symbol of symbols) {
	// 	const result = await pipeline.run({
	// 		variables: { SYMBOL: symbol },
	// 		...context,
	// 	});

	// 	pipelineResults[ symbol ] = result;
	// }

	// return pipelineResults;

	const node = LibScraper.UrlScraperNode.Create({
		url: "https://www.marketwatch.com/story/the-best-performing-stock-of-the-year-rose-nearly-10-fold-while-the-second-best-averted-disaster-to-surge-1-000-in-a-wild-2023-ce26b559",
		file: "./data/news/AAPL.html",
	});

	return await node.run({
		...context,
	});
};

export default LoadNewsSaveArticle;
