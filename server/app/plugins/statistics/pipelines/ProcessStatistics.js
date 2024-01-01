import fs from "fs/promises";
import path from "path";

import { ProcessStatistics } from "../lib/ProcessStatistics.js";

const loadJsonFile = async (filePath) => {
	try {
		const absoultePath = path.resolve(process.cwd(), filePath);
		const data = await fs.readFile(absoultePath, "utf8");
		return JSON.parse(data);
	} catch(err) {
		console.error('Error reading the JSON file:', err);
		return null;
	}
};

export async function main({
	type = "crypto",
	symbol,
	periods = [ 7, 14, 21 ],
	columns = [ "close" ],
}) {

	const pipeline = ProcessStatistics.Create({
		periods,
		columns,
	});
	const data = await loadJsonFile(`./data/${ type }/${ symbol }.ds`);

	const result = await pipeline.run(data);

	const filePath = path.resolve(`./app/data/{ type }/${ symbol }.stats`);

	// Ensure the directory exists
	const dir = path.dirname(filePath);
	await fs.mkdir(dir, { recursive: true });

	// Save the result to the file
	await fs.writeFile(filePath, JSON.stringify(result));
};

export default main;