export const DMA = (data, ranges = 200) => {
	let dmaResults = {};
	if(!Array.isArray(ranges)) {
		ranges = [ ranges ];
	}

	for(const symbol in data) {
		// Adjusting to the structure of cryptocurrency data
		let timeSeries = data[ symbol ][ "Time Series (Digital Currency Daily)" ];
		dmaResults[ symbol ] = {};

		ranges.forEach(range => {
			let movingAverages = [];
			let dateKeys = Object.keys(timeSeries).sort().reverse();

			for(let i = 0; i <= dateKeys.length - range; i++) {
				let sum = 0;
				for(let j = i; j < i + range; j++) {
					// Using '4a. close (USD)' for cryptocurrency data
					sum += parseFloat(timeSeries[ dateKeys[ j ] ][ "4a. close (USD)" ]);
				}

				let dmaValue = sum / range,
					mark = parseFloat(timeSeries[ dateKeys[ i ] ][ "4a. close (USD)" ]),
					delta = mark - dmaValue,
					ratio = delta / dmaValue;

				movingAverages.push({
					date: dateKeys[ i ],
					symbol,
					type: "DMA",
					range,           // The DMA window
					value: dmaValue, // The DMA value
					mark,            // The closing price
					delta,           // The difference between the closing price and the DMA value
					ratio,           // The ratio of the difference to the DMA value
				});
			}

			dmaResults[ symbol ][ +range ] = movingAverages;
		});
	}

	return dmaResults;
};

export default DMA;