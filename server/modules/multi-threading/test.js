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


//NOTE: I'm not convinced that this class works correctly yet
const records = [];
const max = 100000;
for(let i = 0; i < max; ++i) {
	records.push({
		$index: i,
	});
}

const pool = new ThreadPool(4, FN);
console.time("Pool");
pool.process(records)
	.finally(() => {
		console.timeEnd("Pool");

		pool.terminate();
	});

// const pool1 = new ThreadPool(1, FN);
// const pool2 = new ThreadPool(2, FN);
// const pool4 = new ThreadPool(4, FN);
// const pool8 = new ThreadPool(8, FN);

// console.time("Pool");
// pool1.process(records)
// 	.finally(() => {
// 		console.timeEnd("Pool");

// 		pool1.terminate();
// 	});

// console.time(`Pool2`);
// pool2.process(records)
// 	.finally(() => {
// 		console.timeEnd(`Pool2`);

// 		pool2.terminate();
// 	});

// console.time(`Pool4`);
// pool4.process(records)
// 	.finally(() => {
// 		console.timeEnd(`Pool4`);

// 		pool4.terminate();
// 	});

// console.time(`Pool8`);
// pool8.process(records)
// 	.finally(() => {
// 		console.timeEnd(`Pool8`);

// 		pool8.terminate();
// 	});