import ModNode from "../../modules/node/package.js";

export async function main({
	fileName = "",      // Specify the file name
	chartType,		  	// "bar", "line", etc.
	traceArrays,		// Array of traces for the chart
	index = 0,			// Index of the data to use, if needed
}) {
	const loadFile = ModNode.Node.Create(ModNode.DataSource.FileDataSource.Create({
		state: {
			path: "./data/cryptos",
			file: fileName,
		},
	}));
	const createChart = ModNode.Node.Create(async (input, context = {}) => {
		if(Array.isArray(input)) {
			input = input[ index ];
		}

		let plotly = ModNode.Plotly.Plotly.Create({ source: input });

		switch(chartType) {
			case "bar":
				plotly = ModNode.Plotly.Plotly.ToBarChart(plotly, traceArrays);
				break;
			case "line":
				plotly = ModNode.Plotly.Plotly.ToLineChart(plotly, traceArrays);
				break;
			case "candlestick":
				plotly = ModNode.Plotly.Plotly.ToCandlestickChart(plotly, traceArrays);
				break;
			default:
				throw new Error("Unsupported chart type");
		}

		return plotly;
	});

	// Construct the pipeline
	const pipeline = ModNode.Pipeline.Create(
		loadFile,
		createChart
	);

	// Run the pipeline and handle the results
	const result = await pipeline.run();

	// Calculate the schema
	const schema = result[ result.length - 1 ].output.toSchema();

	return schema;
};

export default main;