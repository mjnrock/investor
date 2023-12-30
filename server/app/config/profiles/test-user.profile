{
	"id": "89b0928e-254c-46b6-aa66-499df9a99ea9",
	"pid": null,
	"type": "user",
	"username": "test-user",
	"bio": {
		"first": "Test",
		"last": "User"
	},
	"config": {
		"symbols": {
			"symbol-group-1": {
				"crypto": [
					"BTC",
					"ETH",
					"GRT",
					"XLM",
					"TRX"
				],
				"stock": [
					"RKT",
					"PTON",
					"CHWY",
					"HE",
					"SATS"
				]
			}
		},
		"indicators": {
			"indicator-group-1": [
				[
					"sma",
					[
						[
							"close"
						],
						[
							"close"
						],
						[
							"close"
						],
						[
							"close"
						]
					],
					[
						[
							7
						],
						[
							14
						],
						[
							21
						],
						[
							28
						]
					]
				]
			]
		},
		"pipelines": [
			[
				"0 */30 * * * *",
				"crypto",
				"alpha-vantage",
				"FetchNormalizeSave",
				{
					"symbols": [
						"BTC",
						"ETH",
						"GRT",
						"XLM",
						"TRX"
					],
					"delay": 1000,
					"context": {}
				}
			],
			[
				"10 */30 * * * *",
				"crypto",
				"technical-analysis",
				"ProcessTechnicalIndicators",
				{
					"type": "cryptos",
					"symbols": [
						"BTC",
						"ETH",
						"GRT",
						"XLM",
						"TRX"
					],
					"indicators": {
						"BTC": [
							[
								"sma",
								[
									[
										"close"
									]
								],
								[
									[
										7
									]
								]
							]
						],
						"ETH": [
							[
								"sma",
								[
									[
										"close"
									]
								],
								[
									[
										7
									]
								]
							]
						]
					},
					"context": {}
				}
			],
			[
				"0 */30 * * * *",
				"stock",
				"alpha-vantage",
				"FetchNormalizeSave",
				{
					"symbols": [
						"RKT",
						"PTON",
						"CHWY",
						"HE",
						"SATS"
					],
					"delay": 1000,
					"context": {}
				}
			],
			[
				"10 */30 * * * *",
				"stock",
				"technical-analysis",
				"ProcessTechnicalIndicators",
				{
					"type": "stocks",
					"symbols": [
						"RKT",
						"PTON",
						"CHWY",
						"HE",
						"SATS"
					],
					"indicators": {
						"BTC": [
							[
								"sma",
								[
									[
										"close"
									]
								],
								[
									[
										7
									]
								]
							]
						],
						"ETH": [
							[
								"sma",
								[
									[
										"close"
									]
								],
								[
									[
										7
									]
								]
							]
						]
					},
					"context": {}
				}
			]
		]
	}
}