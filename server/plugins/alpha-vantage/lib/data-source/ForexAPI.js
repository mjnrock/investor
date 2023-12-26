import { APIDataSource, APIHelper, EnumAPIType } from "./APIDataSource.js";

export class ForexAPI extends APIDataSource {
	static Modeler(data) {
		const timeSeries = data[ "Time Series FX (Daily)" ];

		return Object.keys(timeSeries).map(date => {
			const dayData = timeSeries[ date ];
			const processedDayData = { date };

			Object.keys(dayData).forEach(key => {
				const newKey = APIHelper.camelCase(key.replace(/^\d+\.\s*/, ""));
				processedDayData[ newKey ] = parseFloat(dayData[ key ]);
			});

			return processedDayData;
		});
	}

	static Analyzer(data) {
		const metaData = APIHelper.processMetaData(data[ "Meta Data" ]);

		metaData.sourceType = "forex";

		return metaData;
	}

	constructor (opts = {}) {
		super({
			apiType: EnumAPIType.FOREX,
			...opts
		});

		this.modeler = ForexAPI.Modeler;
		this.analyzer = ForexAPI.Analyzer;
	}

	static Create(opts = {}) {
		return new this(opts);
	}

	setToSymbol(symbol) {
		this.state.params = {
			...this.state.params,
			to_symbol: symbol,
		};

		return this;
	}
	setFromSymbol(symbol) {
		this.state.params = {
			...this.state.params,
			from_symbol: symbol,
		};

		return this;
	}
}

export default {
	ForexAPI,
};