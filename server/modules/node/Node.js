const Schema = {
	APIDataSource: {
		$success: {
			FileDestination: {
				filePath: String,
			},
			Transformer_ToDataSet: {
				fn: Function,
				$success: {
					FileDestination: {
						filePath: String,
					},
					FunctionIterator_TechnicalIndicators: {
						fns: [ ...Function ],
						$success: {
							FileDestination: {
								filePath: String,
							},
						},
					},
				},
			},
		},
	},
};

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

		this.fn = fn;
		this.successNodes = [];
		this.failureNodes = [];
		this.status = Node.EnumStatusType.PENDING;
		this.lastResult = null;
		this.context = {};
	}

	async run(input = {}) {
		this.status = Node.EnumStatusType.RUNNING;
		this.emit(Node.EnumStatusType.RUNNING, this);

		try {
			const output = await this.fn(input, this.context);
			this.status = Node.EnumStatusType.SUCCESS;
			this.lastResult = output;
			this.successNodes.forEach(node => node.run(output));
			this.emit(Node.EnumStatusType.SUCCESS, output);
		} catch(error) {
			this.status = Node.EnumStatusType.FAILED;
			this.lastResult = error;
			this.failureNodes.forEach(node => node.run(error));
			this.emit(Node.EnumStatusType.FAILED, error);
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