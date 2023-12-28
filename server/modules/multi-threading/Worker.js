import { parentPort } from "worker_threads";

parentPort.on("message", task => {
	const { fn, args } = task;
	const functionToExecute = new Function(`return ${ fn }`)();
	const result = functionToExecute(...args);

	parentPort.postMessage(result);
});