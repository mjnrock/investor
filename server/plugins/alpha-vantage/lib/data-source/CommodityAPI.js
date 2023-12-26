import { APIDataSource, EnumAPIType } from "./APIDataSource.js";

export const EnumCommodityType = {
	CRUDE_OIL_WTI: "WTI",
	CRUDE_OIL_BRENT: "BRENT",
	NATURAL_GAS: "NATURAL_GAS",
	COPPER: "COPPER",
	ALUMINUM: "ALUMINUM",
	WHEAT: "WHEAT",
	CORN: "CORN",
	COTTON: "COTTON",
	SUGAR: "SUGAR",
	COFFEE: "COFFEE",
	GLOBAL_COMMODITIES_INDEX: "ALL_COMMODITIES",
};

export class CommodityAPI extends APIDataSource {
	static Modeler(data) {
		return data[ "data" ].map(entry => ({
			date: entry.date,
			value: parseFloat(entry.value)
		}));
	}

	static Analyzer(data) {
		const metaData = { ...data };

		delete metaData.data;

		metaData.sourceType = "commodity";

		return metaData;
	}

	constructor (opts = {}) {
		super({
			apiType: EnumAPIType.COMMODITY,
			...opts
		});

		this.modeler = CommodityAPI.Modeler;
		this.analyzer = CommodityAPI.Analyzer;
	}

	static Create(opts = {}) {
		return new this(opts);
	}

	setCommodity(key) {
		const value = EnumCommodityType[ key ];
		if(!value) {
			throw new Error(`Unknown commodity key: ${ key }`);
		}

		this.state.params = {
			...this.state.params,
			function: value
		};

		return this;
	}
}

export default {
	CommodityAPI,
	EnumCommodityType,
};