import { v4 as uuid } from "uuid";
import EventEmitter from "events";

export class Node extends EventEmitter {
	static EnumStatusType = {
		PENDING: "pending",
		RUNNING: "running",
		SUCCESS: "success",
		FAILED: "failed",
	};

	constructor (fn) {
		super();

		this.id = uuid();

		if(typeof fn === "function" || (typeof fn === "object" && typeof fn.run === "function")) {
			this.fn = fn;
		} else {
			throw new Error("Invalid argument: fn must be a function or an object with a run method.");
		}

		this.fn = fn;
		this.successNodes = [];
		this.failureNodes = [];
		this.status = Node.EnumStatusType.PENDING;
		this.cache = [];
		this.context = {};
	}

	static Create(fn) {
		return new Node(fn);
	}

	async run(input = {}, context = {}) {
		this.cache = [];
		this.setContext(context);
		this.status = Node.EnumStatusType.RUNNING;
		this.emit(Node.EnumStatusType.RUNNING, this);
		try {
			const output = await (typeof this.fn === "function" ? this.fn(input, this.context) : this.fn.run(input, this.context));
			this.status = Node.EnumStatusType.SUCCESS;
			this.cache.push({ output: output, type: 'success' });
			this.emit(Node.EnumStatusType.SUCCESS, output);
			return output;
		} catch(error) {
			this.status = Node.EnumStatusType.FAILED;
			this.cache.push({ output: error, type: 'failure' });
			this.emit(Node.EnumStatusType.FAILED, error);
			throw error;
		}
	}

	connectSuccess(node) {
		this.successNodes.push(node);
		return this;
	}
	removeSuccess(node) {
		this.successNodes = this.successNodes.filter(n => n !== node);
		return this;
	}

	connectFailure(node) {
		this.failureNodes.push(node);
		return this;
	}
	removeFailure(node) {
		this.failureNodes = this.failureNodes.filter(n => n !== node);
		return this;
	}

	setContext(context) {
		this.context = { ...this.context, ...context };
		return this;
	}

	resetState() {
		this.status = Node.EnumStatusType.PENDING;
		this.lastResult = null;
		return this;
	}
}

export default Node;