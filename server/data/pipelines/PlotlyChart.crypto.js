import ModNode from "../../modules/node/package.js";
import fs from "fs/promises";

export async function main({
	fileName = "",      // Specify the file name
	chartType = "bar",  // "bar" or "line"
	traceArrays = []     // Array of traces for the chart
}) {
	// Step 1: Load the File
	const loadFile = ModNode.Node.Create(ModNode.DataSource.FileDataSource.Create({
		state: {
			path: "./data/cryptos",
			file: fileName,
		},
	}));

	// Step 2: Convert to DataSet
	const toDataSet = ModNode.Node.Create(async (input, context = {}) => {
		return new ModNode.DataSet.DataSet(input);
	});

	// Step 3: Create a Plotly Chart
	const createChart = ModNode.Node.Create(async (input, context = {}) => {
		let plotly = ModNode.Plotly.Plotly.Create({ source: input });

		switch(chartType) {
			case "bar":
				plotly = ModNode.Plotly.Plotly.ToBarChart(plotly, traceArrays);
				break;
			case "line":
				plotly = ModNode.Plotly.Plotly.ToLineChart(plotly, traceArrays);
				break;
			default:
				throw new Error("Unsupported chart type");
		}

		// Here you can further process the plotly object, like saving or rendering the chart
		return plotly;
	});

	// Construct the pipeline
	const pipeline = ModNode.Pipeline.Create(
		loadFile,
		toDataSet,
		createChart
	);

	// Run the pipeline and handle the results
	const result = await pipeline.run();

	const schema = result[ result.length - 1 ].output.toSchema();

	fs.writeFile(`./TEST.json`, JSON.stringify(schema, null, 2));

	return result;
};

export default main;