import { APIDataSource as APIDataSourceNode } from "../../../../../modules/node/lib/data-source/APIDataSource.js";

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


export const PeriodInSeconds = {
	minute: 60,
	fiveMinutes: 300,
	fifteenMinutes: 900,
	thirtyMinutes: 1800,
	hour: 3600,
	twoHours: 7200,
	fourHours: 14400,
	sixHours: 21600,
	eightHours: 28800,
	twelveHours: 43200,
	day: 86400,
	threeDays: 259200,
	fiveDays: 432000,
	week: 604800
};

export class APIDataSource extends APIDataSourceNode {
	static EnumAPIType = EnumAPIType;
	static APIDefaultParams = APIDefaultParams;
	static APIHelper = APIHelper;

	static DeterminePeriod(date1, date2) {
		try {
			const date = new Date(date1);
			const nextDate = new Date(date2);
			const deltaSec = Math.abs((date.getTime() - nextDate.getTime()) / 1000);

			if(deltaSec === PeriodInSeconds.minute) {
				return [ 1, "minute" ];
			} else if(deltaSec === PeriodInSeconds.fiveMinutes) {
				return [ 5, "minute" ];
			} else if(deltaSec === PeriodInSeconds.fifteenMinutes) {
				return [ 15, "minute" ];
			} else if(deltaSec === PeriodInSeconds.thirtyMinutes) {
				return [ 30, "minute" ];
			} else if(deltaSec === PeriodInSeconds.hour) {
				return [ 1, "hour" ];
			} else if(deltaSec === PeriodInSeconds.twoHours) {
				return [ 2, "hour" ];
			} else if(deltaSec === PeriodInSeconds.fourHours) {
				return [ 4, "hour" ];
			} else if(deltaSec === PeriodInSeconds.sixHours) {
				return [ 6, "hour" ];
			} else if(deltaSec === PeriodInSeconds.eightHours) {
				return [ 8, "hour" ];
			} else if(deltaSec === PeriodInSeconds.twelveHours) {
				return [ 12, "hour" ];
			} else if(deltaSec === PeriodInSeconds.day) {
				return [ 1, "day" ];
			} else if(deltaSec === PeriodInSeconds.threeDays) {
				return [ 3, "day" ];
			} else if(deltaSec === PeriodInSeconds.fiveDays) {
				return [ 5, "day" ];
			} else if(deltaSec === PeriodInSeconds.week) {
				return [ 1, "week" ];
			} else if(deltaSec % PeriodInSeconds.day === 0) {
				return [ deltaSec / PeriodInSeconds.day, "day" ];
			} else {
				return [ deltaSec, "second" ];
			}
		} catch(e) {
			console.error(e);
			return null;
		}
	};

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

export default APIDataSource;