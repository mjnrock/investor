import { v4 as uuid } from "uuid";
import deepcopy from "deepcopy";

export class DataSet {
	static EnumRecordType = {
		RECORD: "record",
		ROW: "row",
		COLUMN: "column",
	};

	constructor ({ meta = {}, data = [], id } = {}) {
		this.id = id ?? uuid();
		this.meta = {
			type: DataSet.EnumRecordType.RECORD,
			headers: [],
			...meta,
		};
		this.data = [
			...data,
		];

		this.meta.headers = DataSet.Analyze(this);
	}

	static Analyze(self) {
		if(!self.data.length) {
			return [];
		}

		if(self.meta.type === DataSet.EnumRecordType.RECORD) {
			return Object.keys(self.data[ 0 ]);
		} else if(self.meta.type === DataSet.EnumRecordType.ROW) {
			return self.data[ 0 ];
		} else if(self.meta.type === DataSet.EnumRecordType.COLUMN) {
			return self.data.map((column) => {
				return column[ 0 ];
			});
		}

		return [];
	}
	static Create(...args) {
		return new DataSet(...args);
	}
	static Copy(self, { meta = {}, reanalyze = true } = {}) {
		const next = deepcopy(self);
		let nextMeta = {
			...next.meta,
			...meta,
		};

		if(reanalyze) {
			nextMeta = {
				...nextMeta,
				headers: DataSet.Analyze(next),
			};
		}

		return new DataSet({
			meta: nextMeta,
			data: next.data,
		});
	}
	static ToJson(self) {
		return JSON.stringify(self);
	}
	static FromJson(json) {
		const { meta, data } = JSON.parse(json);

		return new DataSet({
			meta,
			data,
		});
	}
	toRecords() {
		const data = [];

		if(this.meta.type === DataSet.EnumRecordType.RECORD) {
			data.push(...this.data);
		} else if(this.meta.type === DataSet.EnumRecordType.ROW) {
			this.data.forEach((row) => {
				const record = {};

				this.meta.headers.forEach((header, index) => {
					record[ header ] = row[ index ];
				});

				data.push(record);
			});
		} else if(this.meta.type === DataSet.EnumRecordType.COLUMN) {
			this.meta.headers.forEach((header, index) => {
				const record = {};

				record[ header ] = this.data[ index ];

				data.push(record);
			});
		}

		return DataSet.Create({
			meta: {
				type: DataSet.EnumRecordType.RECORD,
				headers: this.meta.headers,
			},
			data,
		});
	}
	toRows() {
		const data = [];

		if(this.meta.type === DataSet.EnumRecordType.RECORD) {
			this.data.forEach((record) => {
				const row = [];

				this.meta.headers.forEach((header) => {
					row.push(record[ header ]);
				});

				data.push(row);
			});
		} else if(this.meta.type === DataSet.EnumRecordType.ROW) {
			data.push(...this.data);
		} else if(this.meta.type === DataSet.EnumRecordType.COLUMN) {
			this.data.forEach((column) => {
				const row = [];

				column.forEach((value) => {
					row.push(value);
				});

				data.push(row);
			});
		}

		return DataSet.Create({
			meta: {
				type: DataSet.EnumRecordType.ROW,
				headers: this.meta.headers,
			},
			data,
		});
	}
	toColumns() {
		const data = [];

		if(this.meta.type === DataSet.EnumRecordType.RECORD) {
			this.meta.headers.forEach((header) => {
				const column = [];

				this.data.forEach((record) => {
					column.push(record[ header ]);
				});

				data.push(column);
			});
		} else if(this.meta.type === DataSet.EnumRecordType.ROW) {
			this.meta.headers.forEach((header, index) => {
				const column = [];

				this.data.forEach((row) => {
					column.push(row[ index ]);
				});

				data.push(column);
			});
		} else if(this.meta.type === DataSet.EnumRecordType.COLUMN) {
			data.push(...this.data);
		}

		return DataSet.Create({
			meta: {
				type: DataSet.EnumRecordType.COLUMN,
				headers: this.meta.headers,
			},
			data,
		});
	}

	getDateMap({ allArrays = false } = {}) {
		const records = this.getRecords();

		const map = {};
		for(const record of records) {
			const { date } = record;

			if(!map[ date ]) {
				map[ date ] = allArrays ? [ record ] : record;
			} else if(Array.isArray(map[ date ])) {
				map[ date ].push(record);
			} else {
				map[ date ] = [ map[ date ], record ];
			}
		}

		return map;
	}
	getRecords() {
		if(this.meta.type === DataSet.EnumRecordType.RECORD) {
			return this.data;
		}

		return this.toRecords().data;
	}
	getRows(includeHeaders = true) {
		if(this.meta.type === DataSet.EnumRecordType.ROW) {
			if(includeHeaders) {
				return [ this.meta.headers, ...this.data ];
			}

			return this.data;
		}

		const data = this.toRows().data;

		if(includeHeaders) {
			data.unshift(this.meta.headers);
		}

		return data;
	}
	getColumns(includeHeaders = true) {
		if(this.meta.type === DataSet.EnumRecordType.COLUMN) {
			if(includeHeaders) {
				return [ this.meta.headers, ...this.data ];
			}

			return this.data;
		}

		const data = this.toColumns().data;

		if(includeHeaders) {
			data.unshift(this.meta.headers);
		}

		return data;
	}

	filter(fn, ...args) {
		const data = [];
		if(Array.isArray(fn)) {
			/* Boolean filter */
			if(fn.length !== this.data.length) {
				throw new Error("Invalid filter length");
			}

			this.data.forEach((record, index) => {
				if(fn[ index ]) {
					data.push(record);
				}
			});
		} else if(typeof fn === "function") {
			/* Function filter */
			this.data.forEach((record) => {
				if(fn(record, ...args)) {
					data.push(record);
				}
			});
		}

		const next = DataSet.Create({
			meta: {
				type: this.meta.type,
			},
			data,
		});

		next.meta.headers = DataSet.Analyze(next);

		return next;
	}
	map(fn, ...args) {
		const data = [];

		this.data.forEach((record) => {
			data.push(fn(record, ...args));
		});

		const next = DataSet.Create({
			meta: {
				type: this.meta.type,
			},
			data,
		});

		next.meta.headers = DataSet.Analyze(next);

		return next;
	}
	reduce(fn, ...args) {
		let result = null;

		this.data.forEach((record) => {
			result = fn(result, record, ...args);
		});

		return result;
	}

	static TransformToDataSet(data, modeler, analyzer) {
		if(!modeler || !analyzer) {
			throw new Error("Modeler and analyzer functions are required");
		}

		const modeledData = modeler(data);
		const analyzedMeta = analyzer(data);

		return new DataSet({
			meta: analyzedMeta,
			data: modeledData,
		});
	}
};

export default DataSet;