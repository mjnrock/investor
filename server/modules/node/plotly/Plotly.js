import deepcopy from "deepcopy";

import { DataSet } from "../data-set/DataSet.js";

export class Plotly {
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

	static Create({ source, data = [], layout = {}, config = {} } = {}) {
		return new Plotly({ source, data, layout, config });
	}
	static Copy(self) {
		return Plotly.Create({
			source: DataSet.Copy(self.source),
			data: deepcopy(self.data),
			layout: deepcopy(self.layout),
			config: deepcopy(self.config),
		});
	}

	static ToBarChart(plotly, traceArrays = []) {
		const dataSet = plotly.source;
		const records = dataSet.getRecords();
		const traces = traceArrays.map(trace => ({
			x: records.map(record => record[ trace[ 0 ] ]),
			y: records.map(record => record[ trace[ 1 ] ]),
			type: "bar"
		}));

		return Plotly.Create({
			source: dataSet,
			data: traces,
			layout: { barmode: "group" }
		});
	}

	static ToLineChart(plotly, traceArrays = []) {
		const dataSet = plotly.source;
		const records = dataSet.getRecords();
		const traces = traceArrays.map(trace => ({
			x: records.map(record => record[ trace[ 0 ] ]),
			y: records.map(record => record[ trace[ 1 ] ]),
			type: "scatter",
			mode: "lines+markers"
		}));

		return Plotly.Create({
			source: dataSet,
			data: traces,
			layout: {}
		});
	}

	static ToCandlestickChart(plotly) {
		const dataSet = plotly.source;
		const records = dataSet.getRecords();

		const trace = {
			x: records.map(record => record.date),
			open: records.map(record => record.open),
			high: records.map(record => record.high),
			low: records.map(record => record.low),
			close: records.map(record => record.close),
			type: "candlestick",
			name: dataSet.meta.digitalCurrencyName,
		};

		const layout = {
			title: `${ dataSet.meta.digitalCurrencyName } Candlestick Chart`,
			xaxis: {
				title: "Date",
				type: "date"
			},
			yaxis: {
				title: "Price (in USD)",
			}
		};

		return Plotly.Create({
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

export default Plotly;