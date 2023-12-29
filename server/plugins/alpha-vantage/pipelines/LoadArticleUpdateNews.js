import fs from "fs/promises";
import path from "path";

import ModNode from "../../../modules/node/package.js";

export async function LoadArticleUpdateNews({ symbols = [], context = {} } = {}) {
	const results = [];

	for(const symbol of symbols) {
		const pipeline = ModNode.Pipelines.Factory([
			ModNode.Lib.DataSource.FileDataSource.Create({
				state: {
					path: "./data/news",
					file: `${ symbol }.news`,
				},
			}),
			/* Merge the associated .article files into the news data */
			async (input) => {
				const { data } = input;

				for(let i = 0; i < data.length; i++) {
					const record = data[ i ];
					const { uuid } = record;
					const articleFileName = path.join(process.cwd(), `./data/news/content/${ symbol }-${ uuid }.article`);

					try {
						const articleContent = await fs.readFile(articleFileName, "utf8");
						const article = JSON.parse(articleContent);

						data[ i ].article = article;
					} catch(error) {
						console.error(`Error loading article for ${ symbol }-${ uuid }:`, error.message);
					}
				}

				return ModNode.Lib.DataSet.DataSet.Create({
					id: input.id,
					meta: input.meta,
					data,
				});
			},
			ModNode.Lib.DataDestination.FileDataDestination.Create({
				state: {
					path: "./data/news",
					file: `${ symbol }.news.ds`,
				},
			}),
		]);

		results.push(await pipeline.run({
			...context,
		}));
	}

	return results;
};

export default LoadArticleUpdateNews;