import StatsHelper from "../lib/StatsHelper.js";
import DataSet from "../../../../modules/node/lib/data-set/DataSet.js";

export class ProcessStatistics {
	constructor ({ state = {} } = {}) {
		this.state = {
			periods: [ 7, 14, 21 ],
			...state,
		};
	}

	static Create({ state = {}, ...rest } = {}) {
		return new ProcessStatistics({ state, ...rest });
	}

	validateColumn(headers, column) {
		return headers.includes(column);
	}

	calculateStatisticsForPeriod(data, startIndex, period) {
		const slicedData = data.slice(startIndex, startIndex + period);
		return {
			mean: StatsHelper.mean(slicedData),
			median: StatsHelper.median(slicedData),
			mode: StatsHelper.mode(slicedData),
			range: StatsHelper.range(slicedData),
			stdDev: StatsHelper.standardDeviation(slicedData),
			mse: StatsHelper.meanSquaredError(slicedData),
			variance: StatsHelper.variance(slicedData)
		};
	}

	calculateDelta(currentRecord, previousRecord) {
		let delta = { date: previousRecord.date }; // Include date in delta record
		for(let key in currentRecord) {
			if(key !== 'date' && typeof currentRecord[ key ] === 'number' && typeof previousRecord[ key ] === 'number') {
				delta[ key ] = currentRecord[ key ] - previousRecord[ key ];
			}
		}
		return delta;
	}


	async run(input, { column = "close" } = {}) {
		if(!(input instanceof DataSet)) {
			input = DataSet.Create(input);
		}

		if(!this.validateColumn(input.meta.headers, column)) {
			throw new Error(`Column '${ column }' not found in dataset headers.`);
		}

		let dataSetPack = [];
		const sortedRecords = input.getRecords().sort((a, b) => new Date(b.date) - new Date(a.date));
		const columnData = sortedRecords.map(record => record[ column ]);

		for(let period of this.state.periods) {
			let periodResults = [];

			for(let i = 0; i <= sortedRecords.length - period; i++) {
				const statistics = this.calculateStatisticsForPeriod(columnData, i, period);
				let currentStats = {
					...statistics,
					date: sortedRecords[ i ]?.date,
					dateLower: sortedRecords[ i + period - 1 ]?.date,
					dateUpper: sortedRecords[ i ]?.date,
					delta: {}  // Initialize delta as an empty object
				};

				//FIXME: This doesn't work correctly, now it compares to nothing (previously it compared the value to "close")

				// For delta.previous.date
				if(i < sortedRecords.length - 1) {
					const previousRecord = sortedRecords[ i + 1 ];
					currentStats.delta.previous = this.calculateDelta(currentStats, previousRecord);
				}

				// For delta.period.date
				if(i + 2 * period <= sortedRecords.length) {
					const periodStartIndex = sortedRecords.findIndex(record => record.date === currentStats.dateLower);
					if(periodStartIndex >= 0) {
						const periodRecord = sortedRecords[ periodStartIndex ];
						currentStats.delta.period = this.calculateDelta(currentStats, periodRecord);
					}
				}

				periodResults.push(currentStats);
			}

			dataSetPack.push(DataSet.Create({
				meta: {
					...input.meta,
					statistics: {
						period: period,
						column: column,
					},
				},
				data: periodResults
			}));
		}
		return dataSetPack;
	}


}

export default ProcessStatistics;