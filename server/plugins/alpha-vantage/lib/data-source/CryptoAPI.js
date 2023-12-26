import { APIDataSource, APIHelper, EnumAPIType } from "./APIDataSource.js";

export const EnumCryptoType = {
	BITCOIN: "BTC",
	ETHEREUM: "ETH",
	GRAPH: "GRT",
	STELLAR_LUMENS: "XLM",
	TRONIX: "TRX",
};

export class CryptoAPI extends APIDataSource {
	static Modeler(data) {
		const timeSeries = data[ "Time Series (Digital Currency Daily)" ];

		return Object.keys(timeSeries).map(date => {
			const dayData = timeSeries[ date ];
			const processedDayData = { date };

			Object.keys(dayData).forEach(key => {
				// Remove trailing "(USD)" or " (USD)" and then apply camelCase
				const newKey = APIHelper.camelCase(
					key.replace(/^\d+[ab]?.\s*/, "").replace(/\s?\(USD\)$/, "")
				);
				processedDayData[ newKey ] = parseFloat(dayData[ key ]);
			});

			return processedDayData;
		});
	};
	static Analyzer(data) {
		const metaData = APIHelper.processMetaData(data[ "Meta Data" ]);

		metaData.sourceType = "crypto";

		return metaData;
	};

	constructor (opts = {}) {
		super({
			apiType: EnumAPIType.CRYPTO,
			...opts,
		});

		this.modeler = CryptoAPI.Modeler;
		this.analyzer = CryptoAPI.Analyzer;
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

export default {
	EnumCryptoType,
	CryptoAPI,
};