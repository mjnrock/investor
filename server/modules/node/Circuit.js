import { Node } from "./Node.js";

export class Circuit extends Node {
	constructor (fn) {
		super(fn);

		this.nodes = new Map();
	}

	createNode(fn, nodeId) {
		const node = new Node(fn);

		// Forward events from individual nodes to the circuit level
		node.on(Node.EnumStatusType.SUCCESS, data => this.emit(Node.EnumStatusType.SUCCESS, nodeId, data));
		node.on(Node.EnumStatusType.FAILED, error => this.emit(Node.EnumStatusType.FAILED, nodeId, error));

		this.nodes.set(nodeId, node);  // Add the new node to the collection
		return node;
	}

	connect(nodeId1, nodeId2, type = Node.EnumStatusType.SUCCESS) {
		const node1 = this.nodes.get(nodeId1);
		const node2 = this.nodes.get(nodeId2);

		if(!node1 || !node2) {
			throw new Error("Invalid node IDs provided for connection.");
		}

		if(type === Node.EnumStatusType.SUCCESS) {
			node1.connectSuccess(node2);
		} else if(type === Node.EnumStatusType.FAILED) {
			node1.connectFailure(node2);
		}
	}

	runNode(nodeId, input, context = {}) {
		const node = this.nodes.get(nodeId);

		if(!node) {
			throw new Error(`Node with ID ${ nodeId } not found.`);
		}

		node.setContext(context);
		node.run(input);
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

	async run(input = {}, context = {}) {
		this.setContext(context);
		this.status = Node.EnumStatusType.RUNNING;
		this.emit(Node.EnumStatusType.RUNNING, this);

		try {
			let currentInput = input; // Start with the initial input
			let lastOutput;

			// Iterate over successNodes and execute them in sequence
			for(const node of this.successNodes) {
				lastOutput = await node.run(currentInput);
				currentInput = lastOutput; // Output of one node is the input to the next
			}

			// After successful execution of all success nodes
			this.status = Node.EnumStatusType.SUCCESS;
			this.lastResult = lastOutput; // Final output from the success node chain
			this.emit(Node.EnumStatusType.SUCCESS, this.lastResult);
		} catch(error) {
			// In case of an error, execute the failure nodes
			let currentError = error;
			let lastErrorOutput;

			for(const node of this.failureNodes) {
				try {
					lastErrorOutput = await node.run(currentError);
					currentError = lastErrorOutput; // Output of one failure node is the input to the next
				} catch(innerError) {
					currentError = innerError; // If a failure node fails, continue with the next
				}
			}

			// After executing failure nodes (regardless of whether they succeeded or failed)
			this.status = Node.EnumStatusType.FAILED;
			this.lastResult = currentError; // Final error or output from the failure node chain
			this.emit(Node.EnumStatusType.FAILED, this.lastResult);
		}
	}
}

export default Circuit;