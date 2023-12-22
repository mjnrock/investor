/**
 * This APIHelper is sepcifically designed for AlphaVantage's API.
 */
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

	cryptoModeler(data) {
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
	},

	cryptoAnalyzer(data) {
		const metaData = APIHelper.processMetaData(data[ "Meta Data" ]);

		metaData.sourceType = "crypto";

		return metaData;
	},

	stocksModeler(data) {
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
	},

	stocksAnalyzer(data) {
		const metaData = APIHelper.processMetaData(data[ "Meta Data" ]);

		metaData.sourceType = "stock";

		return metaData;
	},
};

export default APIHelper;