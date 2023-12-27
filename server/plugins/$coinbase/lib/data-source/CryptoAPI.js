import { APIDataSource } from "../../../../modules/node/lib/data-source/APIDataSource.js";
import jwt from "jsonwebtoken";
import queryString from "query-string";

export class CryptoAPI extends APIDataSource {
	static EnumCryptoType = EnumCryptoType;

	static Modeler(data) {
		// Transform each row of data here
		return data.map(row => ({
			date: new Date(row[ 0 ] * 1000),
			low: row[ 1 ],
			high: row[ 2 ],
			open: row[ 3 ],
			close: row[ 4 ],
			volume: row[ 5 ]
		}));
	};

	static Analyzer(data) {
		// Create meta-data object here
		return {
			symbol: data.symbol,
			market: "USD",
			source: "coinbase",
			sourceType: "crypto",
		};
	};

	constructor (opts = {}) {
		super({
			state: {
				endpoint: "https://api.pro.coinbase.com",
				apiKeyName: process.env.COINBASE_API_KEY_NAME,
				apiKeyId: process.env.COINBASE_API_KEY_ID,
				apiKey: process.env.COINBASE_API_KEY,
				...opts.state,
				params: {
					symbol: "BTC-USD",
					...opts.state?.params,
				},
			},
			...opts,
		});

		this.modeler = CryptoAPI.Modeler;
		this.analyzer = CryptoAPI.Analyzer;
	}

	static Create(opts = {}) {
		return new this(opts);
	}

	setSymbol(symbol) {
		this.state.params = {
			...this.state.params,
			symbol,
		};

		return this;
	}

	generateJWT() {
		const key_name = process.env.COINBASE_API_KEY_NAME;
		const key_secret = process.env.COINBASE_API_KEY;
		const request_method = "GET";
		const url = "api.coinbase.com";
		const request_path = "/api/v3/brokerage/accounts";
		const service_name = "retail_rest_api_proxy";
		const algorithm = "ES256";
		const uri = request_method + " " + url + request_path;

		return {
			uri,
			jwt: sign({
				aud: [ service_name ],
				iss: "coinbase-cloud",
				nbf: Math.floor(Date.now() / 1000),
				exp: Math.floor(Date.now() / 1000) + 10,
				sub: key_name,
				uri,
			},
				key_secret,
				{
					algorithm,
					header: {
						kid: key_name,
						nonce: Math.floor(Date.now() / 1000).toString(),
					},
				}),
		};
	}
	async run(input, { options = {}, variables } = {}) {		
		//FIXME: This doesn't work yet, the signed URL isn't being accepted -- requires more refactoring with `super`
		const { uri, jwt } = this.generateJWT();
		this.state.endpoint = "https://api.coinbase.com/products";

		const opts = {
			...options,
			headers: {
				...(options?.headers ?? {}),
				"Authorization": `Bearer ${ jwt }`
			},
		};

		return await super.run(input, { method: "get", opts, variables });
	}
}

export default CryptoAPI;