import fs from "fs/promises";
import path from "path";
import puppeteer from "puppeteer";

import ModNode from "../modules/node/package.js";
import LibScraper from "../plugins/scraper/lib/package.js"

//TODO: This is just a quick POC, need to really flesh out how this would work (init with func, exec with (/.run) args?)
// import { ThreadPool } from "../modules/multi-threading/ThreadPool.js";

export async function LoadNewsSaveArticle({ symbols = [], context = {} } = {}) {
	const results = [];
	for(const symbol of symbols) {
		const pipeline = ModNode.Pipelines.Factory([
			ModNode.Lib.DataSource.FileDataSource.Create({
				state: {
					path: "./data/news",
					file: `${ symbol }.json`,
				},
			}),
			async (input) => {
				const browser = await puppeteer.launch();

				const { data } = input;

				const articles = [];

				let i = 0;
				for(const record of data) {
					if(i > 5) {
						break;
					}

					const { uuid, url } = record;

					// Conditionally skip if file exists
					const fileName = path.join(process.cwd(), `./data/news/content/${ symbol }-${ uuid }.article`);
					if(await fs.access(fileName).then(() => true).catch(() => false)) {
						console.log("Skipping:", fileName)
						continue;
					} else {
						++i;

						const node = LibScraper.UrlScraperNode.Create();

						const article = await node.extract({ url }, { browser });

						await fs.writeFile(fileName, JSON.stringify(article), "utf8");

						articles.push({
							uuid,
							article,
						});
					}
				}

				await browser.close();

				return articles;
			},
		]);

		results.push(await pipeline.run({
			...context,
		}));
	}

	return results;

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

	// const node = LibScraper.UrlScraperNode.Create({
	// 	url: "https://www.marketwatch.com/story/the-best-performing-stock-of-the-year-rose-nearly-10-fold-while-the-second-best-averted-disaster-to-surge-1-000-in-a-wild-2023-ce26b559",
	// 	// url: "https://www.business-standard.com/companies/news/google-rejected-play-store-fee-changes-due-to-revenue-impact-epic-lawsuit-123122400905_1.html",
	// 	file: "./data/news/AAPL.article.json",
	// });

	// return await node.run({
	// 	...context,
	// });
};

export default LoadNewsSaveArticle;
