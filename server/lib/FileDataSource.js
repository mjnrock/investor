import fs from "fs/promises";
import { DataSource } from "./DataSource.js";
import { DataSet } from "./DataSet.js"; // Import DataSet class
import path from "path";

export class FileDataSource extends DataSource {
	static RootPath = process.cwd();

	constructor ({ state = {}, config = {}, modeler = null, analyzer = null } = {}) {
		super({
			type: DataSource.EnumSourceType.FILE,
			modeler,
			analyzer,
		});

		this.state = {
			encoding: "utf8",
			path: FileDataSource.RootPath,
			file: "",
			...state,
		};
		this.config = {
			...config,
		};
	}

	async fetchData() {
		const filePath = path.join(this.state.path, this.state.file);
		const fileData = await fs.readFile(filePath, this.state.encoding);
		const fileObj = JSON.parse(fileData); // Assuming fileData is a JSONified DataSet

		const dataSet = new DataSet(fileObj);

		const modeledData = this.applyModeler(dataSet.getRecords());
		const analyzedMeta = this.analyzeData(dataSet);

		return DataSet.Create({
			meta: analyzedMeta,
			data: modeledData,
		});
	}
}

export default FileDataSource;