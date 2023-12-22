import fs from "fs/promises";
import axios from "axios";
import queryString from "query-string";
import deepcopy from "deepcopy";
import https from "https";

import { DataSource } from "../data-source/DataSource.js";
import { DataSet } from "../data-set/DataSet.js";

export class APIDataSource extends DataSource {
	constructor ({ state = {}, config = {}, modeler = null, analyzer = null } = {}) {
		super({
			type: DataSource.EnumSourceType.API,
			modeler,
			analyzer,
		});

		this.state = {
			endpoint: "",
			params: {},
			...state,
		};

		this.config = {
			trusted: true,
			...config,
		};
	}

	static Create({ state = {}, config = {}, modeler = null, analyzer = null } = {}) {
		return new APIDataSource({ state, config, modeler, analyzer });
	}
	static Copy(self) {
		return new APIDataSource(deepcopy(self));
	}

	async run() {
		//STUB: Deal with the self-signed certificate
		const cert = await fs.readFile("./certs/kiszka.crt", "utf8");
		const axiosInstance = axios.create({
			httpsAgent: new https.Agent({
				ca: cert,
			}),
		});

		try {
			const urlWithParams = `${ this.state.endpoint }?${ queryString.stringify(this.state.params) }`;
			const response = await axiosInstance.get(urlWithParams, this.config);
			let nextData,
				nextMeta;

			if(this.modeler && typeof this.modeler === "function") {
				nextData = this.modeler(response.data);
			}

			if(this.analyzer && typeof this.analyzer === "function") {
				nextMeta = this.analyzer(response.data);
			}

			const next = new DataSet({
				data: nextData,
				meta: nextMeta,
			});

			return next;
		} catch(error) {
			console.error("Error fetching data from API:", error);
			throw error;
		}
	}
}

export default APIDataSource;