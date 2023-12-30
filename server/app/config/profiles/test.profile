{
	"id": "30bcc8bb-f714-4558-888e-49b49312eeff",
	"pid": null,
	"type": "user",
	"username": "test",
	"bio": {
		"first": "Test",
		"last": "User"
	},
	"config": {
		"pipelines": [
			[
				"plotly",
				"PlotlyChart",
				{
					"type": "cryptos",
					"fileName": "BTC.ds",
					"traceArrays": [
						[
							"date",
							"close"
						]
					]
				}
			]
		]
	}
}