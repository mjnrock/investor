import APIDataSource from "../APIDataSource.js";

// const source = new APIDataSource({
// 	state: {
// 		// endpoint: "https://www.alphavantage.co/query",
// 		endpoint: `https://buddha.com:${ process.env.PORT }/stock`,
// 		params: {
// 			function: "TIME_SERIES_DAILY",
// 			symbol: "RKT",
// 			apikey: process.env.ALPHA_VANTAGE_API_KEY,
// 			outputsize: "full",
// 		},
// 	},
// 	modeler: APIHelper.stocksModeler,
// 	analyzer: APIHelper.stocksAnalyzer,
// });

// const dataSet = await source.run();

// console.log(dataSet.meta);
// console.log(dataSet.data.slice(0, 5));

const source = new APIDataSource({
	state: {
		// endpoint: "https://www.alphavantage.co/query",
		endpoint: `https://buddha.com:${ process.env.PORT }/crypto`,
		params: {
			function: "TIME_SERIES_DAILY",
			symbol: "RKT",
			apikey: process.env.ALPHA_VANTAGE_API_KEY,
			outputsize: "full",
		},
	},
	modeler: APIHelper.cryptoModeler,
	analyzer: APIHelper.cryptoAnalyzer,
});

const dataSet = await source.run();

console.log(dataSet.meta);
console.log(dataSet.data.slice(0, 5));