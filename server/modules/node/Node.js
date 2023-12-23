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
		this.lastResult = null;
		this.context = {};
	}

	static Create(fn) {
		return new Node(fn);
	}

	async run(input = {}) {
		this.status = Node.EnumStatusType.RUNNING;
		this.emit(Node.EnumStatusType.RUNNING, this);

		try {
			const output = typeof this.fn === "function" ?
				await this.fn(input, this.context) :
				await this.fn.run(input, this.context);

			this.status = Node.EnumStatusType.SUCCESS;
			this.lastResult = output;
			for(const node of this.successNodes) {
				await node.run(output);
			}
			this.emit(Node.EnumStatusType.SUCCESS, output);
		} catch(error) {
			this.status = Node.EnumStatusType.FAILED;
			this.lastResult = error;
			for(const node of this.failureNodes) {
				await node.run(error);
			}
			this.emit(Node.EnumStatusType.FAILED, error);
		}

		return this.lastResult;
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