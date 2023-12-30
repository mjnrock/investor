import { Worker } from "worker_threads";

export class ThreadPool {
	constructor (size, fn) {
		this.size = size;
		this.fn = fn.toString();
		this.isLocked = false; // Add a lock flag

		this.workers = [];
		this.taskQueue = [];
		this.results = [];
		this.resolvers = [];
		this.init();
	}

	init() {
		this.terminate();

		for(let i = 0; i < this.size; i++) {
			const workerScript = `
                const { parentPort } = require("worker_threads");
                parentPort.on("message", async (message) => {
                    let fn = eval('(' + ${ this.fn } + ')');
                    const result = await fn(message.record);

                    //console.log("Worker-${ i }:", result);
                    parentPort.postMessage({ result, index: message.index });
                });
            `;

			const worker = new Worker(workerScript, { eval: true });
			worker.on("message", ({ result, index }) => {
				this.results[ index ] = result;
				this.resolvers[ index ](result);
				this.assignNextTask(worker);
			});

			this.workers.push(worker);
		}
	}

	assignNextTask(worker) {
		if(this.taskQueue.length > 0) {
			const { record, index } = this.taskQueue.shift();
			worker.postMessage({ record, index });
		}
	}

	process(records) {
		if(this.isLocked) {
			console.error('ThreadPool is locked. Unable to process.');
			return Promise.reject(new Error('ThreadPool is locked'));
		}

		this.results = new Array(records.length);
		this.resolvers = new Array(records.length);
		this.taskQueue = records.map((record, index) => ({ record, index }));

		const promises = this.taskQueue.map((_, index) =>
			new Promise(resolve => {
				this.resolvers[ index ] = resolve;
			})
		);

		// Assign initial tasks to all workers
		this.workers.forEach(worker => {
			if(this.taskQueue.length > 0) {
				this.assignNextTask(worker);
			}
		});

		return Promise.all(promises);
	}

	lock() {
		this.isLocked = true;
	}

	unlock() {
		this.isLocked = false;
	}

	terminate() {
		for(const worker of this.workers) {
			worker.terminate();
		}
	}
};

export default ThreadPool;