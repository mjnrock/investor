import ModNode from "../../modules/node/lib/package.js";

// Helper to create a node from a class or function
export const createNode = (item) => {
	if(typeof item === "function" || (item && typeof item.run === "function")) {
		return ModNode.Node.Create(item);
	}
	throw new Error("Invalid node item");
};

// Helper to create a pipeline from an array of nodes
export const createPipeline = (items) => {
	const nodes = items.map(item => Array.isArray(item) ? createPipeline(item) : createNode(item));
	return ModNode.Pipeline.Create(...nodes);
};

// Pipeline structure creation factory
export const pipelineFactory = (config) => {
	const structure = config.map(item => Array.isArray(item) ? createPipeline(item) : createNode(item));
	return createPipeline(structure);
};

export default pipelineFactory;