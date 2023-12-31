{
	"id": "30bcc8bb-f714-4558-888e-49b49312eeff",
	"pid": null,
	"type": "service",
	"username": "test",
	"config": {
		"pipelines": [
			[
				"plotly",
				"PlotlyChart",
				{
					"type": "crypto",
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