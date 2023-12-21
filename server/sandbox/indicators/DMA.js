export const DMA = (data, ranges = 200) => {
	let dmaResults = {};
	if(!Array.isArray(ranges)) {
		ranges = [ ranges ];
	}

	for(const symbol in data) {
		let timeSeries = data[ symbol ][ "Time Series (Daily)" ];
		dmaResults[ symbol ] = {};

		ranges.forEach(range => {
			let movingAverages = [];
			let dateKeys = Object.keys(timeSeries).sort().reverse();

			for(let i = 0; i <= dateKeys.length - range; i++) {
				let sum = 0;
				for(let j = i; j < i + range; j++) {
					sum += parseFloat(timeSeries[ dateKeys[ j ] ][ "4. close" ]);
				}
				movingAverages.push({
					date: dateKeys[ i ],
					type: "DMA",
					range,
					value: sum / range
				});
			}

			dmaResults[ symbol ] = movingAverages;
		});
	}

	return dmaResults;
};

export default DMA;