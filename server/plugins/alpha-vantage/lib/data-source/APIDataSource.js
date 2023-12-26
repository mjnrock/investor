import { APIDataSource as APIDataSourceNode } from "../../../../modules/node/data-source/APIDataSource.js";

export const APIHelper = {
	camelCase(str) {
		return str
			.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) =>
				index === 0 ? match.toLowerCase() : match.toUpperCase())
			.replace(/\s+/g, "");
	},
	processMetaData(metaData) {
		const processedMetaData = {};

		Object.keys(metaData).forEach(key => {
			const newKey = APIHelper.camelCase(key.replace(/^\d+\.\s*/, ""));
			processedMetaData[ newKey ] = metaData[ key ];
		});

		return processedMetaData;
	},
};

export const EnumAPIType = {
	CRYPTO: "crypto",
	STOCK: "stock",
	FOREX: "forex",
	ECONOMY: "economy",
	NEWS: "news",
	COMMODITY: "commodity",
};

export const APIDefaultParams = {
	[ EnumAPIType.CRYPTO ]: {
		function: "DIGITAL_CURRENCY_DAILY",
		market: "USD",
	},
	[ EnumAPIType.STOCK ]: {
		function: "TIME_SERIES_DAILY",
		outputsize: "full",
	},
	[ EnumAPIType.FOREX ]: {
		function: "FX_DAILY",
		outputsize: "full",
		from_symbol: "USD",
	},
	[ EnumAPIType.ECONOMY ]: {
		interval: "quarterly",
	},
	[ EnumAPIType.NEWS ]: {
		function: "NEWS_SENTIMENT",
		limit: 1000,
		sort: "LATEST",
	},
	[ EnumAPIType.COMMODITY ]: {
		interval: "daily",
	},
};

export class APIDataSource extends APIDataSourceNode {
	static EnumAPIType = EnumAPIType;

	constructor ({ state = {}, apiType = EnumAPIType.CRYPTO, ...opts } = {}) {
		super({
			...opts,
			state: {
				endpoint: "https://www.alphavantage.co/query",
				...state,
			},
		});

		this.setAPIType(apiType);
		this.setOutputJson();
	}

	static Create({ apiType = EnumAPIType.CRYPTO, ...opts } = {}) {
		return new this({ apiType, ...opts });
	}

	setAPIType(apiType = EnumAPIType.CRYPTO) {
		if(!APIDefaultParams[ apiType ]) {
			throw new Error(`Unknown data type: ${ apiType }`);
		}

		this.state.params = {
			...this.state.params,

			/* Load default config */
			...APIDefaultParams[ apiType ],

			/* Load default API key */
			apikey: process.env.ALPHA_VANTAGE_API_KEY,
		};

		return this;
	}

	setOutputJson() {
		this.state.params.datatype = "json";

		return this;
	}
	setOutputCsv() {
		this.state.params.datatype = "csv";

		return this;
	}

	setApiKey(apikey = process.env.ALPHA_VANTAGE_API_KEY) {
		this.state.params.apikey = apikey;

		return this;
	}

	/**
	 * Note that this differs from the parent class in that it expects
	 * `params` to be passed in as the first argument, rather than the
	 * more generic `input`.
	 */
	async run(params = {}, { variables } = {}) {
		this.state.params = {
			...this.state.params,
			...params,
		};

		return await super.run({}, { variables });
	}
}

export default {
	APIDataSource,
	APIHelper,
	EnumAPIType,
	APIDefaultParams,
};