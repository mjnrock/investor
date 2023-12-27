import { APIDataSource, EnumAPIType } from "./APIDataSource.js";

export const EnumEconomicIndicator = {
	REAL_GDP: "REAL_GDP",
	REAL_GDP_PER_CAPITA: "REAL_GDP_PER_CAPITA",
	TREASURY_YIELD: "TREASURY_YIELD",
	FEDERAL_FUNDS_RATE: "FEDERAL_FUNDS_RATE",
	CPI: "CPI",
	INFLATION: "INFLATION",
	RETAIL_SALES: "RETAIL_SALES",
	DURABLE_GOODS_ORDERS: "DURABLES",
	UNEMPLOYMENT_RATE: "UNEMPLOYMENT",
	NONFARM_PAYROLL: "NONFARM_PAYROLL",
};

export class EconomyAPI extends APIDataSource {
	static EnumEconomicIndicator

	static Modeler(data) {
		return data[ "data" ].map(entry => ({
			date: entry.date,
			value: parseFloat(entry.value)
		}));
	}

	static Analyzer(data) {
		const metaData = { ...data };
		delete metaData.data;
		metaData.sourceType = "economic_indicator";
		return metaData;
	}

	constructor (opts = {}) {
		super({
			apiType: EnumAPIType.ECONOMY,
			...opts
		});

		this.modeler = EconomyAPI.Modeler;
		this.analyzer = EconomyAPI.Analyzer;
	}

	static Create(opts = {}) {
		return new this(opts);
	}

	setIndicator(key) {
		const value = EnumEconomicIndicator[ key ];
		if(!value) {
			throw new Error(`Unknown economic indicator key: ${ key }`);
		}

		this.state.params = {
			...this.state.params,
			function: value
		};

		return this;
	}
}

export default EconomyAPI;