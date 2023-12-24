import { Circuit } from "./Circuit.js";
import Node from "./Node.js";

export class Pipeline extends Circuit {
	constructor (...nodes) {
		super();
		this.nodes = [];  // Array to hold the nodes in sequence
		this.cache = [];  // Array to store the results of each node
		this.addNodes(nodes);
	}

	static Create(...nodes) {
		return new Pipeline(...nodes);
	}

	addNodes(nodes = []) {
		nodes.forEach(node => {
			if(!(node instanceof Node)) {
				throw new Error("All items must be instances of Node.");
			}
			this.nodes.push(node);  // Add nodes to the sequence
		});
	}

	async run(context = {}, input = {}) {
		this.setContext(context);
		let currentInput = input;

		for(const [ index, node ] of this.nodes.entries()) {
			this.status = Node.EnumStatusType.RUNNING;
			try {
				const output = await node.run(currentInput, this.context);
				this.cache[ index ] = { node: node.id, output: output };  // Store the result in the cache
				currentInput = output;  // Output of one node is the input to the next
			} catch(error) {
				this.status = Node.EnumStatusType.FAILED;
				this.cache[ index ] = { node: node.id, error: error };  // Store the error in the cache
				throw error;  // Handle the error as needed
			}
		}

		this.status = Node.EnumStatusType.SUCCESS;
		return this.cache;  // Optionally return the cache containing all results
	}
}

export default Pipeline;