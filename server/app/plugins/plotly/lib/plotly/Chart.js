import deepcopy from "deepcopy";

import { DataSet } from "../../../../../modules/node/lib/data-set/DataSet.js";

export class Chart {
	constructor ({ source, data = [], layout = {}, config = {} } = {}) {
		this.source = source;  // DataSet instance
		this.data = data;      // Plotly data array
		this.layout = layout;  // Plotly layout object
		this.config = config;  // Plotly config object
	}

	toSchema() {
		return {
			data: this.data,
			layout: this.layout,
			config: this.config,
		};
	}

	updateData(data) {
		return Chart.Create({
			source: this.source,
			data: data,
			layout: this.layout,
			config: this.config,
		});
	}
	updateLayout(layout) {
		return Chart.Create({
			source: this.source,
			data: this.data,
			layout: layout,
			config: this.config,
		});
	}
	updateConfig(config) {
		return Chart.Create({
			source: this.source,
			data: this.data,
			layout: this.layout,
			config: config,
		});
	}

	static Create({ source, data = [], layout = {}, config = {} } = {}) {
		return new Chart({ source, data, layout, config });
	}
	static Copy(self) {
		return Chart.Create({
			source: DataSet.Copy(self.source),
			data: deepcopy(self.data),
			layout: deepcopy(self.layout),
			config: deepcopy(self.config),
		});
	}

	static ToBarChart(plotly, traceArrays = [ [ "date", "close" ] ]) {
		const dataSet = plotly.source;
		const records = dataSet.getRecords();
		const traces = traceArrays.map(trace => ({
			x: records.map(record => record[ trace[ 0 ] ]),
			y: records.map(record => record[ trace[ 1 ] ]),
			type: "bar"
		}));

		return Chart.Create({
			source: dataSet,
			data: traces,
			layout: { barmode: "group" }
		});
	}

	static ToLineChart(plotly, traceArrays = [ [ "date", "close" ] ]) {
		const dataSet = plotly.source;
		const records = dataSet.getRecords();
		const traces = traceArrays.map(trace => ({
			x: records.map(record => record[ trace[ 0 ] ]),
			y: records.map(record => record[ trace[ 1 ] ]),
			type: "scatter",
			mode: "lines+markers"
		}));

		return Chart.Create({
			source: dataSet,
			data: traces,
			layout: {}
		});
	}

	static ToCandlestickChart(plotly, traceArrays = [ [ "date", "open" ], [ "date", "high" ], [ "date", "low" ], [ "date", "close" ] ]) {
		const dataSet = plotly.source;
		const records = dataSet.getRecords();

		// Dynamically generate trace based on traceArrays
		const trace = traceArrays.reduce((acc, array) => {
			const [ xField, yField ] = array;
			acc[ xField ] = records.map(record => record[ xField ]);
			acc[ yField ] = records.map(record => record[ yField ]);

			return acc;
		}, {
			type: "candlestick",
			x: records.map(record => record.date),
		});

		const layout = {
			title: dataSet.meta.symbol,
			xaxis: {
				title: "Date",
				type: "date"
			},
			yaxis: {
				title: "Price (in USD)",
			}
		};

		return Chart.Create({
			source: dataSet,
			data: [ trace ],
			layout: layout
		});
	}


	// Update method to create a new Plotly instance with transformed data
	createChart(transformer, traceArrays) {
		return transformer(this, traceArrays);
	}
}

export default Chart;