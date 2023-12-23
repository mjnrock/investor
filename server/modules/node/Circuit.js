import { Node } from "./Node.js";

export class Circuit extends Node {
	constructor (fn = Circuit.Run) {
		super(fn);

		this.nodes = new Map();
	}

	static Create(fn) {
		return new Circuit(fn);
	}

	createNode(fn) {
		const node = new Node(fn);

		// Forward events from individual nodes to the circuit level
		node.on(Node.EnumStatusType.SUCCESS, data => this.emit(Node.EnumStatusType.SUCCESS, node.id, data));
		node.on(Node.EnumStatusType.FAILED, error => this.emit(Node.EnumStatusType.FAILED, node.id, error));

		this.nodes.set(node.id, node);  // Add the new node to the collection
		return node;
	}

	connect(nodeId1, nodeId2, type = Node.EnumStatusType.SUCCESS) {
		const node1 = this.nodes.get(nodeId1);
		const node2 = this.nodes.get(nodeId2);

		console.log(node1.id, node2.id)

		if(!node1 || !node2) {
			throw new Error("Invalid node IDs provided for connection.");
		}

		if(type === Node.EnumStatusType.SUCCESS) {
			node1.connectSuccess(node2);
		} else if(type === Node.EnumStatusType.FAILED) {
			node1.connectFailure(node2);
		}
	}


	removeNode(nodeId) {
		if(!this.nodes.has(nodeId)) {
			throw new Error(`Node with ID ${ nodeId } not found.`);
		}

		this.nodes.delete(nodeId);  // Remove the node from the collection
	}

	getNodeStatus(nodeId) {
		const node = this.nodes.get(nodeId);

		if(!node) {
			throw new Error(`Node with ID ${ nodeId } not found.`);
		}

		return node.getStatus();
	}

	resetCircuit() {
		this.nodes.forEach(node => node.resetState());  // Reset the state of all nodes
	}

	static async Run(self, context = {}, input = {}) {
		self.setContext(context);
		self.status = Node.EnumStatusType.RUNNING;
		self.emit(Node.EnumStatusType.RUNNING, this);

		try {
			let currentInput = input; // Start with the initial input
			let lastOutput;

			// Iterate over successNodes and execute them in sequence
			for(const node of self.successNodes) {
				lastOutput = await node.run(currentInput, self.context);
				currentInput = lastOutput; // Output of one node is the input to the next
			}

			// After successful execution of all success nodes
			self.status = Node.EnumStatusType.SUCCESS;
			self.lastResult = lastOutput; // Final output from the success node chain
			self.emit(Node.EnumStatusType.SUCCESS, self.lastResult);
		} catch(error) {
			// In case of an error, execute the failure nodes
			let currentError = error;
			let lastErrorOutput;

			for(const node of self.failureNodes) {
				try {
					lastErrorOutput = await node.run(currentError, self.context);
					currentError = lastErrorOutput; // Output of one failure node is the input to the next
				} catch(innerError) {
					currentError = innerError; // If a failure node fails, continue with the next
				}
			}

			// After executing failure nodes (regardless of whether they succeeded or failed)
			self.status = Node.EnumStatusType.FAILED;
			self.lastResult = currentError; // Final error or output from the failure node chain
			self.emit(Node.EnumStatusType.FAILED, self.lastResult);
		}

		return self.lastResult;
	}

	/**
	 * Note the differing order of input and context, compared
	 * to a Node.
	 */
	async run(context = {}, input = {}) {
		return await Circuit.Run(this, context, input);
	}
}

export default Circuit;