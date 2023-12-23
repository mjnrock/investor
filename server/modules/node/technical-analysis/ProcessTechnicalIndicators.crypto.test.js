import processIndicators from "./ProcessTechnicalIndicators.crypto.js";

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