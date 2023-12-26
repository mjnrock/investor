import { APIDataSource, APIHelper, EnumAPIType, APIDefaultParams } from "./APIDataSource.js";

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
};

export default CryptoAPI;