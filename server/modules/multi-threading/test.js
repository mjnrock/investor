import { ThreadPool } from "./ThreadPool.js";

// Usage example
const FN = async function (record) {
	// Simulate async operation
	return {
		...record,
		$processed: true,
		$ts: Date.now(),
	};
};


const records = [
	{ data: "Hello world" },
	{ data: "Another record" },
	{ data: "Yet another record" },
	{ data: "Yet another record 2" },
	{ data: "Yet another record 3" },
	{ data: "Hello world" },
	{ data: "Another record" },
	{ data: "Yet another record" },
	{ data: "Yet another record 2" },
	{ data: "Yet another record 3" },
	{ data: "Hello world" },
	{ data: "Another record" },
	{ data: "Yet another record" },
	{ data: "Yet another record 2" },
	{ data: "Yet another record 3" },
	{ data: "Hello world" },
	{ data: "Another record" },
	{ data: "Yet another record" },
	{ data: "Yet another record 2" },
	{ data: "Yet another record 3" },
	{ data: "Hello world" },
	{ data: "Another record" },
	{ data: "Yet another record" },
	{ data: "Yet another record 2" },
	{ data: "Yet another record 3" },
];

const pool1 = new ThreadPool(1, FN);
const pool2 = new ThreadPool(2, FN);
const pool4 = new ThreadPool(4, FN);
const pool8 = new ThreadPool(8, FN);

console.time("Pool");
pool1.process(records)
	.finally(() => {
		console.timeEnd("Pool");

		pool1.terminate();
	});

console.time(`Pool2`);
pool2.process(records)
	.finally(() => {
		console.timeEnd(`Pool2`);

		pool2.terminate();
	});

console.time(`Pool4`);
pool4.process(records)
	.finally(() => {
		console.timeEnd(`Pool4`);

		pool4.terminate();
	});

console.time(`Pool8`);
pool8.process(records)
	.finally(() => {
		console.timeEnd(`Pool8`);

		pool8.terminate();
	});