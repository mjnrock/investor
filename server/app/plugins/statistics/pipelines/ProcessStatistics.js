import { ProcessStatistics } from "../lib/ProcessStatistics.js";
import ModNode from "../../../../modules/node/package.js";

export async function main({
	type = "crypto",
	symbol,
	periods = [ 7, 14, 21, 28, 112, 224, 448, 996 ],
	columns = [ "close" ],
}) {
	const pipeline = ModNode.Pipelines.Factory([
		ModNode.Lib.DataSource.FileDataSource.Create({
			state: {
				path: `./app/data/${ type }`,
				file: `${ symbol?.toUpperCase() }.ds`
			},
		}),
		ProcessStatistics.Create({
			state: {
				periods,
				columns,
			},
		}),
		ModNode.Lib.DataDestination.FileDataDestination.Create({
			state: {
				path: `./app/data/${ type }`,
				file: `${ symbol?.toUpperCase() }.stats`,
			},
		}),
	]);

	const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

	for(const symbol of symbols) {
		await wait(delay);

		try {
			await pipeline.run({
				variables: { SYMBOL: symbol },
				...context,
			});
		} catch(e) {
			console.log(e);
		}
	}

	return pipeline;
};

export default main;