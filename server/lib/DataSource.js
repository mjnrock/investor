import deepcopy from "deepcopy";

export class DataSource {
	static EnumSourceType = {
		FILE: "FILE",
		API: "API",
	};

	constructor ({ type = DataSource.EnumSourceType.FILE, state = {}, config = {}, modeler = null, analyzer = null } = {}) {
		this.type = type;
		this.state = state;
		this.config = config;

		this.modeler = modeler;
		this.analyzer = analyzer;

		this.cache = null;
	}

	static Create({ state = {}, config = {}, modeler = null, analyzer = null } = {}) {
		return new DataSource({ state, config, modeler, analyzer });
	}
	static Copy(self) {
		return new DataSource(deepcopy(self));
	}

	async run() {
		throw new Error("run method must be implemented in subclasses");
	}

	runModeler(data) {
		if(this.modeler && typeof this.modeler === "function") {
			return data.map(this.modeler);
		}

		return data;
	}

	runAnalyzer(dataSet) {
		if(this.analyzer && typeof this.analyzer === "function") {
			return this.analyzer(dataSet);
		}

		return dataSet.meta;
	}
}

export default DataSource;