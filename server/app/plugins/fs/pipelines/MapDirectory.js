import path from "path";

import { Factory } from "../../../../modules/node/pipelines/Factory.js";
import { MapDirectory } from "../lib/MapDirectory.js";

export async function main({
	directory,
	context = {},
}) {
	const pipeline = Factory([
		MapDirectory.Create({
			dir: path.join(process.cwd(), "app/data", directory),
		}),
	]);
	
	return await pipeline.run(context);
};

export default main;
