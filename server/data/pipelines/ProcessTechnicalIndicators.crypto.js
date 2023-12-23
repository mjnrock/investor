import tulind from "tulind";

export async function processIndicators(data, indicators) {
	const processIndicator = (indicatorName, inputs, args) => {
		return new Promise((resolve, reject) => {
			if(!tulind.indicators[ indicatorName ]) {
				return reject(new Error(`Indicator ${ indicatorName } not found in tulind`));
			}

			tulind.indicators[ indicatorName ].indicator(inputs, args, (err, result) => {
				if(err) {
					return reject(err);
				}
				resolve(result);
			});
		});
	};

	let results = [];

	for(let indicatorConfig of indicators) {
		const { fn: indicatorName, cols, args } = indicatorConfig;

		for(let i = 0; i < cols.length; i++) {
			const colSet = cols[ i ];
			const argSet = args[ i ];

			// Construct input arrays based on cols
			const inputs = colSet.map(col => data.data.map(item => parseFloat(item[ col ])));

			try {
				const indicatorResults = await processIndicator(indicatorName, inputs, argSet);
				console.log(`Result of ${ indicatorName } is:`, indicatorResults[ 0 ]);

				// Calculate the starting index for the data to align with the indicator results
				const startIndex = inputs[ 0 ].length - indicatorResults[ 0 ].length;

				const resultData = indicatorResults[ 0 ].map((value, index) => ({
					date: data.data[ startIndex + index ].date,
					value
				}));

				results.push({
					meta: {
						...data.meta, // Add other necessary metadata

						technicalAnalysis: {
							fn: indicatorName,
							cols: colSet,
							args: argSet
						},
					},
					data: resultData
				});
			} catch(error) {
				console.error(`Error processing ${ indicatorName }:`, error);
			}
		}
	}

	return results;
};

setTimeout(() => {
	fetch("http://buddha.com:3801/cryptos")
		.then(res => res.json())
		.then(data => {
			processIndicators(data, [
				{
					fn: "sma",
					cols: [
						[ "open" ],
						[ "close" ],
					],
					args: [
						[ 7 ],
						[ 7 ],
					],
				},
				{
					fn: "stoch",
					cols: [
						[ "high", "low", "close" ],
					],
					args: [
						[ 7, 3, 3 ],
					],
				},
			])
		});
}, 1000);

export default processIndicators;