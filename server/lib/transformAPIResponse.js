import DataSet from "./DataSet.js";

function camelCase(str) {
	return str
		.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) =>
			index === 0 ? match.toLowerCase() : match.toUpperCase())
		.replace(/\s+/g, "");
}

function processMetaData(metaData) {
	const processedMetaData = {};
	Object.keys(metaData).forEach(key => {
		const newKey = camelCase(key.replace(/^\d+\.\s*/, ""));
		processedMetaData[ newKey ] = metaData[ key ];
	});
	return processedMetaData;
}

function processData(timeSeries) {
	return Object.keys(timeSeries).map(date => {
		const dayData = timeSeries[ date ];
		const processedDayData = { date };
		Object.keys(dayData).forEach(key => {
			const newKey = camelCase(key.replace(/^\d+\.\s*/, ""));
			processedDayData[ newKey ] = dayData[ key ];
		});
		return processedDayData;
	});
}

export function mapper(data) {
	const metaData = processMetaData(data[ "Meta Data" ]);
	const timeSeriesData = processData(data[ "Time Series (Daily)" ]);

	return new DataSet({
		meta: metaData,
		data: timeSeriesData
	});
};

export default mapper;