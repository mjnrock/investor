import { Worker } from "worker_threads";
import os from "os";

export class ThreadPool {
	constructor (config = {}) {
		this.numThreads = config.numThreads || os.cpus().length;
		this.workers = [];
		this.tasks = [];

		this.init();
	}

	init() {
		for(let i = 0; i < this.numThreads; i++) {
			this.workers.push(this.createWorker());
		}

		return this;
	}

	createWorker() {
		const worker = new Worker("./Worker.js");
		worker.on("message", (result) => {
			this.handleResult(result);
			if(this.tasks.length > 0) {
				const task = this.tasks.shift();
				worker.postMessage(task);
			}
		});
		return worker;
	}

	execute(fn, ...args) {
		const task = { fn: fn.toString(), args };
		const idleWorker = this.workers.find(worker => worker.threadId === null);
		if(idleWorker) {
			idleWorker.postMessage(task);
		} else {
			this.tasks.push(task);
		}

		return this;
	}

	handleResult(result) {
		console.log("Task completed with result:", result);
	}
};

export default ThreadPool;