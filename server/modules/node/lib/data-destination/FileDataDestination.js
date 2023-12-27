import fs from "fs/promises";
import path from "path";
import deepcopy from "deepcopy";

import { DataDestination } from "./DataDestination.js";
import DataSet from "../data-set/DataSet.js";

export class FileDataDestination extends DataDestination {
	static RootPath = process.cwd();

	constructor ({ state = {}, config = {}, transformer, validator } = {}) {
		super({
			type: DataDestination.EnumDestinationType.FILE,
			transformer,
			validator,
		});

		this.state = {
			encoding: "utf8",
			path: FileDataDestination.RootPath,
			file: "",
			...state,
		};
		this.config = {
			...config,
		};
	}

	static Create({ state = {}, config = {}, transformer, validator } = {}) {
		return new FileDataDestination({ state, config, transformer, validator });
	}
	static Copy(self) {
		return new FileDataDestination(deepcopy(self));
	}

	async run(input, { variables } = {}) {
		// Create file name and pathing
		let fileName = this.state.file;
		if(variables) {
			for(const variable in variables) {
				fileName = fileName.replace(`{{${ variable }}}`, variables[ variable ]);
			}
		}
		const filePath = path.join(this.state.path, fileName);

		const validateAndTransform = (data) => {
			if(this.validator && !this.runValidator(data)) {
				throw new Error("Data validation failed");
			}

			return this.runTransformer(data);
		};

		// Check if the file is a Collection of DataSets, or just a single DataSet
		let transformedData;
		if(Array.isArray(input) && input[ 0 ] instanceof DataSet) {
			// DataSet Collection (Array of DataSets)
			transformedData = input.map(dataSet => validateAndTransform(dataSet));
		} else {
			// Single DataSet
			transformedData = validateAndTransform(input);
		}

		// Actually write the file
		const fileData = JSON.stringify(transformedData);
		await fs.writeFile(filePath, fileData, this.state.encoding);

		return transformedData;
	}
}

export default FileDataDestination;