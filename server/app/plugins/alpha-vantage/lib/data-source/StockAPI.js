import { APIDataSource, APIHelper, EnumAPIType } from "./APIDataSource.js";

export class StockAPI extends APIDataSource {
	static Modeler(data) {
		const timeSeries = data[ "Time Series (Daily)" ];

		return Object.keys(timeSeries).map(date => {
			const dayData = timeSeries[ date ];
			const processedDayData = { date };

			Object.keys(dayData).forEach(key => {
				const newKey = APIHelper.camelCase(key.replace(/^\d+\.\s*/, ""));
				processedDayData[ newKey ] = parseFloat(dayData[ key ]);
			});

			return processedDayData;
		});
	};
	static Analyzer(data) {
		const metaData = APIHelper.processMetaData(data[ "Meta Data" ]);

		metaData.source = "alpha-vantage";
		metaData.sourceType = "stock";

		return metaData;
	};

	constructor (opts = {}) {
		super({
			apiType: EnumAPIType.STOCK,
			...opts,
		});

		this.modeler = StockAPI.Modeler;
		this.analyzer = StockAPI.Analyzer;
	}

	static Create(opts = {}) {
		return new this(opts);
	}

	setSymbol(symbol) {
		this.state.params = {
			...this.state.params,
			symbol,
		};

		return this;
	}
};

export default StockAPI;