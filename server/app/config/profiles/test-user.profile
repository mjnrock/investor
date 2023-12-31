{
	"id": "89b0928e-254c-46b6-aa66-499df9a99ea9",
	"pid": null,
	"type": "service",
	"username": "test-user",
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
				"alpha-vantage",
				"CryptoFetchNormalizeSave",
				{
					"symbols": [
						"BTC",
						"ETH",
						"GRT",
						"XLM",
						"TRX"
					],
					"delay": 1000
				}
			],
			[
				"technical-analysis",
				"ProcessTechnicalIndicators",
				{
					"type": "crypto",
					"symbols": [
						"BTC",
						"ETH",
						"GRT",
						"XLM",
						"TRX"
					],
					"indicators": [
						{
							"fn": "sma",
							"cols": [
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
								],
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
							"args": [
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
								],
								[
									56
								],
								[
									112
								],
								[
									200
								],
								[
									550
								]
							]
						},
						{
							"fn": "ema",
							"cols": [
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
								],
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
							"args": [
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
								],
								[
									56
								],
								[
									112
								],
								[
									200
								],
								[
									550
								]
							]
						}
					],
					"context": {}
				}
			]
		]
	}
}