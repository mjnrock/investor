import fs from "fs/promises";
import path from "path";
import puppeteer from "puppeteer";

import ModNode from "../../../modules/node/package.js";
import LibScraper from "../../scraper/lib/package.js"

export async function main({ symbols = [], context = {} } = {}) {
	const results = [];
	for(const symbol of symbols) {
		const pipeline = ModNode.Pipelines.Factory([
			ModNode.Lib.DataSource.FileDataSource.Create({
				state: {
					path: "./data/news",
					file: `${ symbol }.news`,
				},
			}),
			/* Extract the text */
			async (input) => {
				const browser = await puppeteer.launch();

				const { data } = input;

				const articles = [];

				let testStop = 0;
				for(let i = 0; i < data.length; i++) {
					if(testStop > 1) {
						break;
					}

					const record = data[ i ];
					const { uuid, url } = record;

					const fileName = path.join(process.cwd(), `./data/news/content/${ symbol }-${ uuid }.article`);
					if(await fs.access(fileName).then(() => true).catch(() => false)) {
						console.log(`[${ i }/${ data.length }]: Skipping ${ symbol }-${ uuid }`);
						continue;
					} else {
						++testStop;
						const node = LibScraper.UrlScraperNode.Create();

						console.log(`[${ i }/${ data.length }]: Extracting ${ symbol }-${ uuid }`);
						const article = await node.extract({ url }, { browser });

						await fs.writeFile(fileName, JSON.stringify(article), "utf8");

						articles.push({
							uuid,
							article,
						});
					}
				}

				await browser.close();

				return { input, articles };
			},
		]);

		results.push(await pipeline.run({
			...context,
		}));
	}

	return results;
};

export default main;