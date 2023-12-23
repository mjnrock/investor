import { Circuit } from "./Circuit.js";
import Node from "./Node.js";

/**
 * The Pipeline is a simplified Circuit that connects each
 * node to the next in a linear fashion and invoking the
 * Pipeline will invoke the chain.  Use this if you don't
 * need the added complexity of a graph, but instead just
 * need a sequential chain of nodes.
 */
export class Pipeline extends Circuit {
	constructor (...nodes) {
		super();

		this.addNodes(nodes);
	}

	static Create(...nodes) {
		return new Pipeline(...nodes);
	}

	addNodes(nodes = []) {
		if(nodes.length === 0) return;

		// Connect the first node to the Pipeline itself
		this.connectSuccess(nodes[ 0 ]);

		let lastNode = nodes[ 0 ];
		this.nodes.set(lastNode.id, lastNode);

		nodes.slice(1).forEach(node => {
			if(!(node instanceof Node)) {
				throw new Error("All items must be instances of Node.");
			}

			// Connect each subsequent node to the last
			lastNode.connectSuccess(node);

			// Update the lastNode reference and add to the circuit's node map
			lastNode = node;
			this.nodes.set(node.id, node);
		});
	}

	/**
	 * Note the differing order of input and context, compared
	 * to a Node.
	 */
	async run(context = {}, input = {}) {
		// Set the context for all nodes in the pipeline
		for(const node of this.nodes.values()) {
			node.setContext(context);
		}

		return await super.run(context, input);
	}
}

export default Pipeline;