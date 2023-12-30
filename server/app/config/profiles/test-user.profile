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
				"technical-analysis",
				"ProcessTechnicalIndicators",
				{
					"type": "cryptos",
					"symbols": [
						"BTC"
					],
					"indicators": [
						{
							"fn": "sma",
							"cols": [
								[
									"close"
								]
							],
							"args": [
								[
									7
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