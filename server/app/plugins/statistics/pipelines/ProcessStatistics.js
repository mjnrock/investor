import fs from "fs/promises";
import { ProcessStatistics } from "../lib/ProcessStatistics.js";

export async function main({
	type = "crypto",
	symbol,
	periods = [ 7, 14, 21 ],
	columns = [ "close" ],
}) {
	// Load the data
	const fileContents = await fs.readFile(`./app/data/${ type }/${ symbol }.ds`, "utf8");
	const data = JSON.parse(fileContents);

	// Create the pipeline
	const pipeline = ProcessStatistics.Create({
		periods,
		columns,
	});
	const result = await pipeline.run(data);

	// Save the result to the file
	await fs.writeFile(`./app/data/${ type }/${ symbol }.stats`, JSON.stringify(result));
};

export default main;