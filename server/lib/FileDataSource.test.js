import path from "path";
import { FileDataSource } from "./FileDataSource.js";

const source = new FileDataSource({
	state: {
		path: path.join(__dirname, "data", "stocks"),
		file: `RKT.json`,
	},
});

const dataSet = await source.run();

console.log(dataSet.getRows(true).slice(0, 10));