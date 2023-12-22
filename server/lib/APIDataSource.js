import axios from "axios";
import { DataSource } from "./DataSource.js";
import DataSet from "./DataSet.js"; // Import DataSet class

export class APIDataSource extends DataSource {
	constructor ({ state = {}, config = {}, modeler = null } = {}) {
		super({ type: DataSource.EnumSourceType.API, state, config, modeler });
	}

	async fetchData() {
		const response = await axios.get(this.state.url, this.config);
		const modeledData = this.applyModeler(response.data);
		return new DataSet({ data: modeledData });
	}
}

export default APIDataSource;