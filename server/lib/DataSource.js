export class DataSource {
	static EnumSourceType = {
		FILE: "FILE",
		API: "API",
	};

	constructor ({ type = DataSource.EnumSourceType.FILE, state = {}, config = {}, modeler = null, analyzer = null } = {}) {
		this.type = type;
		this.state = state;
		this.config = config;
		this.modeler = modeler; // Function to transform each row
		this.analyzer = analyzer; // Function to analyze and return meta data
	}

	async fetchData() {
		throw new Error("fetchData method must be implemented in subclasses");
	}

	applyModeler(data) {
		if(this.modeler && typeof this.modeler === "function") {
			return data.map(this.modeler);
		}
		return data;
	}

	analyzeData(dataSet) {
		if(this.analyzer && typeof this.analyzer === "function") {
			return this.analyzer(dataSet);
		}
		return dataSet.meta; // Default behavior
	}
}

export default DataSource;