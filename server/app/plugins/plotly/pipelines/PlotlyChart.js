import LibPlotly from "../lib/package.js";
import ModNode from "../../../../modules/node/package.js";

export async function main({
	type = "crypto",
	fileName = "",      // Specify the file name
	chartType = "bar",		  	// "bar", "line", etc.
	traceArrays,		// Array of traces for the chart
	index = 0,			// If a file is an array, specify the index to use
}) {
	const loadFile = ModNode.Lib.Node.Create(ModNode.Lib.DataSource.FileDataSource.Create({
		state: {
			path: `./app/data/${ type }`,
			file: fileName,
		},
	}));
	const createChart = ModNode.Lib.Node.Create(async (input, context = {}) => {
		if(Array.isArray(input)) {
			input = input[ index ];
		}

		let plotly = LibPlotly.Plotly.Chart.Create({ source: input });

		switch(chartType) {
			case "bar":
				plotly = LibPlotly.Plotly.Chart.ToBarChart(plotly, traceArrays);
				break;
			case "line":
				plotly = LibPlotly.Plotly.Chart.ToLineChart(plotly, traceArrays);
				break;
			case "candlestick":
				plotly = LibPlotly.Plotly.Chart.ToCandlestickChart(plotly, traceArrays);
				break;
			default:
				throw new Error("Unsupported chart type");
		}

		return plotly;
	});

	// Construct the pipeline
	const pipeline = ModNode.Lib.Pipeline.Create(
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