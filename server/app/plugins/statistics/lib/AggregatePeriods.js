import { DataSet } from "../../../../modules/node/lib/data-set/DataSet.js";

export class AggregatePeriods {
	constructor ({ period = "week" } = {}) {
		this.period = period;
	}

	static Create({ state = {}, ...rest } = {}) {
		return new AggregatePeriods({ state, ...rest });
	}
	async run(input, { ...context } = {}) {
		const dataSet = DataSet.Create({ data: input });

		// break the dataSet.data records
	}
}

export default AggregatePeriods;