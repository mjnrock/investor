import fs from "fs/promises";
import path from "path";
import deepcopy from "deepcopy";

import { DataSource } from "./DataSource.js";
import { DataSet } from "../data-set/DataSet.js";

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

	async run(input, config) {
		const { variables } = config;
		if(this.validator && !this.runValidator(input)) {
			throw new Error("Data validation failed");
		}

		let fileName = this.state.file;
		if(variables) {
			for(const variable in variables) {
				fileName = fileName.replace(`{{${ variable }}}`, variables[ variable ]);
			}
		}
		const filePath = path.join(this.state.path, fileName);
		console.log(path.resolve(filePath))
		const fileData = await fs.readFile(path.resolve(filePath), this.state.encoding);
		const fileContent = JSON.parse(fileData);

		if(Array.isArray(fileContent)) {
			return this.processMultipleDataSets(fileContent);
		} else {
			return this.processSingleDataSet(fileContent);
		}
	}

	processSingleDataSet(dataSetObj) {
		const dataSet = new DataSet(dataSetObj);

		const modeledData = this.runModeler(dataSet.getRecords());
		const analyzedMeta = this.runAnalyzer(dataSet);

		const next = DataSet.Create({
			meta: analyzedMeta,
			data: modeledData,
		});

		this.cache = next;
		return next;
	}

	processMultipleDataSets(dataSetArray) {
		return dataSetArray.map(dataSetObj => this.processSingleDataSet(dataSetObj));
	}
}

export default FileDataSource;