import StatsHelper from "./StatsHelper.js";
import DataSet from "../../../../modules/node/lib/data-set/DataSet.js";

export class ProcessStatistics {
	constructor ({ state = {} } = {}) {
		this.state = {
			periods: [ 7, 14, 21 ],
			columns: [ "close" ],
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
		Object.keys(currentRecord).forEach(key => {
			if(key !== 'date' && typeof currentRecord[ key ] === 'number') {
				delta[ key ] = (previousRecord[ key ] && typeof previousRecord[ key ] === 'number')
					? currentRecord[ key ] - previousRecord[ key ]
					: null;
			}
		});
		return delta;
	}


	async run(input, { column = this.state.columns } = {}) {
		if(!(input instanceof DataSet)) {
			input = DataSet.Create(input);
		}

		if(Array.isArray(column)) {
			return column
				.map(async col => await this.run(input, { column: col }))
				.reduce(async (acc, curr) => [ ...(await acc), ...(await curr) ], []);
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

				if(i < sortedRecords.length - 1) {
					currentStats.delta.previous = this.calculateDelta(sortedRecords[ i ], sortedRecords[ i + 1 ]);
				}

				if(i + 2 * period <= sortedRecords.length) {
					currentStats.delta.period = this.calculateDelta(sortedRecords[ i ], sortedRecords[ i + period - 1 ]);
				}

				periodResults.push(currentStats);
			}

			for(let i = 0; i < sortedRecords.length - period; i++) {
				let statsRecord = periodResults[ i ];

				if(i < sortedRecords.length - 1) {
					statsRecord.delta.previous = {
						...statsRecord.delta.previous,
						...this.calculateDelta(periodResults[ i ], periodResults[ i + 1 ]),
					};
				}

				if(i + 2 * period < sortedRecords.length) {
					statsRecord.delta.period = {
						...statsRecord.delta.period,
						...this.calculateDelta(periodResults[ i ], periodResults[ i + period - 1 ]),
					};
				}
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