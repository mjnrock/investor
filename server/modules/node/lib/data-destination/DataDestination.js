import deepcopy from "deepcopy";

import { DataSet } from "../data-set/DataSet.js";

export class DataDestination {
	static DefaultValidator = (data) => {
		if(!(data instanceof DataSet)) {
			return false;
		}

		const hasValidMeta = data.meta && typeof data.meta === "object" && Array.isArray(data.meta.headers);
		const hasValidData = Array.isArray(data.data);

		return hasValidMeta && hasValidData;
	};
	static DefaultTransformer = (data) => {
		if(!(data instanceof DataSet)) {
			return data;
		}

		return DataSet.ToJson(data);
	};

	static EnumDestinationType = {
		FILE: "FILE",
		API: "API"
	};

	constructor ({ type = DataDestination.EnumDestinationType.FILE, config = {}, transformer = null, validator = null } = {}) {
		this.type = type;
		this.config = config;

		this.transformer = transformer;
		this.validator = validator;
	}

	static Create({ config = {}, transformer = null, validator = null } = {}) {
		return new DataDestination({ config, transformer, validator });
	}
	static Copy(self) {
		return new DataDestination(deepcopy(self));
	}

	async run(data) {
		throw new Error("run method must be implemented in subclasses");
	}

	runTransformer(data) {
		if(this.transformer && typeof this.transformer === "function") {
			return this.transformer(data);
		}
		return data;
	}

	runValidator(data) {
		if(this.validator && typeof this.validator === "function") {
			return this.validator(data);
		}
		return true;
	}
}

export default DataDestination;