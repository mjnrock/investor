import fs from "fs/promises";
import path from "path";
import deepcopy from "deepcopy";

import { DataDestination } from "./DataDestination.js";

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

	async run(data) {
		if(this.validator && !this.runValidator(data)) {
			throw new Error("Data validation failed");
		}

		const transformedData = this.runTransformer(data);
		const filePath = path.join(this.state.path, this.state.file);
		const fileData = JSON.stringify(transformedData);

		await fs.writeFile(filePath, fileData, this.state.encoding);

		return transformedData;
	}
}

export default FileDataDestination;