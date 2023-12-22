import fs from "fs/promises";
import path from "path";

import { DataSource } from "./DataSource.js";
import { DataSet } from "./DataSet.js";
import deepcopy from "deepcopy";

/**
 * This currently assumes that the file is a JSON file,
 * created from `DataSet.ToJson`.
 */
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

	static Create({ state = {}, config = {}, modeler = null, analyzer = null } = {}) {
		return new FileDataSource({ state, config, modeler, analyzer });
	}
	static Copy(self) {
		return new FileDataSource(deepcopy(self));
	}

	async run() {
		const filePath = path.join(this.state.path, this.state.file);
		const fileData = await fs.readFile(filePath, this.state.encoding);
		const fileObj = JSON.parse(fileData);

		const dataSet = new DataSet(fileObj);

		const modeledData = this.runModeler(dataSet.getRecords());
		const analyzedMeta = this.runAnalyzer(dataSet);

		const next = DataSet.Create({
			meta: analyzedMeta,
			data: modeledData,
		});

		this.cache = next;

		return next;
	}
}

export default FileDataSource;