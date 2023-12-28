import { workerData, parentPort } from "worker_threads";

parentPort.on("message", (...args) => {
	const { fn: fnString } = workerData;
	const fn = eval(`(${ fnString })`);

	parentPort.postMessage(fn(...args));
});